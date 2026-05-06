"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, FileText, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  ZoomIn, ZoomOut, RotateCcw, ExternalLink, Newspaper, Mail, Megaphone, Loader2, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import ShareButtons from './share-buttons';

// ─── Pinch-zoom & gesture utilities ──────────────────────────────────
function getTouchDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function usePinchZoom(
  zoom: number,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
  _containerRef: React.RefObject<HTMLDivElement>,
) {
  const gestureRef = useRef<{
    isPinching: boolean;
    startDist: number;
    startZoom: number;
  }>({
    isPinching: false,
    startDist: 0,
    startZoom: 1,
  });

  const isPinching = useCallback(() => gestureRef.current.isPinching, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      gestureRef.current.isPinching = true;
      gestureRef.current.startDist = getTouchDistance(e.touches[0], e.touches[1]);
      gestureRef.current.startZoom = zoom;
      e.stopPropagation();
    }
    // Single-finger pan is handled by native overflow scrolling (touchAction: pan-x pan-y)
  }, [zoom]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && gestureRef.current.isPinching) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = dist / gestureRef.current.startDist;
      const newZoom = Math.max(0.5, Math.min(3, gestureRef.current.startZoom * scale));
      setZoom(newZoom);
      e.preventDefault();
      e.stopPropagation();
    }
    // Single-finger moves use native scrolling — no manual pan needed
  }, [setZoom]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setTimeout(() => {
        gestureRef.current.isPinching = false;
      }, 100);
    }
  }, []);

  return { onTouchStart, onTouchMove, onTouchEnd, isPinching };
}

interface EditionData {
  id: string;
  title: string;
  slug: string;
  issueNumber: string | null;
  coverUrl: string | null;
  description: string | null;
  pdfUrl: string | null;
  pdfCloudPath: string | null;
  pdfPageCount: number | null;
  externalUrl: string | null;
  isCurrent: boolean;
  publishDate: string;
  coverAthlete?: string | null;
  seoContent?: string | null;
  seoH1?: string | null;
}

type ViewMode = 'flipbook' | 'reader';

export default function MagazineViewerClient({ edition }: { edition: EditionData }) {
  // Track view on mount (fire-and-forget)
  useEffect(() => {
    if (edition?.id) {
      fetch(`/api/magazine/${edition.id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [edition?.id]);

  const [viewMode, setViewMode] = useState<ViewMode>('flipbook');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pdfLib, setPdfLib] = useState<any>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [pageImages, setPageImages] = useState<Map<number, string>>(new Map());
  const [renderingPages, setRenderingPages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<any>(null);
  const viewerScrollRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [FlipBookComponent, setFlipBookComponent] = useState<any>(null);
  // Store the raw PDF URL for iframe fallback if interactive viewer fails
  const [fallbackPdfUrl, setFallbackPdfUrl] = useState<string | null>(null);
  // Real PDF page aspect ratio (height / width)
  const [pdfAspectRatio, setPdfAspectRatio] = useState(1.414); // default A4, updated after first render
  const autoFitApplied = useRef(false);

  // Pinch-zoom hook for mobile gesture handling
  const pinch = usePinchZoom(zoom, setZoom, viewerScrollRef);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-fit zoom on first load: ensure entire page is visible without scrolling
  useEffect(() => {
    if (!pdfLib || autoFitApplied.current || typeof window === 'undefined') return;
    autoFitApplied.current = true;
    const baseWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : 500;
    const baseHeight = Math.round(baseWidth * pdfAspectRatio);
    const available = window.innerHeight - 280; // header + toolbar + padding
    if (baseHeight > available) {
      setZoom(parseFloat(Math.max(0.35, available / baseHeight).toFixed(2)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfLib, pdfAspectRatio, isMobile, setZoom]);

  // Navigation helpers — used by toolbar and side buttons
  const goToPrev = useCallback(() => {
    if (currentPage <= 1) return;
    setCurrentPage(p => Math.max(1, p - 1));
    if (viewMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.pageFlip()?.flipPrev();
    }
  }, [currentPage, viewMode]);

  const goToNext = useCallback(() => {
    if (currentPage >= numPages) return;
    setCurrentPage(p => Math.min(numPages, p + 1));
    if (viewMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.pageFlip()?.flipNext();
    }
  }, [currentPage, numPages, viewMode]);

  // Both modes (flipbook & reader) work on all devices — no forced switching

  // Fetch PDF and load as ArrayBuffer for reliable cross-device support
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPdf() {
      try {
        // Get the PDF URL (public URL or signed URL)
        const checkRes = await fetch(`/api/magazine/pdf-url?slug=${encodeURIComponent(edition.slug)}`);
        if (!checkRes.ok) {
          if (edition.externalUrl) {
            window.location.href = edition.externalUrl;
            return;
          }
          setError('No PDF available for this edition.');
          setLoading(false);
          return;
        }
        const data = await checkRes.json();
        if (data.pageCount) setNumPages(data.pageCount);

        // Download PDF directly from the URL (public S3 URL or signed URL)
        const pdfUrl = data.url;
        if (!pdfUrl) {
          throw new Error('No PDF URL returned');
        }

        // Save URL for iframe fallback before attempting interactive render
        setFallbackPdfUrl(pdfUrl);

        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
          // Fallback: try the proxy endpoint (works when S3 credentials are available)
          const proxyUrl = `/api/magazine/pdf-proxy?slug=${encodeURIComponent(edition.slug)}`;
          const proxyResponse = await fetch(proxyUrl);
          if (!proxyResponse.ok) {
            throw new Error(`PDF download failed: ${pdfResponse.status}`);
          }
          const buffer = await proxyResponse.arrayBuffer();
          if (cancelled) return;
          setLoadProgress(100);
          setPdfData(buffer);
          return;
        }

        // Read with progress tracking
        const contentLength = pdfResponse.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (pdfResponse.body && total > 0) {
          const reader = pdfResponse.body.getReader();
          const chunks: Uint8Array[] = [];
          let received = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done || cancelled) break;
            chunks.push(value);
            received += value.length;
            setLoadProgress(Math.round((received / total) * 100));
          }

          if (cancelled) return;

          // Combine chunks into single ArrayBuffer
          const combined = new Uint8Array(received);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          setPdfData(combined.buffer);
        } else {
          // Fallback: read entire response at once
          const buffer = await pdfResponse.arrayBuffer();
          if (cancelled) return;
          setLoadProgress(100);
          setPdfData(buffer);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error('PDF fetch error:', err);
        setError(`Failed to load magazine: ${err?.message || 'Unknown error'}. Please try again.`);
      }
      setLoading(false);
    }
    fetchPdf();
    return () => { cancelled = true; };
  }, [edition.slug, edition.externalUrl]);

  // Load pdfjs from ArrayBuffer data
  useEffect(() => {
    if (!pdfData) return;
    let cancelled = false;
    async function loadPdfJs() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        // Load from ArrayBuffer - no network issues, no CORS, no range requests
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(pdfData as ArrayBuffer),
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfLib(pdf);
        setNumPages(pdf.numPages);
        // Detect real page dimensions from first page
        try {
          const firstPage = await pdf.getPage(1);
          const vp = firstPage.getViewport({ scale: 1 });
          if (vp.width > 0 && vp.height > 0) {
            setPdfAspectRatio(vp.height / vp.width);
          }
        } catch (_) { /* keep default */ }
      } catch (err: any) {
        if (cancelled) return;
        console.error('PDF parse error:', err);
        // Set error but fallback iframe will be shown since fallbackPdfUrl is available
        setError(`Interactive viewer failed: ${err?.message || 'Unknown error'}`);
      }
    }
    loadPdfJs();
    return () => { cancelled = true; };
  }, [pdfData]);

  // Load flipbook component dynamically
  useEffect(() => {
    if (viewMode === 'flipbook') {
      import('react-pageflip').then(mod => {
        setFlipBookComponent(() => mod.default);
      }).catch(() => {
        console.error('Failed to load react-pageflip');
      });
    }
  }, [viewMode]);

  // Render a specific page to canvas then convert to image
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfLib || pageImages.has(pageNum) || renderingPages.has(pageNum)) return;

    setRenderingPages(prev => new Set(prev).add(pageNum));

    try {
      const page = await pdfLib.getPage(pageNum);
      const scale = 2; // High res for quality
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setPageImages(prev => {
        const next = new Map(prev);
        next.set(pageNum, dataUrl);
        return next;
      });
    } catch (err) {
      console.error(`Error rendering page ${pageNum}:`, err);
    } finally {
      setRenderingPages(prev => {
        const next = new Set(prev);
        next.delete(pageNum);
        return next;
      });
    }
  }, [pdfLib, pageImages, renderingPages]);

  // Lazy load pages near current page
  useEffect(() => {
    if (!pdfLib || numPages === 0) return;
    const pagesToLoad = [];
    const range = viewMode === 'flipbook' ? 4 : 3;
    for (let i = Math.max(1, currentPage - range); i <= Math.min(numPages, currentPage + range); i++) {
      if (!pageImages.has(i)) pagesToLoad.push(i);
    }
    pagesToLoad.forEach(p => renderPage(p));
  }, [pdfLib, currentPage, numPages, viewMode, pageImages, renderPage]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Touch/swipe handling for reader mode — blocked when zoomed or pinching
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 || pinch.isPinching()) return; // don't track swipe when zoomed
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || zoom > 1 || pinch.isPinching()) { setTouchStart(null); return; }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && currentPage < numPages) setCurrentPage(p => p + 1);
      if (dx > 0 && currentPage > 1) setCurrentPage(p => p - 1);
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentPage(p => Math.min(p + 1, numPages));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentPage(p => Math.max(p - 1, 1));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [numPages, toggleFullscreen]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Flipbook page component
  const FlipPage = React.forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => {
    const imgSrc = pageImages.get(pageNum);
    return (
      <div ref={ref} className="bg-white shadow-md">
        {imgSrc ? (
          <img src={imgSrc} alt={`Page ${pageNum}`} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-brand-purple/30" />
          </div>
        )}
      </div>
    );
  });
  FlipPage.displayName = 'FlipPage';

  const pageNumbers = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);

  if (loading || (pdfData && !pdfLib && !error)) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="text-center max-w-xs mx-auto">
          <Loader2 className="w-12 h-12 animate-spin text-brand-purple mx-auto mb-4" />
          <p className="text-brand-purple font-heading font-bold text-lg mb-2">Loading magazine...</p>
          {loadProgress > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-brand-neon h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="text-brand-gray-dark text-xs mt-2">{loadProgress}% downloaded</p>
            </div>
          )}
          <p className="text-brand-gray-dark text-xs mt-2">This may take a moment for large files</p>
        </div>
      </div>
    );
  }

  if (error) {
    // If we have the PDF URL, show iframe fallback instead of dead-end error
    if (fallbackPdfUrl) {
      return (
        <>
          <Header />
          <div className="bg-brand-gray min-h-screen">
            {/* Magazine Header */}
            <div className="bg-brand-purple py-6 md:py-8">
              <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {edition.issueNumber && (
                      <span className="text-brand-neon text-xs font-bold uppercase tracking-widest">{edition.issueNumber}</span>
                    )}
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mt-1">{edition.seoH1 || edition.title}</h2>
                    <p className="text-white/60 text-sm mt-1">
                      {new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={edition.title} description={edition.description ?? undefined} />
                  </div>
                </div>
              </div>
            </div>

            {/* Fallback notice */}
            <div className="max-w-[1400px] mx-auto px-4 pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    The interactive viewer encountered an issue. You can still read the magazine below using your browser&apos;s built-in PDF viewer.
                  </p>
                </div>
                <a
                  href={fallbackPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-bold rounded-lg hover:bg-brand-purple-light transition-colors flex-shrink-0"
                >
                  <ExternalLink size={14} /> Open PDF Full Screen
                </a>
              </div>
            </div>

            {/* Iframe PDF viewer fallback */}
            <div className="max-w-[1400px] mx-auto px-4 py-4">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <iframe
                  src={fallbackPdfUrl}
                  className="w-full border-0"
                  style={{ height: '85vh', minHeight: '600px' }}
                  title={`${edition.title} - PDF Viewer`}
                  allow="fullscreen"
                />
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    // No PDF URL available at all — true dead end
    return (
      <>
        <Header />
        <div className="min-h-[60vh] bg-brand-gray flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <BookOpen size={48} className="text-brand-purple/30 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-brand-purple mb-2">Magazine Unavailable</h2>
            <p className="text-brand-gray-dark mb-4">{error}</p>
            {edition.externalUrl && (
              <a href={edition.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim">
                Read on External Site
              </a>
            )}
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-purple text-brand-purple font-medium rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
              >
                <RotateCcw size={16} /> Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-brand-gray min-h-screen">
        {/* Magazine Header */}
        <div className="bg-brand-purple py-6 md:py-8">
          <div className="max-w-[1400px] mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                {edition.issueNumber && (
                  <span className="text-brand-neon text-xs font-bold uppercase tracking-widest">{edition.issueNumber}</span>
                )}
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mt-1">{edition.seoH1 || edition.title}</h2>
                <p className="text-white/60 text-sm mt-1">
                  {new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {edition.issueNumber && <span className="ml-2">· {edition.issueNumber}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <ShareButtons url={shareUrl} title={edition.seoH1 || edition.title} description={edition.description ?? undefined} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* View Mode Toggle + Navigation + Controls — sticky toolbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-between gap-2">
            {/* Left: view mode toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('flipbook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'flipbook'
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-purple'
                }`}
              >
                <BookOpen size={14} />
              </button>
              <button
                onClick={() => setViewMode('reader')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'reader'
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-purple'
                }`}
              >
                <FileText size={14} /> <span className="hidden sm:inline">Reader</span>
              </button>
            </div>

            {/* Center: page navigation — ALWAYS visible */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={goToPrev}
                disabled={currentPage <= 1}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} className="text-brand-purple" />
              </button>
              <span className="text-sm text-brand-gray-dark min-w-[80px] text-center hidden sm:inline">
                Page {currentPage} of {numPages}
              </span>
              <span className="text-sm text-brand-gray-dark min-w-[40px] text-center sm:hidden">
                {currentPage}/{numPages}
              </span>
              <button
                onClick={goToNext}
                disabled={currentPage >= numPages}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight size={18} className="text-brand-purple" />
              </button>
            </div>

            {/* Right: zoom + utilities */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setZoom(z => Math.max(0.3, +(z - 0.15).toFixed(2)))} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Zoom out">
                <ZoomOut size={16} className="text-gray-600" />
              </button>
              <button onClick={() => setZoom(1)} className="px-1 py-0.5 hover:bg-gray-100 rounded transition-colors min-w-[36px] text-center" title="Reset zoom">
                <span className="text-xs font-medium text-gray-500">{Math.round(zoom * 100)}%</span>
              </button>
              <button onClick={() => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Zoom in">
                <ZoomIn size={16} className="text-gray-600" />
              </button>
              {fallbackPdfUrl && (
                <a href={fallbackPdfUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 rounded hidden sm:block" title="Open PDF Full Screen">
                  <ExternalLink size={16} className="text-gray-600" />
                </a>
              )}
              <button onClick={toggleFullscreen} className="p-1.5 hover:bg-gray-100 rounded" title="Fullscreen">
                {isFullscreen ? <Minimize2 size={16} className="text-gray-600" /> : <Maximize2 size={16} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Viewer */}
        <div ref={containerRef} className={`relative ${isFullscreen ? 'bg-gray-900 flex flex-col' : ''}`}>
          {isFullscreen && (
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
              <span className="text-white/80 text-sm font-medium">{edition.title}</span>
              <div className="flex items-center gap-3">
                <button onClick={goToPrev} disabled={currentPage <= 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-30"><ChevronLeft size={16} className="text-white" /></button>
                <span className="text-white/60 text-sm">Page {currentPage} / {numPages}</span>
                <button onClick={goToNext} disabled={currentPage >= numPages} className="p-1 hover:bg-white/10 rounded disabled:opacity-30"><ChevronRight size={16} className="text-white" /></button>
                <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/10 rounded">
                  <Minimize2 size={16} className="text-white" />
                </button>
              </div>
            </div>
          )}

          <div className={`max-w-[1400px] mx-auto px-4 py-3 ${isFullscreen ? 'flex-1 flex items-center justify-center' : ''}`}>
            {viewMode === 'flipbook' ? (
              <FlipbookView
                FlipBookComponent={FlipBookComponent}
                pageImages={pageImages}
                numPages={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                flipbookRef={flipbookRef}
                pageNumbers={pageNumbers}
                isFullscreen={isFullscreen}
                isMobile={isMobile}
                zoom={zoom}
                pdfAspectRatio={pdfAspectRatio}
                pinch={pinch}
                viewerScrollRef={viewerScrollRef}
                goToPrev={goToPrev}
                goToNext={goToNext}
              />
            ) : (
              <ReaderView
                pageImages={pageImages}
                numPages={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                zoom={zoom}
                handleTouchStart={handleTouchStart}
                handleTouchEnd={handleTouchEnd}
                isFullscreen={isFullscreen}
                pinch={pinch}
                viewerScrollRef={viewerScrollRef}
                goToPrev={goToPrev}
                goToNext={goToNext}
              />
            )}
          </div>
        </div>

        {/* CTA Section */}
        {!isFullscreen && (
          <div className="bg-white border-t border-gray-200">
            <div className="max-w-[1400px] mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CTACard
                  icon={<ShareButtons url={shareUrl} title={edition.seoH1 || edition.title} description={edition.description ?? undefined} />}
                  customButton
                />
                <CTACard
                  icon={<Newspaper size={20} />}
                  label="Latest Articles"
                  href="/news"
                />
                <CTACard
                  icon={<Mail size={20} />}
                  label="Subscribe"
                  href="/#newsletter"
                />
                <CTACard
                  icon={<Megaphone size={20} />}
                  label="Advertise With Us"
                  href="/contact"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section moved to server component (page.tsx) for HTML-initial rendering */}
      </div>
      {!isFullscreen && <Footer />}
    </>
  );
}

// ─── Flipbook View Component ─────────────────────────────────────────
function FlipbookView({
  FlipBookComponent,
  pageImages,
  numPages,
  currentPage,
  setCurrentPage,
  flipbookRef,
  pageNumbers,
  isFullscreen,
  isMobile,
  zoom,
  pdfAspectRatio,
  pinch,
  viewerScrollRef,
  goToPrev,
  goToNext,
}: {
  FlipBookComponent: any;
  pageImages: Map<number, string>;
  numPages: number;
  currentPage: number;
  setCurrentPage: (p: number | ((p: number) => number)) => void;
  flipbookRef: React.RefObject<any>;
  pageNumbers: number[];
  isFullscreen: boolean;
  isMobile: boolean;
  zoom: number;
  pdfAspectRatio: number;
  pinch: ReturnType<typeof usePinchZoom>;
  viewerScrollRef: React.RefObject<HTMLDivElement>;
  goToPrev: () => void;
  goToNext: () => void;
}) {
  if (!FlipBookComponent || numPages === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple/40" />
      </div>
    );
  }

  const width = isMobile ? Math.min(typeof window !== 'undefined' ? window.innerWidth - 32 : 360, 400) : 500;
  const height = Math.round(width * pdfAspectRatio);

  const isZoomed = zoom > 1;
  // CSS transform: scale() doesn't change layout dimensions.
  // Negative-margin trick compensates so the scroll container sees the *visual* size.
  const mbPx = Math.round(height * (zoom - 1)); // negative shrinks layout when zoom<1, positive expands when zoom>1
  const mrPx = isZoomed ? Math.round(width * (zoom - 1)) : 0;

  const vpH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const availableH = isFullscreen ? vpH - 100 : Math.max(300, vpH - 120);

  return (
    <div className="relative">
      {/* Scroll wrapper — overflow:auto always so zoomed content is pannable */}
      <div
        ref={viewerScrollRef}
        style={{
          maxHeight: availableH,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: isZoomed ? 'pan-x pan-y' : 'auto',
        }}
        onTouchStart={pinch.onTouchStart}
        onTouchMove={pinch.onTouchMove}
        onTouchEnd={pinch.onTouchEnd}
      >
        <div className={`flex items-start ${isZoomed ? 'justify-start' : 'justify-center'}`}>
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: isZoomed ? 'top left' : 'top center',
              marginBottom: mbPx,
              marginRight: mrPx,
            }}
          >
            <FlipBookComponent
              ref={flipbookRef}
              width={width}
              height={height}
              size="stretch"
              minWidth={280}
              maxWidth={600}
              minHeight={Math.round(280 * pdfAspectRatio)}
              maxHeight={Math.round(600 * pdfAspectRatio)}
              showCover={true}
              mobileScrollSupport={!isZoomed}
              onFlip={(e: any) => {
                if (!pinch.isPinching()) {
                  setCurrentPage((e?.data ?? 0) + 1);
                }
              }}
              className="shadow-2xl"
              useMouseEvents={true}
              swipeDistance={isZoomed ? 9999 : 30}
              showPageCorners={!isZoomed}
              flippingTime={600}
              disableFlipByClick={false}
            >
              {pageNumbers.map(pageNum => {
                const imgSrc = pageImages.get(pageNum);
                return (
                  <div key={pageNum} className="bg-white">
                    {imgSrc ? (
                      <img src={imgSrc} alt={`Page ${pageNum}`} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-purple/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </FlipBookComponent>
          </div>
        </div>
      </div>

      {/* Side navigation arrows — positioned relative to the viewer wrapper, always visible */}
      <button
        onClick={goToPrev}
        disabled={currentPage <= 1}
        className={`absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all disabled:opacity-20 disabled:pointer-events-none ${
          isFullscreen
            ? 'bg-white/15 text-white hover:bg-white/30'
            : 'bg-white/90 text-brand-purple hover:bg-white border border-gray-200/50'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        disabled={currentPage >= numPages}
        className={`absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all disabled:opacity-20 disabled:pointer-events-none ${
          isFullscreen
            ? 'bg-white/15 text-white hover:bg-white/30'
            : 'bg-white/90 text-brand-purple hover:bg-white border border-gray-200/50'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// ─── Reader View Component ───────────────────────────────────────────
function ReaderView({
  pageImages,
  numPages,
  currentPage,
  setCurrentPage,
  zoom,
  handleTouchStart,
  handleTouchEnd,
  isFullscreen,
  pinch,
  viewerScrollRef,
  goToPrev,
  goToNext,
}: {
  pageImages: Map<number, string>;
  numPages: number;
  currentPage: number;
  setCurrentPage: (p: number | ((p: number) => number)) => void;
  zoom: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  isFullscreen: boolean;
  pinch: ReturnType<typeof usePinchZoom>;
  viewerScrollRef: React.RefObject<HTMLDivElement>;
  goToPrev: () => void;
  goToNext: () => void;
}) {
  const imgSrc = pageImages.get(currentPage);
  const isZoomed = zoom > 1;
  const vpH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const availableH = isFullscreen ? vpH - 100 : Math.max(300, vpH - 120);
  // Base width for the reader image (no CSS transform — use real dimensions for proper scroll)
  const baseW = typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 600) : 500;
  const imgW = Math.round(baseW * zoom);

  return (
    <div className="relative">
      <div
        ref={viewerScrollRef}
        className="overflow-auto"
        style={{
          maxHeight: availableH,
          WebkitOverflowScrolling: 'touch',
          touchAction: isZoomed ? 'pan-x pan-y' : 'auto',
        }}
        onTouchStart={(e) => { pinch.onTouchStart(e); handleTouchStart(e); }}
        onTouchMove={pinch.onTouchMove}
        onTouchEnd={(e) => { pinch.onTouchEnd(e); handleTouchEnd(e); }}
      >
        <div className={`flex items-start ${isZoomed ? 'justify-start' : 'justify-center'} p-2`}>
          <div className="shadow-2xl rounded-lg overflow-hidden bg-white flex-shrink-0">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={`Page ${currentPage}`}
                className="block"
                style={{ width: imgW, height: 'auto', maxWidth: 'none' }}
              />
            ) : (
              <div className="w-[400px] h-[566px] flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple/30" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side navigation arrows */}
      <button
        onClick={goToPrev}
        disabled={currentPage <= 1}
        className={`absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all disabled:opacity-20 disabled:pointer-events-none ${
          isFullscreen
            ? 'bg-white/15 text-white hover:bg-white/30'
            : 'bg-white/90 text-brand-purple hover:bg-white border border-gray-200/50'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        disabled={currentPage >= numPages}
        className={`absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all disabled:opacity-20 disabled:pointer-events-none ${
          isFullscreen
            ? 'bg-white/15 text-white hover:bg-white/30'
            : 'bg-white/90 text-brand-purple hover:bg-white border border-gray-200/50'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// CTA Card Component
function CTACard({ icon, label, href, customButton }: { icon: React.ReactNode; label?: string; href?: string; customButton?: boolean }) {
  if (customButton) {
    return (
      <div className="flex items-center justify-center p-4 bg-brand-gray rounded-xl">
        {icon}
      </div>
    );
  }
  return (
    <Link
      href={href ?? '#'}
      className="flex items-center gap-3 p-4 bg-brand-gray rounded-xl hover:bg-brand-purple hover:text-white group transition-all"
    >
      <span className="text-brand-purple group-hover:text-brand-neon transition-colors">{icon}</span>
      <span className="font-medium text-sm text-brand-purple group-hover:text-white transition-colors">{label}</span>
    </Link>
  );
}
