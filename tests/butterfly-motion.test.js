import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {installJourney} from '../src/journey-renderer.js';

test('butterfly eases toward a mouse, ignores touch, returns to its route and respects pause', () => {
  const dom = new JSDOM('<main><div id="world"></div><canvas></canvas></main>',{pretendToBeVisual:true});
  const keys = ['window','document','innerWidth','innerHeight','devicePixelRatio','scrollY','matchMedia','requestAnimationFrame','cancelAnimationFrame'];
  const prior = keys.map(key => [key,Object.getOwnPropertyDescriptor(globalThis,key)]);
  let cleanup;
  try {
    const w = dom.window, world = w.document.querySelector('#world'), canvas = w.document.querySelector('canvas');
    let queue = new Map(), sequence = 0, clock = 0;
    Object.assign(globalThis,{window:w,document:w.document,innerWidth:1000,innerHeight:800,devicePixelRatio:1,scrollY:0,
      matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
      requestAnimationFrame:fn=>{queue.set(++sequence,fn);return sequence;},cancelAnimationFrame:id=>queue.delete(id)});
    canvas.getContext = () => null;world.dataset.sceneProgress='0';
    const tick = (count=1) => {for(let i=0;i<count;i++){clock+=16;for(const [id,fn] of [...queue]){queue.delete(id);fn(clock);}}};
    const pointer = (type='mouse') => {const event = new w.Event('pointermove');Object.assign(event,{clientX:150,clientY:160,pointerType:type});w.dispatchEvent(event);};
    const x = () => parseFloat(world.style.getPropertyValue('--guide-x'));
    cleanup=installJourney(world,canvas,{intro:false,paused:false});tick();
    const initial=x();pointer();tick();assert.ok(x()<initial && x()>50,'movement eases rather than snapping');
    tick(100);assert.ok(x()>10 && x()<17,'butterfly reaches the area near the mouse');
    const exit = new w.Event('pointerout');Object.assign(exit,{relatedTarget:null});w.dispatchEvent(exit);tick(100);
    assert.ok(x()>65,'leaving the viewport restores the natural flight route');
    pointer('touch');tick(100);assert.ok(x()>65,'touch does not capture the guide');
    cleanup();assert.equal(queue.size,0);
    cleanup=installJourney(world,canvas,{intro:false,paused:true});tick();const still=x();pointer();tick(100);assert.equal(x(),still);assert.equal(queue.size,0);
    cleanup();cleanup=null;pointer();assert.equal(queue.size,0,'cleanup removes pointer listeners');
  } finally {
    cleanup?.();dom.window.close();
    for(const [key,descriptor] of prior){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
  }
});
