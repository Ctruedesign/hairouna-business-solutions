import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,refreshUpdates,monthlyUpdates,SOURCES} from '../worker/cra-updates.js';
import worker,{CraMonthlyUpdates} from '../worker/index.js';
import {updateSnapshot} from '../scripts/update-cra.mjs';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const now = Date.parse('2026-10-03T12:00:00Z');
const link = 'https://www.canada.ca/en/revenue-agency/news/newsroom/tax-update.html';
const entry = ({title='Tax &amp; benefit update',url=link,date='2026-10-01T09:00:00-04:00'}={}) => `<entry><title>${title}</title><link rel="alternate" href="${url}"/><published>${date}</published><updated>${date}</updated></entry>`;
const feed = entries => `<feed xmlns="http://www.w3.org/2005/Atom">${entries}</feed>`;
const storage = () => {const items=new Map();return {get:async key=>structuredClone(items.get(key)),put:async(key,value)=>{items.set(key,structuredClone(value));}};};

test('CRA parser keeps dated Canadian source links and rejects unsafe, future and old items', () => {
  const xml=feed(entry()+entry({url:'javascript:alert(1)'})+entry({url:'https://www.irs.gov/news'})+entry({date:'2027-01-01T00:00:00Z'})+entry({date:'2020-01-01T00:00:00Z'})+entry({date:'invalid'}));
  const items=parseFeed(xml,SOURCES[0],now);
  assert.equal(items.length,1);assert.equal(items[0].title,'Tax & benefit update');assert.equal(items[0].url,link);
  assert.equal(items[0].publishedAt,'2026-10-01T13:00:00.000Z');
  assert.throws(()=>parseFeed('<html>Error</html>',SOURCES[0],now));
  assert.throws(()=>parseFeed('<!DOCTYPE feed><feed></feed>',SOURCES[0],now));
});

test('successful CRA feeds deduplicate links; failed sources preserve their earlier dates',async()=>{
  const previous={checkedAt:'2026-09-01T12:00:00Z',sources:[{id:'individuals',checkedAt:'2026-09-01T12:00:00Z'}],items:[{title:'Saved item',url:link+'/saved',publishedAt:'2026-09-01T12:00:00Z',categories:['individuals']}]};
  const result=await refreshUpdates({now,previous,fetcher:async url=>{if(url===SOURCES[0].url)throw Error('Offline');return new Response(feed(entry()));}});
  assert.equal(result.status,'partial');assert.equal(result.items.length,2);
  assert.equal(result.items.find(item=>item.url===link).categories.length,4);
  assert.equal(result.sources[0].status,'stale');assert.equal(result.sources[0].checkedAt,previous.checkedAt);
  const failed=await refreshUpdates({now,previous,fetcher:async()=>{throw Error('Offline');}});
  assert.equal(failed.status,'unavailable');assert.equal(failed.checkedAt,previous.checkedAt);assert.equal(failed.items.length,1);
});

test('monthly schedule persists across restarts and never retries CRA twice in the same month',async()=>{
  const saved=storage();let checks=0;
  const refresh=async()=>{checks++;return {status:'ok',checkedAt:new Date(now).toISOString(),items:[],sources:[]};};
  const first=await monthlyUpdates(saved,{now,refresh});
  assert.equal(first.nextCheckAt,'2026-11-01T12:00:00.000Z');
  await monthlyUpdates(saved,{now:now+20*86400000,refresh});assert.equal(checks,1);
  await monthlyUpdates(saved,{now:Date.parse('2026-11-01T12:00:00Z'),refresh});assert.equal(checks,2);
  const failing=storage();let attempts=0;const fail=async()=>{attempts++;throw Error('Offline');};
  assert.equal((await monthlyUpdates(failing,{now,refresh:fail})).status,'unavailable');
  await monthlyUpdates(failing,{now:now+10000,refresh:fail});assert.equal(attempts,1);
});

test('visitors only read the stored monthly snapshot, and unrelated routes keep serving assets',async()=>{
  const saved=storage(),payload={status:'ok',checkedAt:'2026-09-01T12:00:00Z',sources:[],items:[]};
  await saved.put('monthly-snapshot',{month:'2026-09',payload});
  const actor=new CraMonthlyUpdates({storage:saved,blockConcurrencyWhile:fn=>fn()});
  const response=await actor.fetch(new Request('https://cra.internal/snapshot'));
  assert.deepEqual(await response.json(),payload);
  const env={ASSETS:{fetch:async request=>new URL(request.url).pathname === '/cra-updates.json' ? Response.json(payload) : new Response('asset')}};
  assert.equal(await (await worker.fetch(new Request('https://hairounaholdingsinc.com/contact.html'),env)).text(),'asset');
  assert.equal((await worker.fetch(new Request('https://hairounaholdingsinc.com/api/cra-updates',{method:'POST'}),env)).status,405);
  const api=await worker.fetch(new Request('https://hairounaholdingsinc.com/api/cra-updates'),env);
  assert.equal(api.headers.get('Content-Type'),'application/json; charset=utf-8');assert.deepEqual(await api.json(),payload);
});

test('monthly repository job persists its month and skips additional fetches on repeat runs',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'cra-monthly-job-'));
  try {
    const path=join(directory,'snapshot.json');let calls=0;
    const refresh=async({now})=>{calls++;return {status:'ok',attemptedAt:new Date(now).toISOString(),checkedAt:new Date(now).toISOString(),sources:[],items:[]};};
    assert.equal((await updateSnapshot(path,{now,refresh})).changed,true);
    assert.equal((await updateSnapshot(path,{now:now+86400000,refresh})).changed,false);assert.equal(calls,1);
    assert.equal(JSON.parse(await readFile(path,'utf8')).nextCheckAt,'2026-11-01T12:00:00.000Z');
    assert.equal((await updateSnapshot(path,{now:Date.parse('2026-11-01T12:00:00Z'),refresh})).changed,true);assert.equal(calls,2);
  }finally{await rm(directory,{recursive:true,force:true});}
});
