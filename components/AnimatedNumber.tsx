'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  formatOptions?: Intl.NumberFormatOptions;
}

export default function AnimatedNumber({ 
  value, 
  duration = 0.8, 
  className = '',
  formatOptions 
}: AnimatedNumberProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0 
  });
  
  const display = useTransform(spring, (current) => {
    if (formatOptions) {
      return Math.round(current).toLocaleString('de-CH', formatOptions);
    }
    return Math.round(current).toLocaleString('de-CH');
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  if (!isClient) {
    return <span className={className}>{value.toLocaleString('de-CH')}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
