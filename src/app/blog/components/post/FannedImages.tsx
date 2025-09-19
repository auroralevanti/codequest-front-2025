"use client"
import React, { useState, useMemo } from 'react';

type Props = { images?: string[] };

export default function FannedImages({ images = [] }: Props) {
  const n = images.length;
  // default active index: center on second image when possible so initial view is [0,1,2]
  const [active, setActive] = useState<number>(n > 1 ? 1 : 0);

  const handleClick = (index: number) => {
    setActive(index);
  };

  // compute visible window according to requested rules
  const visible = useMemo(() => {
    if (n <= 3) return images.map((src, i) => ({ src, idx: i }));

    // if active at start -> show [0,1]
    if (active === 0) return [0, 1].map(i => ({ src: images[i], idx: i }));
    // if active at end -> show last two
    if (active === n - 1) return [n - 2, n - 1].map(i => ({ src: images[i], idx: i }));

    // otherwise center the active with its neighbors
    return [active - 1, active, active + 1].map(i => ({ src: images[i], idx: i }));
  }, [images, n, active]);

  // slot assignment per visible window
  const slots = useMemo(() => {
    if (visible.length === 3) {
      return visible.map(v => (v.idx === active ? 'center' : v.idx < active ? 'left' : 'right'));
    }
    if (visible.length === 2) {
      // if active is first of visible -> center, right
      if (visible[0].idx === active) return ['center', 'right'];
      return ['left', 'center'];
    }
    return ['center'];
  }, [visible, active]);

  if (n === 0) return null;

  // offsets in px for left/right from center — adjusted for better centering
  const offsetX = 64; // smaller gap so center truly looks centered
  const transforms = {
    left: {
      transform: `translateX(calc(-50% - ${offsetX}px)) rotate(-12deg) translateY(8px)`,
      zIndex: 10,
    },
    center: {
      transform: `translateX(-50%) translateY(-8px) scale(1.08) rotate(0deg)`,
      zIndex: 60,
    },
    right: {
      transform: `translateX(calc(-50% + ${offsetX}px)) rotate(12deg) translateY(8px)`,
      zIndex: 10,
    },
  } as const;

  // prepare groups to control render order: left(s), right(s), center last
  const lefts = visible.filter((_, i) => slots[i] === 'left');
  const rights = visible.filter((_, i) => slots[i] === 'right');
  const center = visible.filter((_, i) => slots[i] === 'center');

  const renderItem = (v: { src: string; idx: number }) => {
    const slot = v.idx === active ? 'center' : v.idx < active ? 'left' : 'right';
    const style = transforms[slot as keyof typeof transforms];
    return (
      <button
        key={v.idx}
        onClick={() => handleClick(v.idx)}
        aria-pressed={v.idx === active}
        className="appearance-none bg-transparent p-0 border-0 absolute"
        style={{ cursor: 'pointer', left: '50%', transform: style.transform, zIndex: style.zIndex }}
      >
        <img
          src={v.src}
          alt={`fanned-${v.idx}`}
          className={`object-cover rounded-[0.75rem] border-4 transition-transform duration-300 will-change-transform shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_0_4px_6px_-2px_rgba(0,0,0,0.05)] border-background-light dark:border-background-dark`}
          style={{ width: '150px', height: '225px', transform: 'none' }}
        />
      </button>
    );
  };

  return (
    <div className="relative flex justify-center items-center h-64">
  {lefts.map((v) => renderItem(v))}
  {rights.map((v) => renderItem(v))}
  {center.map((v) => renderItem(v))}
    </div>
  );
}
