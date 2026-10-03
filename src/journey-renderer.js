// One landscape, one scroll timeline. Motion never modifies the brand intro.
const vertex = `attribute vec2 aPosition; varying vec2 vUV;
void main(){vUV=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 vUV;
uniform sampler2D uArrival, uValley;
uniform vec2 uViewport;
uniform float uProgress, uTime, uMotion;
void main(){
  vec2 screen=vec2(vUV.x,1.-vUV.y);
  float aspect=uViewport.x/uViewport.y;
  float imageAspect=1.5;
  vec2 fit=vec2(min(1.,aspect/imageAspect),min(1.,imageAspect/aspect));
  float zoom=1.+uProgress*.72;
  vec2 center=mix(vec2(.5,.5),vec2(.52,.7),uProgress);
  center=clamp(center,fit/(2.*zoom),1.-fit/(2.*zoom));
  vec2 uv=(screen-.5)*fit/zoom+center;
  vec4 base=texture2D(uValley,uv);
  // Water mask follows the narrow distant stream and wider reflective pools.
  float nearWater=smoothstep(.76,.97,uv.y);
  float streamWidth=mix(.015,.36,nearWater);
  float stream=1.-smoothstep(streamWidth,streamWidth+.025,abs(uv.x-(.52+.025*sin(uv.y*19.))));
  float luminance=dot(base.rgb,vec3(.2126,.7152,.0722));
  float water=nearWater*stream*smoothstep(.07,.3,luminance);
  float ripple=sin(uv.y*180.-uTime*1.5)+.5*sin(uv.y*310.+uv.x*25.-uTime*2.);
  uv.x+=ripple*.0024*water*uMotion;
  uv.y+=sin(uv.x*80.+uTime)*.0007*water*uMotion;
  vec3 valley=texture2D(uValley,uv).rgb;
  vec3 arrival=texture2D(uArrival,uv).rgb;
  float leaveArrival=smoothstep(.015,.17,uProgress);
  vec3 color=mix(arrival,valley,leaveArrival);
  color+=vec3(.04,.055,.065)*water*(.5+.5*sin(uv.y*190.-uTime*1.6))*uMotion;
  gl_FragColor=vec4(color,1.);
}`;

export function installJourney(world, canvas, { intro, paused }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false, frame = 0, last = 0, time = 0;
  let progress = parseFloat(world.style.getPropertyValue("--journey-progress")) || 0, target = progress;
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
  const assets = [];
  let program, buffer;
  const allowed = () => !intro && !paused && !reduced.matches && !document.hidden;
  const sample = () => {
    if (world.dataset.sceneProgress !== undefined) {
      target = Math.min(1, Math.max(0, Number(world.dataset.sceneProgress) || 0));
      return;
    }
    const main = document.querySelector("main");
    const distance = Math.max(1, main.offsetHeight - innerHeight);
    target = Math.min(1, Math.max(0, scrollY / distance));
  };
  const positionButterfly = (p, t) => {
    // An irregular route follows the river, with modest banking and depth changes.
    const x = 70 - 20 * Math.sin(p * Math.PI * 1.5) + Math.sin(t * .42) * 3;
    const y = 69 - p * 38 + Math.cos(t * .31) * 2;
    world.style.setProperty("--guide-x", `${x.toFixed(2)}vw`);
    world.style.setProperty("--guide-y", `${y.toFixed(2)}vh`);
    world.style.setProperty("--guide-bank", `${(Math.sin(p * 7 + t * .3) * 16).toFixed(2)}deg`);
    world.style.setProperty("--guide-scale", (.68 + Math.sin(p * Math.PI) * .42).toFixed(3));
    world.style.setProperty("--journey-progress", p.toFixed(4));
    // Keep the scroll story available when WebGL is unavailable.
    const blend = Math.min(1, Math.max(0, (p - .015) / .155));
    world.style.setProperty("--valley-opacity", (blend * blend * (3 - 2 * blend)).toFixed(4));
    world.style.setProperty("--journey-zoom", (1 + p * .72).toFixed(4));
    world.style.setProperty("--journey-y", `${(50 + p * 20).toFixed(2)}%`);
  };
  let uniforms;
  const draw = (now = 0) => {
    frame = 0;
    if (disposed || document.hidden) return;
    const moving = allowed();
    const dt = last ? Math.min(50, now - last) : 16;
    last = now;
    if (moving) { time += dt / 1000; progress += (target - progress) * (1 - Math.exp(-dt / 130)); }
    else if (intro) progress = 0;
    else if (world.dataset.sceneProgress !== undefined) progress = target;
    else if (reduced.matches) progress = 0;
    positionButterfly(progress, time);
    if (gl && program) {
      gl.uniform2f(uniforms.viewport, canvas.width, canvas.height);
      gl.uniform1f(uniforms.progress, progress);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.motion, moving ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    if (moving) frame = requestAnimationFrame(draw);
  };
  const schedule = () => { if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw); };
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1 : 1.5);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    gl?.viewport(0, 0, canvas.width, canvas.height);
    sample(); schedule();
  };
  const scroll = () => { sample(); schedule(); };
  const visibility = () => { cancelAnimationFrame(frame); frame = 0; last = 0; schedule(); };
  const shader = (type, source) => {
    const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); throw Error("Landscape shader unavailable"); }
    return s;
  };
  if (gl) {
    try {
      const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Landscape program unavailable");
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(["viewport","progress","time","motion"].map(key => [key,gl.getUniformLocation(program,"u"+key[0].toUpperCase()+key.slice(1))]));
      Promise.all(["arrival", "valley"].map((name, unit) => new Promise((resolve, reject) => {
        const image = new Image(); image.onload = () => {
          if (disposed) { resolve(); return; }
          const texture = gl.createTexture(); assets.push(texture);
          gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.uniform1i(gl.getUniformLocation(program, name === "arrival" ? "uArrival" : "uValley"), unit); resolve();
        }; image.onerror = reject; image.src = `/journey/${name}.webp`;
      }))).then(() => { if (!disposed) { world.dataset.rendered = "true"; schedule(); } }).catch(() => { canvas.style.display = "none"; });
    } catch { canvas.style.display = "none"; program = null; }
  }
  window.addEventListener("scroll", scroll, { passive: true });
  window.addEventListener("hairouna:scene", scroll);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", schedule);
  resize();
  return () => {
    disposed = true; cancelAnimationFrame(frame);
    window.removeEventListener("scroll", scroll); window.removeEventListener("resize", resize);
    window.removeEventListener("hairouna:scene", scroll);
    document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", schedule);
    if (gl) { assets.forEach(texture => gl.deleteTexture(texture)); if (buffer) gl.deleteBuffer(buffer); if (program) gl.deleteProgram(program); }
  };
}
