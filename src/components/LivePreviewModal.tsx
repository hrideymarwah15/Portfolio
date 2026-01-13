"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, Loader2 } from "lucide-react";

interface LivePreviewModalProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LivePreviewModal({
  url,
  title,
  isOpen,
  onClose,
}: LivePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[85vh] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h3 className="font-mono font-bold text-lg truncate">{title}</h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-bold border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              OPEN FULL
            </a>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="relative w-full h-[calc(100%-64px)] bg-white">
          {url.includes("github.com") ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-mono font-bold text-xl mb-3">Cannot Embed GitHub</h3>
                <p className="text-gray-600 mb-8">
                  GitHub prevents their site from being displayed inside other websites.
                  Please open the link directly.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-mono font-bold border-2 border-black hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  OPEN IN NEW TAB
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="font-mono text-sm text-gray-600">Loading preview...</p>
                  </div>
                </div>
              )}
              <iframe
                src={url}
                className="w-full h-full border-0 bg-white"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                title={`Preview of ${title}`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads"
                loading="lazy"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
