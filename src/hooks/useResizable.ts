import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

export type SeparatorProps = React.ComponentPropsWithoutRef<'hr'>;

type Resizable = {
  /**
   * border position
   */
  position: number;
  /**
   * position at end of drag
   */
  endPosition: number;
  /**
   * whether the border is dragging
   */
  isDragging: boolean;
  /**
   * props for drag bar
   */
  separatorProps: SeparatorProps;
  /**
   * set border position
   */
  setPosition: React.Dispatch<React.SetStateAction<number>>;
};

type ResizeCallbackArgs = {
  /**
   * position at the time of callback
   */
  position: number;
};

const KEYS_LEFT = ['ArrowLeft', 'Left'];
const KEYS_RIGHT = ['ArrowRight', 'Right'];
const KEYS_UP = ['ArrowUp', 'Up'];
const KEYS_DOWN = ['ArrowDown', 'Down'];
const KEYS_AXIS_X = [...KEYS_LEFT, ...KEYS_RIGHT];
const KEYS_AXIS_Y = [...KEYS_UP, ...KEYS_DOWN];
const KEYS_POSITIVE = [...KEYS_RIGHT, ...KEYS_DOWN];

export type UseResizableProps = {
  /**
   * direction of resizing
   */
  axis: 'x' | 'y';
  /**
   * ref of the container element
   */
  containerRef?: React.RefObject<HTMLElement>;
  /**
   * if true, cannot resize
   */
  disabled?: boolean;
  /**
   * initial border position
   */
  initial?: number;
  /**
   * minimum border position
   */
  min?: number;
  /**
   * maximum border position
   */
  max?: number;
  /**
   * calculate border position from other side
   */
  reverse?: boolean;
  /**
   * resizing step with keyboard
   */
  step?: number;
  shiftStep?: number;
  /**
   * callback when border position changes start
   */
  onResizeStart?: (args: ResizeCallbackArgs) => void;
  /**
   * callback when border position changes end
   */
  onResizeEnd?: (args: ResizeCallbackArgs) => void;
};

export function useResizable({
  axis,
  disabled = false,
  initial = 0,
  min = 0,
  max = Infinity,
  reverse,
  step = 10,
  shiftStep = 50,
  onResizeStart,
  onResizeEnd,
  containerRef,
}: UseResizableProps): Resizable {
  const initialPosition = Math.min(Math.max(initial, min), max);

  const isResizingRef = useRef(false);

  const positionRef = useRef(initialPosition);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [endPosition, setEndPosition] = useState(initialPosition);

  const ariaProps = useMemo<SeparatorProps>(
    () => ({
      role: 'separator',
      'aria-valuenow': position,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-orientation': axis === 'x' ? 'vertical' : 'horizontal',
      'aria-disabled': disabled,
    }),
    [axis, disabled, max, min, position],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      // exit if not resizing
      if (!isResizingRef.current) return;

      if (disabled) return;

      event.stopPropagation();
      event.preventDefault(); // prevent text selection

      let currentPosition = (() => {
        if (axis === 'x') {
          if (containerRef?.current) {
            const containerNode = containerRef.current;
            const { left, width } = containerNode.getBoundingClientRect();
            return reverse ? left + width - event.clientX : event.clientX - left;
          }
          return reverse ? document.body.offsetWidth - event.clientX : event.clientX;
        }
        if (containerRef?.current) {
          const containerNode = containerRef.current;
          const { top, height } = containerNode.getBoundingClientRect();
          return reverse ? top + height - event.clientY : event.clientY - top;
        }
        return reverse ? document.body.offsetHeight - event.clientY : event.clientY;
      })();

      currentPosition = Math.min(Math.max(currentPosition, min), max);
      setPosition(currentPosition);
      positionRef.current = currentPosition;
    },
    [axis, disabled, max, min, reverse, containerRef],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (disabled) {
        return;
      }

      event.stopPropagation();

      isResizingRef.current = false;

      setIsDragging(false);
      setEndPosition(positionRef.current);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerUp);

      if (onResizeEnd) {
        onResizeEnd({ position: positionRef.current });
      }
    },
    [disabled, handlePointerMove, onResizeEnd],
  );

  const handlePointerDown = useCallback<React.PointerEventHandler>(
    (event) => {
      if (disabled) {
        return;
      }

      event.stopPropagation();
      isResizingRef.current = true;

      setIsDragging(true);

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointercancel', handlePointerUp);
      document.addEventListener('pointerleave', handlePointerUp);

      if (onResizeStart) {
        onResizeStart({ position: positionRef.current });
      }
    },
    [disabled, handlePointerMove, handlePointerUp, onResizeStart],
  );

  const handleKeyDown = useCallback<React.KeyboardEventHandler>(
    (event) => {
      if (disabled) return;

      if (event.key === 'Enter') {
        setPosition(initial);
        positionRef.current = initial;
        return;
      }
      if ((axis === 'x' && !KEYS_AXIS_X.includes(event.key)) || (axis === 'y' && !KEYS_AXIS_Y.includes(event.key))) {
        return;
      }

      if (onResizeStart) onResizeStart({ position: positionRef.current });

      const changeStep = event.shiftKey ? shiftStep : step;
      const reversed = reverse ? -1 : 1;
      const dir = KEYS_POSITIVE.includes(event.key) ? reversed : -1 * reversed;

      const newPosition = position + changeStep * dir;
      if (newPosition < min) {
        setPosition(min);
        positionRef.current = min;
      } else if (newPosition > max) {
        setPosition(max);
        positionRef.current = max;
      } else {
        setPosition(newPosition);
        positionRef.current = newPosition;
      }

      if (onResizeEnd) onResizeEnd({ position: positionRef.current });
    },
    // prettier-ignore
    [disabled, axis, onResizeStart, shiftStep, step, reverse, position, min, max, onResizeEnd, initial],
  );

  const handleDoubleClick = useCallback<React.MouseEventHandler>(() => {
    if (disabled) return;
    setPosition(initial);
    positionRef.current = initial;
  }, [disabled, initial]);

  return {
    position,
    endPosition,
    isDragging,
    separatorProps: {
      ...ariaProps,
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
      onDoubleClick: handleDoubleClick,
    },
    setPosition,
  };
}
