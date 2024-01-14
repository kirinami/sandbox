import { ComponentPropsWithoutRef, useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizable } from '@/hooks/useResizable';

type SeparatorProps = ComponentPropsWithoutRef<'hr'> & {
  id?: string;
  direction?: 'vertical' | 'horizontal';
  isDragging: boolean;
  disabled?: boolean;
};

function Separator({ id = 'drag-separator', direction = 'vertical', isDragging, disabled, ...props }: SeparatorProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <hr
      id={id}
      className={clsx(
        'flex-shrink-0 m-0 border-0 bg-[#313131] transition-colors',
        (direction === 'vertical' && 'w-[5px] h-full cursor-col-resize') || 'w-full h-[5px] cursor-row-resize',
        !disabled && (isDragging || isFocused) && 'bg-[#4d4d4d]',
        (disabled && 'bg-[#4d4d4d] cursor-not-allowed') || 'hover:bg-[#4d4d4d]',
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}

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
        <Separator isDragging={isPreviewDragging} {...previewSeparatorProps} />
        <div className="flex-shrink-0" style={{ width: previewPosition }}>
          <div className="flex flex-row p-2 gap-2 bg-stone-900 border-b border-[#313131]">
            <div className="flex items-center w-full gap-2 px-2 py-1 rounded text-sm bg-stone-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>

              <span>{import.meta.env.VITE_PREVIEW_URL}</span>
            </div>
            <button
              className="p-2 text-sm bg-blue-800 rounded hover:bg-opacity-80"
              type="button"
              onClick={handlePreviewIframeReload}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
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
