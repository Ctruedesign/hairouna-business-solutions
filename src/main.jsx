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
function GlassDocument() {
  return (
    <div className="document-scene" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="document-shadow" />
      <div className="glass-document">
        <div className="doc-top">
          <span className="doc-mark">H</span>
          <span>
            HAIROUNA
            <br />
            <small>BUSINESS SOLUTIONS</small>
          </span>
          <span className="doc-leaf">✦</span>
        </div>
        <div className="doc-rule" />
        <div className="doc-heading">
          <span>CANADIAN PERSONAL TAX</span>
          <h2>
            Your next chapter.
            <br />
            Clearly prepared.
          </h2>
          <b>
            T1 <small>INCOME TAX RETURN</small>
          </b>
        </div>
        <div className="doc-fields">
          <span>01 / PERSONAL INFORMATION</span>
          <i />
          <i />
          <span>02 / INCOME & DEDUCTIONS</span>
          <i />
          <i />
          <i />
        </div>
        <div className="doc-bottom">
          <span>
            <Check size={20} />
          </span>
          <p>
            Care in every detail.
            <br />
            <small>Clarity at every step.</small>
          </p>
          <b>H.</b>
        </div>
      </div>
      <div className="document-caption">
        <span>01 — THE HAIROUNA APPROACH</span>
        <p>Prepared with care. Built around you.</p>
      </div>
    </div>
  );
}
function App() {
  const [menu, setMenu] = React.useState(false),
    [assistant, setAssistant] = React.useState(false),
    [faq, setFaq] = React.useState(0);
  return (
    <main>
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
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> BRAMPTON, ONTARIO · SERVING CANADA
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
        <GlassDocument />
        <div className="scroll">
          A CLEARER WAY FORWARD <span>↓</span>
        </div>
      </section>
      <section className="section intro" id="services">
        <div className="kicker">COMPLETE FINANCIAL SUPPORT</div>
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
                Explore service <ChevronRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="section audience" id="clients">
        <div className="kicker">BUILT AROUND REAL CLIENTS</div>
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
      <section className="section why" id="about">
        <div>
          <div className="kicker">WHY HAIROUNA</div>
          <h2>
            Less financial noise.
            <br />
            More forward motion.
          </h2>
          <p className="lead">
            Financial work should be easier to understand, organize and act on.
          </p>
        </div>
        <div className="why-stack">
          <div>
            <b>01</b>
            <h3>Start with your situation</h3>
            <p>
              Tell us what you need without having to know the accounting
              terminology.
            </p>
          </div>
          <div>
            <b>02</b>
            <h3>Get a clear path</h3>
            <p>
              Identify the relevant service and information needed to move
              forward.
            </p>
          </div>
          <div>
            <b>03</b>
            <h3>Stay organized</h3>
            <p>
              Keep filings, payroll and financial records visible and
              manageable.
            </p>
          </div>
        </div>
      </section>
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
          <div className="kicker">PREPARE WITH CONFIDENCE</div>
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
            <div className={"faq-item " + (faq === i ? "active" : "")} key={q}>
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
            <div className="kicker">READY WHEN YOU ARE</div>
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
  );
}
createRoot(document.getElementById("root")).render(<App />);
