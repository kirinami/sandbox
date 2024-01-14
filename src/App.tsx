import { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizable } from '@/hooks/useResizable';

// eslint-disable-next-line
const SampleSeparator = ({ id = 'drag-bar', dir, isDragging, disabled, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <hr
      id={id}
      data-testid={id}
      tabIndex={disabled ? -1 : 0}
      className={clsx(
        'sample-drag-bar',
        dir === 'horizontal' && 'sample-drag-bar--horizontal',
        !disabled && (isDragging || isFocused) && 'sample-drag-bar--dragging',
        disabled && 'rrl-disabled',
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
};

export function App() {
  const {
    isDragging: isPreviewDragging,
    position: previewPosition,
    separatorProps: previewSeparatorProps,
  } = useResizable({
    axis: 'x',
    initial: 500,
    min: 375,
    max: window.innerWidth - 640,
    reverse: true,
  });

  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);

  const handlePreviewIframeReload = () => {
    if (previewIframeRef.current) {
      previewIframeRef.current.src += '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1f1f1f] overflow-hidden">
      <div className="flex flex-grow">
        <div className="flex-grow">
          <iframe
            className={clsx('w-full h-full border-0', isPreviewDragging && 'pointer-events-none')}
            src={`${import.meta.env.VITE_CODE_URL}/?folder=/home/coder/workspace`}
            allow="fullscreen; clipboard-read; clipboard-write"
          />
        </div>
        <SampleSeparator isDragging={isPreviewDragging} {...previewSeparatorProps} />
        <div className="flex-shrink-0" style={{ width: previewPosition }}>
          <div className="flex flex-row p-2 gap-4 bg-stone-900">
            <button className="p-2 text-sm bg-gray-900" type="button" onClick={handlePreviewIframeReload}>
              reload
            </button>
            <input
              className="w-full px-2 py-1 rounded text-sm bg-stone-800"
              type="text"
              defaultValue={import.meta.env.VITE_PREVIEW_URL}
              disabled
            />
          </div>
          <iframe
            ref={previewIframeRef}
            className={clsx('w-full h-full border-0', isPreviewDragging && 'pointer-events-none')}
            src={import.meta.env.VITE_PREVIEW_URL}
            allow="fullscreen; clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
