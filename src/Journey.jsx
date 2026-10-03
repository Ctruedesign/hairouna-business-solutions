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
      <div className="journey-mist" />
      <div className="journey-shade" />
      <div className="journey-butterfly">
        <span className="natural-wing natural-left" />
        <span className="natural-wing natural-right" />
      </div>
    </div>
  );
}
