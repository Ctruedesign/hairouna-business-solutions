import React from 'react';
import { createRoot } from 'react-dom/client';
import { Building2, Calculator, Check, ChevronRight, FileCheck2, Landmark, Menu, ReceiptText, ShieldCheck, Sparkles, Users, WalletCards, X } from 'lucide-react';
import './styles.css';

const services = [
  ['Personal Tax', 'T1 returns and personal filing support.', ReceiptText],
  ['Corporate Tax', 'T2 corporate tax preparation and support.', Building2],
  ['Bookkeeping', 'Clear, organized books for better decisions.', Calculator],
  ['Payroll', 'Payroll administration and year-end support.', Users],
  ['GST / HST', 'Registration, filing and compliance support.', WalletCards],
  ['Financial Statements', 'Organized reporting for your business.', Landmark],
  ['Business Registration', 'Support getting your business set up.', FileCheck2],
  ['CRA Assistance', 'Practical help responding to CRA matters.', ShieldCheck],
];

const audiences = ['Individuals & Families', 'Contractors & Gig Workers', 'Trucking & Logistics', 'Restaurants', 'Construction & Trades', 'New Corporations'];

function GlassDocument() {
  return <div className="monolith-wrap" aria-hidden="true"><div className="monolith"><div className="chip"/><div className="form-lines">{Array.from({length:7}).map((_,i)=><i key={i}/>)}</div><div className="seal"><Check size={22}/></div><span className="vertical-word">HAIROUNA</span></div><div className="reflection"/></div>;
}

function App(){
  const [menu,setMenu]=React.useState(false);
  return <main>
    <header className="nav"><a className="brand" href="#top"><span>H</span><div><b>HAIROUNA</b><small>BUSINESS SOLUTIONS</small></div></a><nav className={menu?'open':''}><a href="#services">Services</a><a href="#clients">Who we help</a><a href="#about">Why Hairouna</a><a href="#contact">Contact</a><a className="nav-cta" href="#contact">Book a consultation</a></nav><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button></header>

    <section className="hero" id="top"><div className="stars"/><div className="moon"/><div className="mountains back"/><div className="mountains front"/><div className="mist"/>
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> TAX • BOOKKEEPING • BUSINESS</div><h1>Clarity for your finances.<br/><em>Confidence for what’s next.</em></h1><p>Professional tax, bookkeeping, payroll and business support designed to make the complicated feel clear.</p><div className="actions"><a className="primary" href="#contact">Book a consultation <ChevronRight/></a><a className="secondary" href="#services">Explore services</a></div><div className="trust"><span><Check/> Clear guidance</span><span><Check/> Business-focused</span><span><Check/> Canada-wide support</span></div></div>
      <GlassDocument/><div className="scroll">SCROLL TO EXPLORE <span>↓</span></div>
    </section>

    <section className="section intro" id="services"><div className="kicker">WHAT DO YOU NEED?</div><h2>One place for the financial work<br/>that keeps life and business moving.</h2><p className="lead">Choose a service to understand how Hairouna can support you.</p><div className="service-grid">{services.map(([title,text,Icon])=><article className="glass-card" key={title}><div className="icon"><Icon/></div><h3>{title}</h3><p>{text}</p><a href="#contact">Get support <ChevronRight size={16}/></a></article>)}</div></section>

    <section className="section audience" id="clients"><div className="kicker">BUILT AROUND REAL CLIENTS</div><h2>Your situation isn’t generic.<br/><em>Your support shouldn’t be either.</em></h2><div className="audience-row">{audiences.map((x,i)=><div className="audience-card" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Practical financial support shaped around the way you earn, operate and grow.</p></div>)}</div></section>

    <section className="section why" id="about"><div><div className="kicker">WHY HAIROUNA</div><h2>Less financial noise.<br/>More forward motion.</h2><p className="lead">We’re designing the Hairouna experience around a simple idea: make it easier to understand what needs attention and what comes next.</p></div><div className="why-stack"><div><b>01</b><h3>Start with your situation</h3><p>Tell us what you need help with, without having to know the accounting terminology first.</p></div><div><b>02</b><h3>Get a clear path</h3><p>We identify the relevant service and the information needed to move forward.</p></div><div><b>03</b><h3>Stay organized</h3><p>A cleaner process means fewer loose ends and better visibility into your financial work.</p></div></div></section>

    <section className="section checklist"><div className="folder"><span>2026</span><b>TAX<br/>CHECKLIST</b></div><div><div className="kicker">PREPARE WITH CONFIDENCE</div><h2>Know what to gather<br/>before you file.</h2><p className="lead">A simple Canadian tax checklist can help you arrive prepared and spend less time hunting for documents.</p><a className="primary" href="#contact">Request the checklist <ChevronRight/></a></div></section>

    <section className="section contact" id="contact"><div className="contact-panel"><div><div className="kicker">READY WHEN YOU ARE</div><h2>Let’s make the next step clear.</h2><p>Tell Hairouna what you need help with and the team can guide you toward the right service.</p></div><a className="primary" href="mailto:info@hairounaholdingsinc.com">Start a conversation <ChevronRight/></a></div></section>

    <footer><div className="brand"><span>H</span><div><b>HAIROUNA</b><small>BUSINESS SOLUTIONS</small></div></div><p>Tax • Bookkeeping • Payroll • Business Support</p><small>© {new Date().getFullYear()} Hairouna Business Solutions. All rights reserved.</small></footer>
    <button className="hb" aria-label="Hairouna assistant"><span>HB</span><i/></button>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);
