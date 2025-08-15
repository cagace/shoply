// src/hooks/useAnimatedNumber.js
import { useEffect, useRef, useState } from "react";

// easeOutCubic varsayılan
export default function useAnimatedNumber(
  target,
  duration = 400,
  ease = (t) => 1 - Math.pow(1 - t, 3)
) {
  const [value, setValue] = useState(Number(target) || 0);
  const startRef = useRef(0);
  const rafRef = useRef();

  useEffect(() => {
    const from = value;
    const to = Number(target) || 0;
    if (Math.abs(to - from) < 0.01) { setValue(to); return; }

    cancelAnimationFrame(rafRef.current);
    startRef.current = 0;

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = ease(p);
      setValue(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]); // eslint-disable-line

  return value;
}
