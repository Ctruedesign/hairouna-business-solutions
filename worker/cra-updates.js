export const SOURCES = [
  {id:'individuals',label:'Individuals',url:'https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/esrvc-srvce/rss/t1gtrdy-eng.xml'},
  {id:'businesses',label:'Businesses',url:'https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/esrvc-srvce/rss/bsnsss-eng.xml'},
  {id:'gst-hst',label:'GST/HST',url:'https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/esrvc-srvce/rss/xcsgsthst-eng.xml'},
  {id:'news',label:'Tax tips & alerts',url:'https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/esrvc-srvce/rss/mdrm-eng.xml'},
  {id:'announcements',label:'CRA announcements',url:'https://api.io.canada.ca/io-server/gc/news/en/v2?atomtitle=Canada+Revenue+Agency&dept=revenueagency&format=atom&orderBy=desc&pick=50&publishedDate%3E=2021-07-23&sort=publishedDate'},
];
const YEAR = 365 * 24 * 60 * 60 * 1000;
const decode = text => text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_,key) => {
  if(key[0] === '#') {const n = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2),16) : Number(key.slice(1));return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';}
  return {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[key.toLowerCase()];
});
const plain = text => decode(text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
const tag = (xml,name) => xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'))?.[1] || '';
export function officialLink(link) {
  try {
    const u = new URL(decode(link));
    if(u.protocol !== 'https:' || u.hostname !== 'www.canada.ca' || !u.pathname.startsWith('/en/revenue-agency/') || u.username || u.password) return null;
    u.search='';u.hash='';return u.href;
  } catch {return null;}
}
export function parseFeed(xml, source, now = Date.now()) {
  if(!/<feed[\s>]/i.test(xml) || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('Invalid CRA Atom feed');
  const entries = [...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi)];
  if(!entries.length) throw Error('CRA feed contains no entries');
  const items = [];
  for(const [,entry] of entries) {
    const title = plain(tag(entry,'title')).slice(0,250);
    const links = [...entry.matchAll(/<link\b([^>]*?)\/?\s*>/gi)].map(([,attrs]) => {
      const get = key => attrs.match(new RegExp(`\\b${key}\\s*=\\s*(["'])(.*?)\\1`,'i'))?.[2];
      return {href:get('href'),rel:get('rel')};
    });
    const url = officialLink(links.find(link => !link.rel || link.rel === 'alternate')?.href || plain(tag(entry,'id')));
    const published = Date.parse(plain(tag(entry,'published')));
    const updated = Date.parse(plain(tag(entry,'updated')));
    const date = Number.isFinite(published) ? published : updated;
    if(!title || !url || !Number.isFinite(date) || date > now || date < now - YEAR) continue;
    items.push({title,url,publishedAt:new Date(date).toISOString(),categories:[source.id]});
  }
  return items.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,25);
}
export async function refreshUpdates({fetcher = fetch, previous = null, now = Date.now()} = {}) {
  const checkedAt = new Date(now).toISOString();
  const results = await Promise.allSettled(SOURCES.map(async source => {
    const response = await fetcher(source.url,{signal:AbortSignal.timeout(12000),redirect:'error',headers:{Accept:'application/atom+xml, application/xml'}});
    if(!response.ok) throw Error(`CRA feed returned ${response.status}`);
    const xml = await response.text();
    if(xml.length > 4_000_000) throw Error('CRA feed too large');
    return parseFeed(xml,source,now);
  }));
  const byUrl = new Map();
  const sources = SOURCES.map((source,i) => {
    const result = results[i], old = previous?.sources?.find(s=>s.id === source.id);
    const items = result.status === 'fulfilled' ? result.value : (previous?.items || []).filter(item => item.categories.includes(source.id));
    for(const item of items) {
      if(Date.parse(item.publishedAt) < now - YEAR) continue;
      const current = byUrl.get(item.url);
      if(current) {if(!current.categories.includes(source.id))current.categories.push(source.id);}
      else byUrl.set(item.url,{...item,categories:[source.id]});
    }
    return {id:source.id,label:source.label,checkedAt:result.status === 'fulfilled' ? checkedAt : old?.checkedAt || null,
      status:result.status === 'fulfilled' ? 'ok' : old?.checkedAt ? 'stale' : 'unavailable'};
  });
  const successful = sources.filter(s=>s.status === 'ok').length;
  return {checkedAt:successful ? checkedAt : previous?.checkedAt || null,attemptedAt:checkedAt,
    status:successful === SOURCES.length ? 'ok' : successful ? 'partial' : 'unavailable',sources,
    items:[...byUrl.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,100)};
}
export async function monthlyUpdates(storage, {now = Date.now(), refresh = refreshUpdates} = {}) {
  const month = new Date(now).toISOString().slice(0,7);
  const record = await storage.get('monthly-snapshot');
  if(record?.month === month) return record.payload;
  const unavailable = {...(record?.payload || {checkedAt:null,sources:[],items:[]}),status:'unavailable',attemptedAt:new Date(now).toISOString()};
  // Persist the attempt first: restarts and repeated triggers cannot fetch twice in a month.
  await storage.put('monthly-snapshot',{month,payload:unavailable});
  let payload;
  try {payload = await refresh({previous:record?.payload,now});}
  catch {payload = unavailable;}
  const next = new Date(now);
  payload.nextCheckAt = new Date(Date.UTC(next.getUTCFullYear(),next.getUTCMonth()+1,1,12)).toISOString();
  await storage.put('monthly-snapshot',{month,payload});
  return payload;
}
