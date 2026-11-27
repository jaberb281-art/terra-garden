'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/** Keep the complete server-rendered list, with a shorter mobile view. */
export function MobileDisclosure({
  children, className, controls, showLabel, hideLabel, previewLabel, expandedLabel,
}: {
  children: ReactNode;
  className: string;
  controls: string;
  showLabel: string;
  hideLabel: string;
  previewLabel?: string;
  expandedLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={className} data-expanded={expanded}>
      {children}
      <div className="mobile-disclosure-controls">
        {previewLabel && <p className="disclosure-status" role="status">{expanded ? expandedLabel : previewLabel}</p>}
        <button
          type="button"
          className="button disclosure-toggle"
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={() => setExpanded(value => !value)}
        >
          {expanded ? hideLabel : showLabel}<ChevronDown size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
