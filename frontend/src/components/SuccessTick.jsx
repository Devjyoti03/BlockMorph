import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const SuccessTick = ({ text, path = "animations/thumbs-up-0.json" }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      lottie.loadAnimation({
        container: animationRef.current,
        loop: false,
        autoplay: true,
        path: path,
      });
    }
  }, [path]);

  return (
    <div style={{ maxWidth: 350 }}>
      <div ref={animationRef} />
    </div>
  );
};

export default SuccessTick;
