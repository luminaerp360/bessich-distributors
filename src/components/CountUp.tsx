import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1400,
  delay = 0,
  className = '',
  once = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  // Parse prefix, number, and suffix (e.g. "< 24H", "150+", "100%", "< 4 hrs", "10")
  const parse = (val: string | number) => {
    const str = String(val).trim();
    const match = str.match(/^([^0-9.]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) return { prefix: '', target: 0, suffix: str, isFloat: false, decimals: 0 };
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const isFloat = match[2].includes('.');
    const decimals = isFloat ? (match[2].split('.')[1] || '').length : 0;
    return { prefix, target, suffix, isFloat, decimals };
  };

  const { prefix, target, suffix, isFloat, decimals } = parse(value);

  const [displayValue, setDisplayValue] = useState<string>(() => `${prefix}0${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animationFrameId: number;
    let timeoutId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // Cancel previous animation if any
          cancelAnimationFrame(animationFrameId);
          clearTimeout(timeoutId);

          timeoutId = window.setTimeout(() => {
            let startTime: number | null = null;

            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;

              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Smooth easeOutCubic curve
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = target * easeOut;

              if (progress < 1) {
                const formatted = isFloat
                  ? current.toFixed(decimals)
                  : Math.floor(current).toLocaleString();
                setDisplayValue(`${prefix}${formatted}${suffix}`);
                animationFrameId = requestAnimationFrame(step);
              } else {
                const finalFormatted = isFloat
                  ? target.toFixed(decimals)
                  : target.toLocaleString();
                setDisplayValue(`${prefix}${finalFormatted}${suffix}`);
              }
            };

            animationFrameId = requestAnimationFrame(step);
          }, delay);
        } else if (!once && entry && !entry.isIntersecting) {
          // Scrolled out of view: reset to 0 so it animates each time scrolled to
          cancelAnimationFrame(animationFrameId);
          clearTimeout(timeoutId);
          setDisplayValue(`${prefix}0${suffix}`);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [target, prefix, suffix, isFloat, decimals, duration, delay, once]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};

export default CountUp;
