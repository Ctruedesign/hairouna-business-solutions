import React from "react";
import { installJourney } from "./journey-renderer.js";

export default function Journey({ intro, paused, progress }) {
  const world = React.useRef(null);
  const canvas = React.useRef(null);
  React.useEffect(() => installJourney(world.current, canvas.current, { intro, paused }), [intro, paused]);
  React.useEffect(() => {
    if (progress === undefined) return;
    world.current.dataset.sceneProgress = String(progress);
    window.dispatchEvent(new Event('hairouna:scene'));
  }, [progress]);
  return (
    <div ref={world} className={`journey-world${intro ? " journey-hidden" : ""}`} aria-hidden="true">
      <div className="journey-still" />
      <canvas ref={canvas} className="journey-canvas" />
      <div className="journey-forest">
        <img src="/journey/forest.webp" alt="" onError={event => {event.currentTarget.parentElement.dataset.unavailable = 'true';}} />
        <div className="journey-forest-edge" />
      </div>
      <div className="journey-mist" />
      <div className="journey-shade" />
      <div className="journey-butterfly">
        <span className="natural-wing natural-left" />
        <span className="natural-wing natural-right" />
      </div>
      <div className="grass-butterflies">
        {[['12%','8%', '-18deg', '.8'], ['88%','12%', '22deg', '.7'], ['24%','3%', '8deg', '1'], ['76%','5%', '-26deg', '.85']].map(([left,bottom,bank,scale],i) => (
          <div key={left} className={`grass-butterfly grass-butterfly-${i}`} style={{left,bottom,'--rest-bank':bank,'--rest-scale':scale}}>
            <span className="natural-wing resting-left" /><span className="natural-wing resting-right" />
          </div>
        ))}
      </div>
    </div>
  );
}
