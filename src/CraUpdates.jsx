import React from 'react';

const topics = [['all','All'],['individuals','Individuals'],['businesses','Businesses'],['gst-hst','GST/HST'],['news','Tips & alerts'],['announcements','Announcements']];
const date = value => new Intl.DateTimeFormat('en-CA',{dateStyle:'medium',timeZone:'America/Toronto'}).format(new Date(value));
export default function CraUpdates() {
  const [data,setData] = React.useState(null), [loading,setLoading] = React.useState(true), [topic,setTopic] = React.useState('all'), [retry,setRetry] = React.useState(0);
  React.useEffect(() => {
    let alive = true, controller;
    const load = async () => {
      controller?.abort();controller=new AbortController();
      const timeout = setTimeout(()=>controller.abort(),15000);
      setLoading(true);
      try {
        const response = await fetch('/api/cra-updates',{signal:controller.signal,cache:'no-store'});
        if(!response.ok) throw Error('Feed unavailable');
        const payload = await response.json();
        if(!Array.isArray(payload.items) || !Array.isArray(payload.sources)) throw Error('Invalid update response');
        if(alive)setData(payload);
      } catch {if(alive)setData(old=>old ? {...old,status:'unavailable'} : {status:'unavailable',items:[],sources:[]});}
      finally {clearTimeout(timeout);if(alive)setLoading(false);}
    };
    load();
    return () => {alive=false;controller?.abort();};
  }, [retry]);
  const source = data?.sources.find(s=>s.id === topic);
  const items = (data?.items || []).filter(item=>topic === 'all' || item.categories.includes(topic));
  return <div className="cra-updates">
    <p className="cra-intro">Official Canada Revenue Agency headlines, checked once per month. Open CRA’s notice for the complete details and who it applies to.</p>
    <div className="cra-topics" role="group" aria-label="CRA update topics">{topics.map(([id,label])=><button key={id} aria-pressed={topic === id} onClick={()=>setTopic(id)}>{label}</button>)}</div>
    <p className="cra-status" role="status">{loading ? 'Loading monthly CRA updates…' : data?.checkedAt ? `Last checked ${date(data.checkedAt)} at ${new Intl.DateTimeFormat('en-CA',{timeStyle:'short',timeZone:'America/Toronto'}).format(new Date(data.checkedAt))} Eastern` : 'Live updates are currently unavailable.'}</p>
    {!loading && data?.status !== 'ok' && <p className="cra-notice">{data?.items.length ? 'Some sources were unavailable at the monthly check. Previously retrieved headlines may be shown.' : 'We couldn’t retrieve the CRA feeds. You can still visit CRA directly.'} <button onClick={()=>setRetry(n=>n+1)}>Reload saved updates</button></p>}
    {source?.checkedAt && <p className="cra-status">{source.label} checked {date(source.checkedAt)}{source.status !== 'ok' ? ' · refresh unavailable' : ''}</p>}
    <div className="cra-headlines">{items.slice(0,12).map(item=><a key={item.url} href={item.url} target="_blank" rel="noreferrer"><time dateTime={item.publishedAt}>{date(item.publishedAt)}</time><strong>{item.title} <span aria-hidden="true">↗</span></strong></a>)}</div>
    {!loading && data?.status === 'ok' && !items.length && <p className="cra-notice">No headlines from the past year are available for this topic.</p>}
    {data?.nextCheckAt && <p className="cra-status">Next scheduled check: {date(data.nextCheckAt)}</p>}
    <a className="scene-link" href="https://www.canada.ca/en/revenue-agency/news/newsroom.html" target="_blank" rel="noreferrer">Visit the CRA newsroom ↗</a>
  </div>;
}
