import React from 'react';
import Journey from './Journey.jsx';
import Assistant from './Assistant';
import CraUpdates from './CraUpdates.jsx';
import './scene-experience.css';

export const views = [
  ['top', 'Arrival'], ['services', 'Personal & business'],
  ['services-more', 'Ongoing support'], ['clients', 'Who we help'],
  ['about', 'A clearer picture'], ['checklist', 'Be prepared'],
  ['faq', 'Your questions'], ['updates', 'CRA updates'], ['contact', 'Your next step'],
];
const serviceIds = ['personal-tax','corporate-tax','bookkeeping','payroll','gst-hst','statements','registration','audit'];

export default function SceneExperience({intro, paused, setPaused, replay, services, audiences, faqs, Tour}) {
  const fromHash = () => Math.max(0, views.findIndex(([id]) => id === location.hash.slice(1)));
  const [view, setView] = React.useState(fromHash);
  const [menu, setMenu] = React.useState(false);
  const [assistant, setAssistant] = React.useState(false);
  const [tour, setTour] = React.useState(false);
  const [faq, setFaq] = React.useState(0);
  const [departing, setDeparting] = React.useState(false);
  const transit = React.useRef(null);
  const heading = React.useRef(null);
  const lastMove = React.useRef(-Infinity);
  const wheel = React.useRef({total:0, time:0});
  const touch = React.useRef(null);
  const tourClose = React.useRef(null);
  const tourTrigger = React.useRef(null);
  const move = React.useCallback((next) => {
    const index = Math.max(0, Math.min(views.length - 1, next));
    if (index === view || transit.current) {setMenu(false); return;}
    setMenu(false);
    const arrive = () => {
      transit.current = null; setDeparting(false); setView(index);
      history.replaceState(null, '', '#' + views[index][0]);
    };
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) arrive();
    else {setDeparting(true); transit.current = setTimeout(arrive, 320);}
  }, [view, paused]);
  React.useEffect(() => () => clearTimeout(transit.current), []);
  React.useEffect(() => {
    const change = () => {clearTimeout(transit.current); transit.current = null; setDeparting(false); setView(fromHash()); setMenu(false);};
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  React.useEffect(() => {if (!intro) heading.current?.focus({preventScroll:true});}, [view, intro]);
  React.useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = old;};
  }, []);
  React.useEffect(() => {
    if (intro || menu || assistant || tour) return;
    const advance = (direction) => {
      const now = performance.now();
      if (now - lastMove.current < 850) return;
      lastMove.current = now; move(view + direction);
    };
    const inContent = (target) => {
      if (!(target instanceof Element)) return false;
      if (target.closest('.vision-header, .vision-controls, .vision-utilities, .assistant-panel')) return true;
      const copy = target.closest('.scene-copy');
      return !!copy && copy.scrollHeight > copy.clientHeight + 1;
    };
    const onWheel = (event) => {
      if (event.ctrlKey || inContent(event.target)) return;
      event.preventDefault();
      const now = performance.now();
      const amount = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (now - wheel.current.time > 160 || Math.sign(amount) !== Math.sign(wheel.current.total)) wheel.current.total = 0;
      wheel.current.time = now; wheel.current.total += amount;
      if (Math.abs(wheel.current.total) > 70) {advance(Math.sign(wheel.current.total)); wheel.current.total = 0;}
    };
    const onKey = (event) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, summary, [contenteditable="true"]')) return;
      if (['ArrowDown','ArrowRight','PageDown'].includes(event.key)) {event.preventDefault(); advance(1);}
      if (['ArrowUp','ArrowLeft','PageUp'].includes(event.key)) {event.preventDefault(); advance(-1);}
      if (event.key === 'Home') {event.preventDefault(); move(0);}
      if (event.key === 'End') {event.preventDefault(); move(views.length - 1);}
    };
    const start = (event) => {touch.current = inContent(event.target) ? null : {x:event.touches[0].clientX,y:event.touches[0].clientY};};
    const end = (event) => {
      if (!touch.current) return;
      const dx = touch.current.x - event.changedTouches[0].clientX;
      const dy = touch.current.y - event.changedTouches[0].clientY;
      const distance = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      touch.current = null;
      if (Math.abs(distance) > 55) advance(Math.sign(distance));
    };
    window.addEventListener('wheel', onWheel, {passive:false});
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', start, {passive:true});
    window.addEventListener('touchend', end, {passive:true});
    return () => {
      window.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', start); window.removeEventListener('touchend', end);
    };
  }, [intro, menu, assistant, tour, view, move]);
  React.useEffect(() => {
    if (!tour) return;
    tourClose.current?.focus();
    const keyboard = (event) => {
      if (event.key === 'Escape') setTour(false);
      if (event.key === 'Tab') {
        const items = [...document.querySelectorAll('.vision-tour button, .vision-tour a, .vision-tour video')].filter(el => el.tabIndex >= 0);
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
        else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => {window.removeEventListener('keydown', keyboard); tourTrigger.current?.focus();};
  }, [tour]);
  const titles = ['Peace of mind.', 'Your numbers. Our care.', 'Keep your business moving.', 'Support for your situation.', 'From paperwork to a clearer picture.', 'A little preparation goes a long way.', 'Questions, made simple.', 'The latest from CRA.', 'Let’s make the next step clear.'];
  return <main className={'vision-site cinema-ready' + (intro ? ' intro-playing' : '')} inert={intro ? true : undefined}>
    <Journey intro={intro} paused={paused} progress={view / (views.length - 1)} />
    <div className={'vision-interface view-' + view + (departing ? ' vision-departing' : '')} inert={tour ? true : undefined}>
      <header className="vision-header">
        <a className="brand" href="#top" onClick={event => {event.preventDefault();move(0);}}><span>H</span><div><b>HAIROUNA</b><small>BUSINESS SOLUTIONS INC.</small></div></a>
        <button className="vision-menu-button" aria-expanded={menu} aria-controls="vision-menu" onClick={() => setMenu(!menu)}>{menu ? 'Close ×' : 'Explore ☰'}</button>
        {menu && <nav id="vision-menu" className="vision-menu" aria-label="Main navigation">
          {views.map(([id,label],i) => <a key={id} href={'#'+id} aria-current={i === view ? 'page' : undefined} onClick={event => {event.preventDefault();move(i);}}>{label}</a>)}
          <a href="/pricing.html">Pricing</a><a href="/resources.html">Resources</a>
        </nav>}
      </header>
      <section key={view} className={'vision-scene' + (view === 0 ? ' vision-arrival' : '')} aria-labelledby="view-title">
        <div className="scene-copy">
          <p className="vision-kicker">{view === 0 ? 'BRAMPTON · SERVING CANADA' : `0${view} / ${views[view][1]}`}</p>
          <h1 id="view-title" tabIndex={-1} ref={heading}>{titles[view]}</h1>
          {view === 0 && <><p>Tax, bookkeeping and business support.</p><button className="scene-link" onClick={() => move(1)}>Enter the journey ↗</button></>}
          {(view === 1 || view === 2) && <div className="vision-service-list">{services.slice(view === 1 ? 0 : 4,view === 1 ? 4 : 8).map(([title,description],i) => <a key={title} href={'/services.html#' + serviceIds[i + (view === 2 ? 4 : 0)]}><strong>{title} <span aria-hidden="true">↗</span></strong><span>{description}</span></a>)}</div>}
          {view === 3 && <div className="vision-client-list">{audiences.map(([title,description],i) => <a key={title} href="/contact.html"><img src={`/serve-${i+1}.jpg`} alt="" /><span><strong>{title}</strong><small>{description}</small></span></a>)}</div>}
          {view === 4 && <><p>Good financial support brings the details together so you can see your next step.</p><ol className="vision-steps"><li><strong>Start with your situation.</strong><span>Tell us what you need. Plain language is welcome.</span></li><li><strong>Make a plan together.</strong><span>Understand the service, scope and information needed.</span></li><li><strong>Move forward, organized.</strong><span>Keep your filings, payroll and records in view.</span></li></ol><a className="scene-link" href="/about.html">Meet Hairouna ↗</a></>}
          {view === 5 && <><p>Gather your income slips, identification, receipts and self-employment records. Our Canadian tax checklist helps you get organized before filing.</p><a className="scene-link" href="/checklist.html">Open your checklist ↗</a></>}
          {view === 6 && <div className="vision-faq">{faqs.map(([q,a],i) => <div key={q}><button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? -1 : i)}>{q}<span aria-hidden="true">{faq === i ? '−' : '+'}</span></button>{faq === i && <p>{a}</p>}</div>)}</div>}
          {view === 7 && <CraUpdates />}
          {view === 8 && <><p>Book a free, no-pressure consultation. In person in Brampton, or virtually across Canada.</p><a className="scene-link" href="/contact.html">Book a consultation ↗</a><div className="vision-contact"><a href="tel:+14169081916">(416) 908-1916</a><a href="https://wa.me/14169081916" target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="mailto:info@hairounaholdingsinc.com">Email Hairouna ↗</a></div><small className="vision-legal">© {new Date().getFullYear()} Hairouna Business Solutions Inc.<br/>General information only; not professional advice.</small></>}
        </div>
      </section>
      <nav className="vision-controls" aria-label="Journey views">
        <button onClick={() => move(view-1)} disabled={view === 0} aria-label="Previous view">← Back</button>
        <span aria-live="polite" aria-atomic="true">{String(view+1).padStart(2,'0')} / {String(views.length).padStart(2,'0')} <span className="view-name">{views[view][1]}</span></span>
        <button onClick={() => move(view+1)} disabled={view === views.length-1} aria-label="Next view">Next →</button>
      </nav>
      <div className="vision-utilities"><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}</button><button onClick={replay}>Replay intro</button><button ref={tourTrigger} onClick={() => setTour(true)}>Watch tour</button><button onClick={() => setAssistant(true)} aria-expanded={assistant}>Ask HB</button></div>
      <Assistant open={assistant} close={() => setAssistant(false)} />
    </div>
    {tour && <div className="vision-tour" role="dialog" aria-modal="true" aria-label="Hairouna website tour"><button ref={tourClose} className="vision-tour-close" onClick={() => setTour(false)}>Close tour ×</button><Tour paused={paused || intro} /></div>}
  </main>;
}
