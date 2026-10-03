import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readdir, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'vite';
import {JSDOM, VirtualConsole} from 'jsdom';

test('scene navigation reaches every destination, keeps forms usable and respects motion controls', async () => {
  const out = await mkdtemp(join(tmpdir(), 'hairouna-scenes-'));
  let dom;
  try {
    await build({logLevel:'silent', build:{outDir:out, emptyOutDir:true, copyPublicDir:false}});
    const asset = (await readdir(join(out,'assets'))).find(name => name.endsWith('.js'));
    const bundle = await readFile(join(out,'assets',asset),'utf8');
    const errors = [];
    const console = new VirtualConsole();
    console.on('jsdomError', error => errors.push(error.message));
    dom = new JSDOM('<div id="root"></div>', {url:'https://hairounaholdingsinc.com/',pretendToBeVisual:true,runScripts:'outside-only',virtualConsole:console});
    const w = dom.window, d = w.document;
    w.sessionStorage.setItem('hbs-intro','1');
    w.matchMedia = () => ({matches:false,addEventListener(){},removeEventListener(){}});
    w.IntersectionObserver = class {observe(){} disconnect(){}};
    w.HTMLCanvasElement.prototype.getContext = () => null;
    w.HTMLMediaElement.prototype.play = () => Promise.resolve();
    w.HTMLMediaElement.prototype.pause = () => {};
    w.fetch = async () => Response.json({status:'ok',checkedAt:'2026-10-03T12:00:00Z',sources:[],items:[]});
    w.eval(bundle);
    const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
    const click = selector => {const el = d.querySelector(selector); assert.ok(el,selector);el.click();};
    const label = text => [...d.querySelectorAll('button')].find(el => el.textContent === text);
    const title = () => d.querySelector('#view-title').textContent;
    await wait(80);
    assert.equal(title(),'Peace of mind.');
    assert.equal(d.querySelectorAll('.vision-scene').length,1);
    assert.equal(d.querySelector('[aria-label="Previous view"]').disabled,true);
    click('[aria-label="Next view"]');await wait(40);
    assert.ok(d.querySelector('.vision-departing'));
    click('[aria-label="Next view"]');await wait(400);
    assert.equal(w.location.hash,'#services');
    assert.equal(d.querySelectorAll('.vision-service-list a').length,4);
    assert.equal(d.activeElement.id,'view-title');
    // Trackpad momentum should advance only once, even with many wheel events.
    for(let i=0;i<20;i++) w.dispatchEvent(new w.WheelEvent('wheel',{deltaY:100,cancelable:true}));
    await wait(400);assert.equal(w.location.hash,'#services-more');
    const slugs = [...d.querySelectorAll('.vision-service-list a')].map(el => el.hash);
    assert.deepEqual(slugs,['#gst-hst','#statements','#registration','#audit']);
    // Explicit controls work with ambient motion paused, without animation delays.
    label('Pause motion').click();await wait(30);
    click('[aria-label="Next view"]');await wait(40);
    assert.equal(w.location.hash,'#clients');assert.equal(d.querySelectorAll('.vision-client-list img').length,6);
    click('[aria-label="Next view"]');await wait(40);assert.equal(w.location.hash,'#about');
    click('[aria-label="Next view"]');await wait(40);assert.equal(w.location.hash,'#checklist');
    assert.ok(d.querySelector('a[href="/checklist.html"]'));
    click('[aria-label="Next view"]');await wait(40);assert.equal(w.location.hash,'#faq');
    const questions = [...d.querySelectorAll('.vision-faq button')];questions[2].click();await wait(30);
    assert.equal(questions[2].getAttribute('aria-expanded'),'true');
    click('[aria-label="Next view"]');await wait(40);assert.equal(w.location.hash,'#updates');
    assert.ok(d.querySelector('.cra-updates'));
    assert.ok(d.querySelector('a[href="https://www.canada.ca/en/revenue-agency/news/newsroom.html"]'));
    click('[aria-label="Next view"]');await wait(40);assert.equal(w.location.hash,'#contact');
    assert.equal(d.querySelector('[aria-label="Next view"]').disabled,true);
    assert.ok(d.querySelector('a[href="/contact.html"]'));
    assert.ok(d.querySelector('a[href="tel:+14169081916"]'));
    // Hash navigation and menu links can jump directly to any scene.
    click('.vision-menu-button');await wait(30);click('.vision-menu a[href="#top"]');await wait(40);
    assert.equal(title(),'Peace of mind.');
    label('Watch tour').click();await wait(40);
    assert.ok(d.querySelector('[role="dialog"][aria-modal="true"]'));
    assert.equal(d.querySelector('.vision-interface').hasAttribute('inert'),true);
    w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));await wait(40);
    assert.equal(d.querySelector('.vision-tour'),null);
    assert.equal(d.activeElement.textContent,'Watch tour');
    // A swipe on the landscape enters the next view without moving the document.
    await wait(900);
    const touchStart = new w.Event('touchstart');
    Object.defineProperty(touchStart,'touches',{value:[{clientX:300,clientY:500}]});
    const touchEnd = new w.Event('touchend');
    Object.defineProperty(touchEnd,'changedTouches',{value:[{clientX:300,clientY:350}]});
    w.dispatchEvent(touchStart);w.dispatchEvent(touchEnd);await wait(40);
    assert.equal(w.location.hash,'#services');assert.equal(w.scrollY,0);
    label('Resume motion').click();await wait(30);
    w.matchMedia = () => ({matches:true,addEventListener(){},removeEventListener(){}});
    click('[aria-label="Next view"]');await wait(40);
    assert.equal(w.location.hash,'#services-more');assert.equal(d.querySelector('.vision-departing'),null);
    assert.deepEqual(errors,[]);
  } finally {dom?.window.close();await rm(out,{recursive:true,force:true});}
});
