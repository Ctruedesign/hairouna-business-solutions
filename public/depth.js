// Fine-pointer enhancement only; no camera tracking on touch or reduced motion.
export function installDepth() {
  const root = document.documentElement;
  const preference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0, x = 0, y = 0, tx = 0, ty = 0, card = null;
  const allowed = () => preference.matches && root.dataset.motion !== 'paused' && !document.hidden;
  const resetCard = () => {
    if (card) { card.style.removeProperty('--near-x'); card.style.removeProperty('--near-y'); card = null; }
  };
  const reset = () => {
    cancelAnimationFrame(frame); frame = 0; x = y = tx = ty = 0;
    root.style.setProperty('--camera-x', '0'); root.style.setProperty('--camera-y', '0');
    resetCard();
  };
  const draw = () => {
    frame = 0;
    if (!allowed()) { reset(); return; }
    x += (tx - x) * .075; y += (ty - y) * .075;
    root.style.setProperty('--camera-x', x.toFixed(4));
    root.style.setProperty('--camera-y', y.toFixed(4));
    if (Math.abs(tx-x)+Math.abs(ty-y)>.002) frame = requestAnimationFrame(draw);
  };
  const move = e => {
    if (!allowed() || document.querySelector('.brand-intro')) return;
    tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2;
    const target = e.target.closest('.tour-card, .folio-stage, .folder, .glass-card, .svc, .plan');
    if (target !== card) { resetCard(); card = target; }
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--near-x', `${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
      card.style.setProperty('--near-y', `${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
    }
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const leave = () => { tx = ty = 0; resetCard(); if (!frame) frame = requestAnimationFrame(draw); };
  const observer = new MutationObserver(() => { if (!allowed()) reset(); });
  observer.observe(root, { attributes:true, attributeFilter:['data-motion'] });
  document.addEventListener('pointermove', move, {passive:true});
  document.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', reset);
  preference.addEventListener('change', reset);
  return () => {
    reset(); observer.disconnect();
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', leave);
    document.removeEventListener('visibilitychange', reset);
    preference.removeEventListener('change', reset);
  };
}
