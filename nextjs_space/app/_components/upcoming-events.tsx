"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface EventItem {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string | null;
  externalUrl: string | null;
}

export default function UpcomingEvents({ events }: { events: EventItem[] }) {
  const items = events ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-brand-purple">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Calendar size={24} className="text-brand-neon" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">Upcoming Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((event: EventItem, i: number) => (
            <motion.div
              key={event?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-purple-light rounded-lg p-6 border border-white/10 hover:border-brand-neon/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-brand-neon/10 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-brand-neon text-lg font-bold font-heading">
                    {event?.startDate ? new Date(event.startDate).getDate() : '--'}
                  </span>
                  <span className="text-brand-neon text-[10px] uppercase font-bold">
                    {event?.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }) : ''}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-white text-lg mb-2">{event?.name ?? 'Event'}</h3>
                  <div className="flex items-center gap-1 text-white/60 text-sm mb-1">
                    <MapPin size={14} />
                    <span>{event?.location ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Calendar size={14} />
                    <span>
                      {event?.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                      {event?.endDate ? ` - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` : ''}
                    </span>
                  </div>
                  {event?.externalUrl && (
                    <a
                      href={event.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-brand-neon text-sm font-semibold hover:underline"
                    >
                      Learn More <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
