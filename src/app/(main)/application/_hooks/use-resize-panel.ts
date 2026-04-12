'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizePanelOptions {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizePanel({
  defaultWidth = 300,
  minWidth = 220,
  maxWidth = 480,
}: UseResizePanelOptions = {}) {
  const [width, setWidth] = useState(defaultWidth);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setWidth(Math.min(maxWidth, Math.max(minWidth, e.clientX)));
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  return { width, handleMouseDown };
}
