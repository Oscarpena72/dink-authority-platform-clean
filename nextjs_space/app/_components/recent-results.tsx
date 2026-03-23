"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronRight } from 'lucide-react';

interface ResultItem {
  id: string;
  tournamentName: string;
  division: string;
  winner: string;
  runnerUp: string;
  score: string | null;
  location: string | null;
  date: string;
  externalUrl: string | null;
}

export default function RecentResults({ results }: { results: ResultItem[] }) {
  const items = results ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
              <Trophy size={20} className="text-brand-accent" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple">Recent Results</h2>
              <p className="text-brand-gray-dark text-sm mt-0.5">Latest scores from the professional circuit</p>
            </div>
          </div>
        </div>
        <div className="bg-brand-gray rounded-xl overflow-hidden border border-gray-100">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-brand-purple text-white text-xs font-bold uppercase tracking-widest">
            <div className="col-span-3">Tournament</div>
            <div className="col-span-2">Division</div>
            <div className="col-span-3">Winner</div>
            <div className="col-span-2">Runner-Up</div>
            <div className="col-span-2">Score</div>
          </div>
          {/* Results rows */}
          {items.map((result: ResultItem, i: number) => (
            <motion.div
              key={result?.id ?? i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`group px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors ${i % 2 === 0 ? 'bg-white/50' : 'bg-brand-gray/50'}`}
            >
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <p className="font-heading font-bold text-brand-purple text-sm">{result?.tournamentName ?? ''}</p>
                  <p className="text-brand-gray-dark text-xs mt-0.5">
                    {result?.date ? new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    {result?.location ? ` · ${result.location}` : ''}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded">
                    {result?.division ?? ''}
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <Medal size={16} className="text-yellow-500 flex-shrink-0" />
                  <span className="font-bold text-brand-purple text-sm">{result?.winner ?? ''}</span>
                </div>
                <div className="col-span-2 text-brand-gray-dark text-sm">{result?.runnerUp ?? ''}</div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-purple text-sm">{result?.score ?? '-'}</span>
                  {result?.externalUrl && (
                    <a href={result.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} />
                    </a>
                  )}
                </div>
              </div>
              {/* Mobile */}
              <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase rounded">
                    {result?.division ?? ''}
                  </span>
                  <span className="text-brand-gray-dark text-xs">
                    {result?.date ? new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <p className="font-heading font-bold text-brand-purple text-sm mb-1">{result?.tournamentName ?? ''}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Medal size={14} className="text-yellow-500" />
                  <span className="font-bold text-brand-purple">{result?.winner ?? ''}</span>
                  <span className="text-brand-gray-dark">vs {result?.runnerUp ?? ''}</span>
                  <span className="font-mono font-bold text-brand-blue ml-auto">{result?.score ?? '-'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
