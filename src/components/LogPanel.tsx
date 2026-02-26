import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface Props {
  log: LogEntry[];
  onClose: () => void;
}

export function LogPanel({ log, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel log-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Battle Log</h2>
          <button className="icon-btn modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="log-scroll" ref={scrollRef}>
          {log.map((entry, i) => (
            <div key={i} className={`log-entry ${entry.faction}`}>
              <span className="log-meta">T{entry.turn}</span>
              <span className="log-text">{entry.message}</span>
            </div>
          ))}
          {log.length === 0 && (
            <div className="log-empty">No entries yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
