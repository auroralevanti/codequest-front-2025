"use client"
import React from 'react';

type Props = {
  images?: string[];
  size?: { width: number; height: number };
};

export default function FannedImages({ images = [], size = { width: 150, height: 225 } }: Props) {
  if (images.length === 0) return null;

  const imgs = images.slice(0, 3);

  return (
    <div className="flex justify-center items-center" style={{ height: `${size.height + 10}px` }}>
      {imgs.map((src, i) => {
        const common = `object-cover rounded-xl border-4 transition-transform duration-300 shadow-lg`;
        const borderClass = `border-background-light dark:border-background-dark`;
        const style: React.CSSProperties = {
          width: `${size.width}px`,
          height: `${size.height}px`,
          transform: i === 0 ? 'rotate(-15deg) translate(20px, 10px)' : i === 1 ? 'rotate(0deg) scale(1.08)' : 'rotate(15deg) translate(-20px, 10px)',
          zIndex: i === 1 ? 2 : 1,
        };
        return (
          <img
            key={i}
            src={src}
            alt={`image-${i}`}
            className={`${common} ${borderClass} mx-[-6px] fan-image`}
            style={style}
          />
        );
      })}
    </div>
  );
}
