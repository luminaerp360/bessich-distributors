import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1600,
  delay = 0,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  // Parse prefix, number, and suffix
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

  const [displayValue, setDisplayValue] = useState<string>(() => {
    return `${prefix}0${suffix}`;
  });

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();

          let animationFrameId: number;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp + delay;

            if (timestamp < startTime) {
              animationFrameId = requestAnimationFrame(step);
              return;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutCubic curve: 1 - (1 - progress)^3
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
    };
  }, [target, prefix, suffix, isFloat, decimals, duration, delay, hasStarted]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};

export default CountUp;
