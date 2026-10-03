import React from "react";
import { installJourney } from "./journey-renderer.js";

export default function Journey({ intro, paused }) {
  const world = React.useRef(null);
  const canvas = React.useRef(null);
  React.useEffect(() => installJourney(world.current, canvas.current, { intro, paused }), [intro, paused]);
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
