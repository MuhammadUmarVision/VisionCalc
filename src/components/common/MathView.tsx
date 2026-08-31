import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  size = 'base'
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return math;
    }
  }, [math, block]);

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl md:text-2xl',
    '2xl': 'text-2xl md:text-3xl'
  }[size];

  if (block) {
    return (
      <div
        className={`math-block py-2.5 px-3 overflow-x-auto text-center font-serif ${sizeClasses} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-inline inline-block font-serif ${sizeClasses} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
