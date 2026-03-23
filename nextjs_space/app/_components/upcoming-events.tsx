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
    <section className="py-14 bg-brand-purple-dark relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center">
            <Calendar size={20} className="text-brand-neon" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">Upcoming Events</h2>
            <p className="text-white/50 text-sm mt-0.5">Tournaments and competitions around the world</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((event: EventItem, i: number) => (
            <motion.div
              key={event?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-purple-light/80 rounded-xl p-6 border border-white/5 hover:border-brand-blue/30 transition-all duration-300 hover:bg-brand-purple-light group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 blue-gradient rounded-xl flex flex-col items-center justify-center shadow-lg shadow-brand-blue/20">
                  <span className="text-white text-xl font-bold font-heading leading-none">
                    {event?.startDate ? new Date(event.startDate).getDate() : '--'}
                  </span>
                  <span className="text-white/80 text-[10px] uppercase font-bold mt-0.5">
                    {event?.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }) : ''}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-white text-lg mb-2 group-hover:text-brand-neon transition-colors">{event?.name ?? 'Event'}</h3>
                  <div className="flex items-center gap-1.5 text-white/50 text-sm mb-1">
                    <MapPin size={14} className="text-brand-blue/70" />
                    <span>{event?.location ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 text-sm">
                    <Calendar size={14} className="text-brand-blue/70" />
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
                      className="inline-flex items-center gap-1.5 mt-3 text-brand-neon text-sm font-bold hover:text-white transition-colors uppercase tracking-wider"
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
