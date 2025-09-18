"use client"
import React from 'react';

type Props = { images?: string[] };

export default function FannedImages({ images = [] }: Props) {
  const imgs = images.slice(0, 3);
  if (imgs.length === 0) return null;

  const boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';

  return (
    <div className="flex justify-center items-center h-64">
      {imgs.map((src, i) => {
        const transform = i === 0 ? 'rotate(-15deg) translate(20px, 10px)' : i === 1 ? 'rotate(0deg) scale(1.1)' : 'rotate(15deg) translate(-20px, 10px)';
        const zIndex = i === 1 ? 20 : 10;
        // overlap via negative margin on subsequent images
        const marginClass = i === 0 ? '' : '-ml-10';
        return (
          <img
            key={i}
            src={src}
            alt={`fanned-${i}`}
            className={`${marginClass} object-cover rounded-[0.75rem] border-4 transition-transform duration-300 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_0_4px_6px_-2px_rgba(0,0,0,0.05)] border-background-light dark:border-background-dark`}
            style={{ width: '150px', height: '225px', transform, zIndex }}
          />
        );
      })}
    </div>
  );
}
