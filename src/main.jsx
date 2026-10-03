import { installDepth } from "../public/depth.js";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  Building2,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import "./styles.css";
import Assistant from "./Assistant";
const services = [
  ["Personal Tax", "T1 returns and personal filing support.", ReceiptText],
  [
    "Corporate Tax",
    "T2 corporate tax preparation and year-end support.",
    Building2,
  ],
  ["Bookkeeping", "Monthly, quarterly and catch-up bookkeeping.", Calculator],
  ["Payroll", "Payroll administration and year-end support.", Users],
  ["GST / HST", "Registration, filing and remittance support.", WalletCards],
  ["Financial Statements", "Clear reporting for your business.", Landmark],
  [
    "Business Registration",
    "Support getting your business set up.",
    FileCheck2,
  ],
  ["CRA Assistance", "Practical help responding to CRA matters.", ShieldCheck],
];
const audiences = [
  [
    "Individuals & Families",
    "Clear personal tax support from preparation through filing.",
  ],
  [
    "Contractors & Gig Workers",
    "Recordkeeping and tax support for independent earners.",
  ],
  [
    "Trucking & Logistics",
    "Organized books and tax support for owner-operators.",
  ],
  [
    "Restaurants",
    "Bookkeeping and payroll support for hospitality businesses.",
  ],
  [
    "Construction & Trades",
    "Financial organization for trades and growing crews.",
  ],
  ["New Corporations", "Practical support for newly incorporated businesses."],
];
const faqs = [
  [
    "Do you work with clients outside Brampton?",
    "Yes. Hairouna offers virtual support to clients across Canada.",
  ],
  [
    "What should I bring for a tax appointment?",
    "The exact documents depend on your situation. Start with your tax slips, identification and relevant receipts; Hairouna can confirm what else applies.",
  ],
  [
    "Can you help if my bookkeeping is behind?",
    "Yes. Contact the team with the period involved and the records you currently have so the right next step can be identified.",
  ],
  [
    "Do you support incorporated businesses?",
    "Yes. Hairouna supports corporate tax, bookkeeping, payroll, GST/HST, financial statements and related business needs.",
  ],
  [
    "Can you help with CRA questions?",
    "Hairouna offers CRA assistance. Keep the notice or correspondence you received so the situation can be reviewed.",
  ],
];
const INTRO_LOGO =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="Hairouna logo"><defs><radialGradient id="mOnyx" cx="35%" cy="26%" r="90%"><stop offset="0" stop-color="#27498a"/><stop offset=".45" stop-color="#102450"/><stop offset="1" stop-color="#050b1c"/></radialGradient><radialGradient id="mHalo" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#ffd76b" stop-opacity="0"/><stop offset=".8" stop-color="#ffd76b" stop-opacity=".28"/><stop offset="1" stop-color="#ffd76b" stop-opacity="0"/></radialGradient><linearGradient id="mRing" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#fff7d6"/><stop offset=".18" stop-color="#ffdf7e"/><stop offset=".38" stop-color="#f0b93c"/><stop offset=".55" stop-color="#9a6d1e"/><stop offset=".7" stop-color="#5e4312"/><stop offset=".85" stop-color="#e3b64a"/><stop offset="1" stop-color="#ffe9a8"/></linearGradient><linearGradient id="mSilver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f8ff"/><stop offset=".5" stop-color="#8fa3c0"/><stop offset="1" stop-color="#dfe8f5"/></linearGradient><linearGradient id="mFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3bd"/><stop offset=".38" stop-color="#ffd76b"/><stop offset=".55" stop-color="#d9a83c"/><stop offset=".82" stop-color="#8a6526"/><stop offset="1" stop-color="#c79b3d"/></linearGradient><linearGradient id="mEdge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><linearGradient id="mSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><clipPath id="mClip"><circle cx="120" cy="120" r="110"/></clipPath></defs><circle class="mhalo" cx="120" cy="120" r="118" fill="url(#mHalo)"/><circle cx="120" cy="120" r="110" fill="url(#mOnyx)"/><circle cx="120" cy="120" r="109" fill="none" stroke="#4f79c9" stroke-width="1" opacity=".45"/><circle cx="120" cy="120" r="103" fill="none" stroke="url(#mRing)" stroke-width="8"/><circle cx="120" cy="120" r="96.5" fill="none" stroke="url(#mSilver)" stroke-width="1.6" opacity=".8"/><g class="mrot"><circle cx="120" cy="120" r="103" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="30 617" stroke-opacity=".85"/><circle cx="120" cy="120" r="103" fill="none" stroke="#ffe9a8" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 633" stroke-dashoffset="-320" stroke-opacity=".7"/></g><g class="mrot2"><circle cx="120" cy="120" r="96.5" fill="none" stroke="#f4f8ff" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="20 586" stroke-opacity=".65"/></g><g><rect x="76" y="66" width="16" height="108" fill="url(#mFace)"/><rect x="76" y="66" width="3.4" height="108" fill="url(#mEdge)" opacity=".6"/><rect x="148" y="66" width="16" height="108" fill="url(#mFace)"/><rect x="148" y="66" width="3.4" height="108" fill="url(#mEdge)" opacity=".6"/><rect x="92" y="112" width="56" height="15" fill="url(#mFace)"/><rect x="92" y="112" width="56" height="3" fill="#fff7d6" opacity=".7"/></g><g clip-path="url(#mClip)"><rect class="mswp" x="60" y="0" width="90" height="240" fill="url(#mSheen)"/></g><g fill="#fff8dc"><path class="mgl" d="M62 44 l2.2 5.6 5.6 2.2 -5.6 2.2 -2.2 5.6 -2.2 -5.6 -5.6 -2.2 5.6 -2.2 Z"/><path class="mgl g2" d="M178 182 l1.9 4.8 4.8 1.9 -4.8 1.9 -1.9 4.8 -1.9 -4.8 -4.8 -1.9 4.8 -1.9 Z"/><path class="mgl g3" fill="#dfe8f5" d="M186 70 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z"/></g></svg>',
  );

function BrandIntro({ onFinish }) {
  const skip = React.useRef(null);
  React.useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus();
    const timer = setTimeout(onFinish, 5200);
    const escape = (event) => {
      if (event.key === "Escape") onFinish();
    };
    window.addEventListener("keydown", escape);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", escape);
      previous?.focus();
    };
  }, [onFinish]);
  return (
    <div
      className="brand-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Hairouna"
    >
      <div className="intro-orbit" aria-hidden="true" />
      <div className="intro-particles" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <i
            key={i}
            style={{
              "--angle": `${i * 137.5}deg`,
              "--distance": `${24 + (i % 7) * 5}vmin`,
              "--delay": `${(i % 6) * 45}ms`,
            }}
          />
        ))}
      </div>
      <div className="intro-brand">
        <img src={INTRO_LOGO} alt="Hairouna" width="112" height="112" />
        <p className="intro-line first">Your Taxes.</p>
        <p className="intro-line second">We Prepare.</p>
        <p className="intro-promise">
          You Relax — <b>We Do The Math.</b>
        </p>
        <p className="intro-name">Hairouna Business Solutions Inc.</p>
      </div>
      <button className="intro-skip" ref={skip} onClick={onFinish}>
        Skip intro <span>↗</span>
      </button>
      <div className="intro-timeline" aria-hidden="true" />
    </div>
  );
}

function GlassDocument({ paused }) {
  const video = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const userPaused = React.useRef(false);
  const permitted = React.useRef(false);
  React.useEffect(() => {
    const element = video.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      permitted.current = visible && !paused && !reduced.matches && !document.hidden;
      if (!permitted.current) element.pause();
      else if (!userPaused.current) element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(element);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      permitted.current = false;
      element.pause();
      observer.disconnect();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused]);
  const toggle = () => {
    if (video.current.paused) {
      userPaused.current = false;
      video.current.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.current.pause();
    }
  };
  return (
    <div className="document-scene tour-scene">
      <div className="orbit orbit-one" aria-hidden="true" />
      <div className="orbit orbit-two" aria-hidden="true" />
      <div className="glass-document tour-card">
        <div className="doc-top">
          <span className="doc-mark">H</span>
          <span>HAIROUNA<br /><small>BUSINESS SOLUTIONS</small></span>
          <span className="doc-leaf" aria-hidden="true">✦</span>
        </div>
        <div className="doc-rule" />
        <div className="tour-heading"><span>THE HAIROUNA EXPERIENCE</span><h2>A clearer way forward.<br /><em>See it for yourself.</em></h2></div>
        <video ref={video} className="site-tour" poster="/hairouna-tour-poster.jpg"
          muted loop playsInline controls preload="none" aria-label="39-second Hairouna website tour"
          aria-describedby="tour-description"
          onPlay={() => { userPaused.current = false; setPlaying(true); }}
          onPause={() => { if (permitted.current) userPaused.current = true; setPlaying(false); }}
          onCanPlay={() => setFailed(false)}
          onError={() => { if (video.current?.error) setFailed(true); }}>
          <source src="/hairouna-tour-mobile.mp4" type="video/mp4" media="(max-width: 700px)" />
          <source src="/hairouna-tour.mp4" type="video/mp4" />
          Your browser does not support video. Explore Hairouna using the service links below.
        </video>
        <div className="tour-controls">
          <button onClick={toggle} disabled={failed} aria-label={playing ? "Pause website tour" : "Play website tour"}>{playing ? "Ⅱ Pause tour" : "▷ Play tour"}</button>
          <span>39 SECONDS · EXPLORE HAIROUNA</span>
        </div>
        <p id="tour-description" className="tour-description">{failed ? "The tour couldn’t load. You can still explore every service below." : "Services, people, preparation and support. A short tour of what’s here for you."}</p>
      </div>
      <div className="document-caption"><span>01 — THE HAIROUNA APPROACH</span><p>Prepared with care. Built around you.</p></div>
    </div>
  );
}

function ClarityScene({ paused }) {
  const scene = React.useRef(null);
  React.useEffect(() => {
    const node = scene.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 900px)");
    let frame = 0,
      active = false;
    const render = () => {
      frame = 0;
      if (paused || motion.matches || !wide.matches) {
        node.style.setProperty("--assembly", "1");
        return;
      }
      const rect = node.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      node.style.setProperty("--assembly", progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame && active) frame = requestAnimationFrame(render);
    };
    const reset = () => {
      render();
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            active = entries[0].isIntersecting;
            if (active) schedule();
          })
        : null;
    if (observer) observer.observe(node);
    else {
      active = true;
      render();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", reset);
    motion.addEventListener("change", reset);
    wide.addEventListener("change", reset);
    render();
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", reset);
      motion.removeEventListener("change", reset);
      wide.removeEventListener("change", reset);
    };
  }, [paused]);
  return (
    <section
      className="clarity-scene"
      id="about"
      ref={scene}
      aria-labelledby="clarity-title"
    >
      <div className="clarity-frame">
        <div className="clarity-copy">
          <div className="kicker">03 / THE HAIROUNA APPROACH</div>
          <h2 id="clarity-title">
            From paperwork.
            <br />
            <em>To a clearer picture.</em>
          </h2>
          <p className="lead">
            Good financial support brings the details together — so you can see
            your next step.
          </p>
          <ol className="clarity-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Start with your situation.</h3>
                <p>Tell us what you need. Plain language is welcome.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Make a plan together.</h3>
                <p>Understand the service, scope and information needed.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Move forward, organized.</h3>
                <p>Keep your filings, payroll and records in view.</p>
              </div>
            </li>
          </ol>
          <a className="secondary" href="/about.html">
            Meet Hairouna <ChevronRight size={16} />
          </a>
        </div>
        <div className="folio-stage" aria-hidden="true">
          <div className="folio-light" />
          <div className="folio-rail" />
          <div className="folio-sheet folio-back">
            <span>01 / YOUR RECORDS</span>
            <b>The details.</b>
            <div className="folio-lines">
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>INCOME · RECEIPTS · RECORDS</small>
          </div>
          <div className="folio-sheet folio-middle">
            <span>02 / YOUR PLAN</span>
            <b>The perspective.</b>
            <div className="folio-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>ORGANIZE · UNDERSTAND · PREPARE</small>
          </div>
          <div className="folio-sheet folio-front">
            <div className="folio-brand">
              H
              <span>
                HAIROUNA
                <br />
                <small>BUSINESS SOLUTIONS</small>
              </span>
            </div>
            <span>03 / YOUR NEXT CHAPTER</span>
            <b>
              A clearer
              <br />
              <em>way forward.</em>
            </b>
            <div className="folio-seal">
              <Check size={18} />
              <span>Prepared with care.</span>
            </div>
            <small>BUILT AROUND YOU.</small>
          </div>
          <div className="folio-caption">
            INDIVIDUAL DETAILS. ONE CLEARER PICTURE.
          </div>
        </div>
        <span className="scene-edge" aria-hidden="true">
          HAIROUNA / CLARITY IN EVERY DETAIL
        </span>
      </div>
    </section>
  );
}

function App() {
  React.useEffect(() => installDepth(), []);
  const [intro, setIntro] = React.useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    try {
      return sessionStorage.getItem("hbs-intro") !== "1";
    } catch {
      return true;
    }
  });
  const [paused, setPaused] = React.useState(() => {
    try { return sessionStorage.getItem("hbs-motion") === "paused"; } catch { return false; }
  });
  const finishIntro = React.useCallback(() => {
    try {
      sessionStorage.setItem("hbs-intro", "1");
    } catch {}
    setIntro(false);
  }, []);
  React.useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "active";
    try { sessionStorage.setItem("hbs-motion", paused ? "paused" : "active"); } catch {}
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused]);
  React.useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (preference.matches) finishIntro();
    };
    preference.addEventListener("change", onChange);
    if (
      preference.matches ||
      paused ||
      intro ||
      !("IntersectionObserver" in window)
    )
      return () => preference.removeEventListener("change", onChange);
    const items = [
      ...document.querySelectorAll(".audience-row, .folder, .faq-heading"),
    ];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );
    items.forEach((item, i) => {
      item.style.setProperty("--reveal-delay", `${(i % 4) * 65}ms`);
      item.classList.add("cinema-reveal");
      observer.observe(item);
    });
    return () => {
      observer.disconnect();
      items.forEach((item) =>
        item.classList.remove("cinema-reveal", "in-view"),
      );
      preference.removeEventListener("change", onChange);
    };
  }, [intro, paused, finishIntro]);
  const [menu, setMenu] = React.useState(false),
    [assistant, setAssistant] = React.useState(false),
    [faq, setFaq] = React.useState(0);
  return (
    <>
      {intro && <BrandIntro onFinish={finishIntro} />}
      <main
        inert={intro ? true : undefined}
        className={intro ? "intro-playing" : "cinema-ready"}
      >
        <a className="skip-link" href="#services">
          Skip to content
        </a>
        <header className="nav">
          <a className="brand" href="#top">
            <span>H</span>
            <div>
              <b>HAIROUNA</b>
              <small>BUSINESS SOLUTIONS INC.</small>
            </div>
          </a>
          <nav
            id="main-navigation"
            aria-label="Main navigation"
            onClick={() => setMenu(false)}
            className={menu ? "open" : ""}
          >
            <a href="#services">Services</a>
            <a href="#clients">Who we help</a>
            <a href="#about">Why Hairouna</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            <a className="nav-cta" href="/contact.html">
              Free consultation
            </a>
          </nav>
          <button
            className="menu"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
            aria-expanded={menu}
            aria-controls="main-navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </header>
        <section className="hero" id="top">
          <div className="hero-grain" />
          <div className="atelier-horizon" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hero-glow" />
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> BRAMPTON, ONTARIO · SERVING
              CANADA
            </div>
            <h1>
              Your numbers.
              <br />
              <em>Our care.</em>
              <br />
              Peace of mind.
            </h1>
            <p>
              Tax, bookkeeping and business support that brings clarity to your
              finances — and a little more calm to your everyday.
            </p>
            <div className="actions">
              <a className="primary" href="/contact.html">
                Let’s talk about your next step <ChevronRight />
              </a>
              <a className="secondary" href="#services">
                Explore services
              </a>
            </div>
            <div className="trust">
              <span>
                <Check />
                Plain-language guidance
              </span>
              <span>
                <Check />
                Business-focused
              </span>
              <span>
                <Check />
                Virtual support
              </span>
            </div>
          </div>
          <GlassDocument paused={paused || intro} />
          <div className="scroll">
            A CLEARER WAY FORWARD <span>↓</span>
          </div>
        </section>
        <section className="section intro" id="services">
          <div className="kicker">01 / COMPLETE FINANCIAL SUPPORT</div>
          <h2>
            One place for the financial work
            <br />
            that keeps life and business moving.
          </h2>
          <p className="lead">
            From personal returns to ongoing corporate support, Hairouna helps
            make the numbers easier to manage.
          </p>
          <div className="service-grid">
            {services.map(([t, d, I], i) => (
              <article className="glass-card" key={t}>
                <div className="service-number">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="icon">
                  <I />
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
                <a
                  href={
                    "/services.html#" +
                    [
                      "personal-tax",
                      "corporate-tax",
                      "bookkeeping",
                      "payroll",
                      "gst-hst",
                      "statements",
                      "registration",
                      "audit",
                    ][i]
                  }
                >
                  <span className="sr-only">Explore {t}</span>
                  <span aria-hidden="true">Explore service</span>{" "}
                  <ChevronRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="section audience" id="clients">
          <div className="kicker">02 / BUILT AROUND REAL CLIENTS</div>
          <h2>
            Your situation isn’t generic.
            <br />
            <em>Your support shouldn’t be either.</em>
          </h2>
          <div className="audience-row">
            {audiences.map(([t, d], i) => (
              <a className="audience-card" href="/contact.html" key={t}>
                <img src={"/serve-" + (i + 1) + ".jpg"} alt="" loading="lazy" />
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </a>
            ))}
          </div>
        </section>
        <ClarityScene paused={paused || intro} />
        <section className="section checklist">
          <div className="folder">
            <span>THE HAIROUNA FIELD GUIDE</span>
            <b>
              A little preparation.
              <br />A clearer tax season.
            </b>
            <div className="checklist-preview">
              <span>
                <Check size={15} /> Income slips & identification
              </span>
              <span>
                <Check size={15} /> Receipts & eligible expenses
              </span>
              <span>
                <Check size={15} /> Self-employment records
              </span>
            </div>
            <small>YOUR CANADIAN TAX CHECKLIST ↗</small>
          </div>
          <div>
            <div className="kicker">04 / PREPARE WITH CONFIDENCE</div>
            <h2>
              Know what to gather
              <br />
              before you file.
            </h2>
            <p className="lead">
              Use Hairouna’s Canadian tax checklist to organize common slips,
              receipts and filing information.
            </p>
            <a className="primary" href="/checklist.html">
              Open the checklist <ChevronRight />
            </a>
          </div>
        </section>
        <section className="section faq-section" id="faq">
          <div className="faq-heading">
            <div className="kicker">QUESTIONS, MADE SIMPLE</div>
            <h2>Frequently asked questions.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div
                className={"faq-item " + (faq === i ? "active" : "")}
                key={q}
              >
                <button
                  onClick={() => setFaq(faq === i ? -1 : i)}
                  aria-expanded={faq === i}
                >
                  <span>{q}</span>
                  <ChevronDown />
                </button>
                {faq === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>
        <section className="section contact" id="contact">
          <div className="contact-panel">
            <div>
              <div className="kicker">05 / READY WHEN YOU ARE</div>
              <h2>Let’s make the next step clear.</h2>
              <p>
                Book a free, no-pressure consultation and tell Hairouna what you
                need help with.
              </p>
            </div>
            <div className="contact-actions">
              <a className="primary" href="/contact.html">
                Book a consultation <ChevronRight />
              </a>
              <a href="tel:+14169081916">
                <Phone />
                (416) 908-1916
              </a>
              <a
                href="https://wa.me/14169081916"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle />
                WhatsApp
              </a>
              <a href="mailto:info@hairounaholdingsinc.com">
                <Mail />
                Email Hairouna
              </a>
            </div>
          </div>
          <div className="location-strip">
            <span>
              <MapPin />
              Brampton, Ontario, Canada
            </span>
            <span>In person & virtually across Canada</span>
          </div>
        </section>
        <footer>
          <div className="brand">
            <span>H</span>
            <div>
              <b>HAIROUNA</b>
              <small>BUSINESS SOLUTIONS INC.</small>
            </div>
          </div>
          <div className="motion-controls">
            <button onClick={() => setIntro(true)}>Replay intro ↗</button>
            <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
              {paused ? "Resume motion" : "Pause motion"}
            </button>
          </div>
          <div className="footer-links">
            <a href="/services.html">Services</a>
            <a href="/pricing.html">Pricing</a>
            <a href="/resources.html">Resources</a>
            <a href="/contact.html">Contact</a>
          </div>
          <small>
            © {new Date().getFullYear()} Hairouna Business Solutions Inc. All
            rights reserved.
            <br />
            General information only; not professional advice.
          </small>
        </footer>
        <button
          className="hb"
          aria-label="Open HB Assistant"
          aria-expanded={assistant}
          onClick={() => setAssistant(true)}
        >
          <span>HB</span>
          <i />
        </button>
        <Assistant open={assistant} close={() => setAssistant(false)} />
      </main>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
