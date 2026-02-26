import React, { useState } from 'react';
import { EventCard } from '../types';

interface Props {
  event: EventCard;
}

function eventTypeIcon(effectType: string): string {
  if (effectType.includes('combat') || effectType.includes('attack')) return '⚔';
  if (effectType.includes('cp') || effectType.includes('CP')) return '⚡';
  if (effectType.includes('vision') || effectType.includes('recon')) return '👁';
  if (effectType.includes('artillery')) return '💥';
  if (effectType.includes('supply')) return '📦';
  if (effectType.includes('move') || effectType.includes('mp')) return '🚶';
  return '◆';
}

export function EventBanner({ event }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const icon = eventTypeIcon(event.effect.type);

  if (collapsed) {
    return (
      <div className="event-banner event-banner-collapsed" onClick={() => setCollapsed(false)}>
        <span className="event-type-icon">{icon}</span>
        <span className="event-title-mini">{event.title}</span>
        <span className="event-expand-hint">▼</span>
      </div>
    );
  }

  return (
    <div className="event-banner" onClick={() => setCollapsed(true)}>
      <div className="event-accent-bar" />
      <div className="event-content">
        <div className="event-header">
          <span className="event-type-icon">{icon}</span>
          <span className="event-title">{event.title}</span>
          <span className="event-collapse">▲</span>
        </div>
        <div className="event-flavor">{event.flavor}</div>
        <div className="event-rule">{event.ruleText}</div>
      </div>
    </div>
  );
}
