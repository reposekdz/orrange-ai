import React from 'react';

export const FullscreenIcon: React.FC<{ className?: string; isFullscreen?: boolean }> = ({ className = 'w-6 h-6', isFullscreen = false }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isFullscreen ? (
             <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6m0-6l-7 7M9 21H3v-6m0 6l7-7" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M4 4l5 5m-5 6v4h4m-4-4l5 5m11-5v4h-4m4-4l-5 5m5-6V4h-4m4 4l-5-5" />
        )}
    </svg>
);
