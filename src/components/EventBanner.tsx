import React, { useState } from 'react';
import { EventCard } from '../types';

interface Props {
  event: EventCard;
}

export function EventBanner({ event }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="event-banner collapsed" onClick={() => setCollapsed(false)}>
        <span className="event-pip">&#9830;</span>
        <span className="event-title-mini">{event.title}</span>
      </div>
    );
  }

  return (
    <div className="event-banner" onClick={() => setCollapsed(true)}>
      <div className="event-header">
        <span className="event-pip">&#9830;</span>
        <span className="event-title">{event.title}</span>
        <span className="event-collapse">&#9662;</span>
      </div>
      <div className="event-flavor">{event.flavor}</div>
      <div className="event-rule">{event.ruleText}</div>
    </div>
  );
}
