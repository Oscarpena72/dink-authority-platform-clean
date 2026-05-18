"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, FileText, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  ZoomIn, ZoomOut, RotateCcw, Newspaper, Mail, Megaphone, Loader2, Move
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
) {
  const gestureRef = useRef<{
    isPinching: boolean;
    startDist: number;
    startZoom: number;
    pinchEndTimer: ReturnType<typeof setTimeout> | null;
  }>({
    isPinching: false,
    startDist: 0,
    startZoom: 1,
    pinchEndTimer: null,
  });

  const isPinching = useCallback(() => gestureRef.current.isPinching, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Clear any pending end timer
      if (gestureRef.current.pinchEndTimer) {
        clearTimeout(gestureRef.current.pinchEndTimer);
        gestureRef.current.pinchEndTimer = null;
      }
      gestureRef.current.isPinching = true;
      gestureRef.current.startDist = getTouchDistance(e.touches[0], e.touches[1]);
      gestureRef.current.startZoom = zoom;
      e.stopPropagation();
    }
  }, [zoom]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && gestureRef.current.isPinching) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = dist / gestureRef.current.startDist;
      const newZoom = Math.max(0.5, Math.min(4, gestureRef.current.startZoom * scale));
      setZoom(newZoom);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [setZoom]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2 && gestureRef.current.isPinching) {
      // Delay clearing isPinching so swipe handlers don't fire right after pinch
      gestureRef.current.pinchEndTimer = setTimeout(() => {
        gestureRef.current.isPinching = false;
        gestureRef.current.pinchEndTimer = null;
      }, 300);
    }
  }, []);

  return { onTouchStart, onTouchMove, onTouchEnd, isPinching };
}

// ─── Mouse drag pan (desktop zoom panning) ───────────────────────────
function useMouseDragPan(
  scrollRef: React.RefObject<HTMLDivElement>,
  isZoomed: boolean,
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isZoomed || !scrollRef.current) return;
    // Only left click
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    };
    e.preventDefault();
  }, [isZoomed, scrollRef]);

  useEffect(() => {
    if (!isZoomed) {
      setIsDragging(false);
      return;
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
      scrollRef.current.scrollTop = dragStart.current.scrollTop - dy;
    };
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isZoomed, scrollRef]);

  return { onMouseDown, isDragging };
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
  const [flipbookFailed, setFlipbookFailed] = useState(false);
  const [interactiveViewerFailed, setInteractiveViewerFailed] = useState(false);
  const [iframeFallbackFailed, setIframeFallbackFailed] = useState(false);
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
  const [fallbackPdfUrl, setFallbackPdfUrl] = useState<string | null>(null);
  const [pdfAspectRatio, setPdfAspectRatio] = useState(1.414);

  const isZoomed = zoom > 1.05; // Small threshold to avoid float precision issues

  // Pinch-zoom hook for mobile gesture handling
  const pinch = usePinchZoom(zoom, setZoom);

  // Mouse drag pan for desktop zoom
  const mouseDrag = useMouseDragPan(viewerScrollRef, isZoomed);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Navigation helpers
  const goToPrev = useCallback(() => {
    if (currentPage <= 1 || isZoomed) return; // Block nav when zoomed
    setCurrentPage(p => Math.max(1, p - 1));
    if (viewMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.pageFlip()?.flipPrev();
    }
  }, [currentPage, viewMode, isZoomed]);

  const goToNext = useCallback(() => {
    if (currentPage >= numPages || isZoomed) return; // Block nav when zoomed
    setCurrentPage(p => Math.min(numPages, p + 1));
    if (viewMode === 'flipbook' && flipbookRef.current) {
      flipbookRef.current.pageFlip()?.flipNext();
    }
  }, [currentPage, numPages, viewMode, isZoomed]);

  // Force-navigate (bypasses zoom lock — for arrow buttons when zoomed)
  const forceGoToPrev = useCallback(() => {
    if (currentPage <= 1) return;
    setCurrentPage(p => Math.max(1, p - 1));
  }, [currentPage]);

  const forceGoToNext = useCallback(() => {
    if (currentPage >= numPages) return;
    setCurrentPage(p => Math.min(numPages, p + 1));
  }, [currentPage, numPages]);

  // Fetch PDF and load as ArrayBuffer
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPdf() {
      try {
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

        const pdfUrl = data.url;
        if (!pdfUrl) throw new Error('No PDF URL returned');

        setFallbackPdfUrl(pdfUrl);

        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
          const proxyUrl = `/api/magazine/pdf-proxy?slug=${encodeURIComponent(edition.slug)}`;
          const proxyResponse = await fetch(proxyUrl);
          if (!proxyResponse.ok) throw new Error(`PDF download failed: ${pdfResponse.status}`);
          const buffer = await proxyResponse.arrayBuffer();
          if (cancelled) return;
          setLoadProgress(100);
          setPdfData(buffer);
          return;
        }

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
          const combined = new Uint8Array(received);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          setPdfData(combined.buffer);
        } else {
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

  // Load pdfjs from ArrayBuffer
  useEffect(() => {
    if (!pdfData) return;
    let cancelled = false;
    async function loadPdfJs() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData as ArrayBuffer) });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfLib(pdf);
        setNumPages(pdf.numPages);
        try {
          const firstPage = await pdf.getPage(1);
          const vp = firstPage.getViewport({ scale: 1 });
          if (vp.width > 0 && vp.height > 0) setPdfAspectRatio(vp.height / vp.width);
        } catch (_) { /* keep default */ }
      } catch (err: any) {
        if (cancelled) return;
        console.error('PDF viewer error:', err?.message || err);
        setInteractiveViewerFailed(true);
        setLoading(false);
      }
    }
    loadPdfJs();
    return () => { cancelled = true; };
  }, [pdfData]);

  // Load flipbook component dynamically
  useEffect(() => {
    if (viewMode === 'flipbook' && !flipbookFailed) {
      import('react-pageflip').then(mod => {
        setFlipBookComponent(() => mod.default);
      }).catch(() => {
        console.error('Failed to load react-pageflip — falling back to Reader');
        setFlipbookFailed(true);
        setViewMode('reader');
      });
    }
  }, [viewMode, flipbookFailed]);

  // Render a specific page to canvas then convert to image
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfLib || pageImages.has(pageNum) || renderingPages.has(pageNum)) return;
    setRenderingPages(prev => new Set(prev).add(pageNum));
    try {
      const page = await pdfLib.getPage(pageNum);
      const scale = 2.5; // Higher res for zoom quality
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
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
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Touch/swipe for reader mode — completely blocked when zoomed or pinching
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed || pinch.isPinching() || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isZoomed || pinch.isPinching()) { setTouchStart(null); return; }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0 && currentPage < numPages) setCurrentPage(p => p + 1);
      if (dx > 0 && currentPage > 1) setCurrentPage(p => p - 1);
    }
    setTouchStart(null);
  };

  // Keyboard navigation — blocked when zoomed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isZoomed) goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isZoomed) goToPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isZoomed) {
        setZoom(1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [numPages, toggleFullscreen, goToNext, goToPrev, isZoomed]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageNumbers = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);

  if (loading || (pdfData && !pdfLib && !error && !interactiveViewerFailed)) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="text-center max-w-xs mx-auto">
          <Loader2 className="w-12 h-12 animate-spin text-brand-purple mx-auto mb-4" />
          <p className="text-brand-purple font-heading font-bold text-lg mb-2">Loading magazine...</p>
          {loadProgress > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-brand-neon h-2.5 rounded-full transition-all duration-300" style={{ width: `${loadProgress}%` }} />
              </div>
              <p className="text-brand-gray-dark text-xs mt-2">{loadProgress}% downloaded</p>
            </div>
          )}
          <p className="text-brand-gray-dark text-xs mt-2">This may take a moment for large files</p>
        </div>
      </div>
    );
  }

  // ─── FALLBACK LEVEL 3: Clean iframe ───
  if ((error || interactiveViewerFailed) && fallbackPdfUrl && !iframeFallbackFailed) {
    const cleanPdfUrl = fallbackPdfUrl.includes('#') ? fallbackPdfUrl : `${fallbackPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`;
    return (
      <>
        <Header />
        <div className="bg-brand-gray min-h-screen">
          <div className="bg-brand-purple py-6 md:py-8">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  {edition.issueNumber && <span className="text-brand-neon text-xs font-bold uppercase tracking-widest">{edition.issueNumber}</span>}
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mt-1">{edition.seoH1 || edition.title}</h2>
                  <p className="text-white/60 text-sm mt-1">{new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={edition.title} description={edition.description ?? undefined} />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <iframe src={cleanPdfUrl} className="w-full border-0" style={{ height: '85vh', minHeight: '600px' }} title={`${edition.title} - Magazine Viewer`} allow="fullscreen" onError={() => setIframeFallbackFailed(true)} />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── FALLBACK LEVEL 4: Last resort error ───
  if (error || (interactiveViewerFailed && (!fallbackPdfUrl || iframeFallbackFailed))) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] bg-brand-gray flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <BookOpen size={32} className="text-brand-purple/50" />
            </div>
            <h2 className="font-heading font-bold text-xl text-brand-purple mb-3">We&apos;re having trouble loading the interactive reader.</h2>
            <p className="text-brand-gray-dark mb-6">Please refresh the page.</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors">
              <RotateCcw size={16} /> Reload reader
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Full-bleed immersive dark viewer */}
      <div className="bg-[#0f0f1a] min-h-screen flex flex-col">
        {/* Compact magazine title bar */}
        <div className="bg-[#16162a] border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 py-3">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {edition.issueNumber && <span className="text-brand-neon text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-neon/10 px-2 py-0.5 rounded-full flex-shrink-0">{edition.issueNumber}</span>}
                <h2 className="font-heading font-bold text-lg md:text-xl text-white truncate">{edition.seoH1 || edition.title}</h2>
                <span className="text-white/40 text-xs hidden md:inline flex-shrink-0">
                  {new Date(edition.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ShareButtons url={shareUrl} title={edition.seoH1 || edition.title} description={edition.description ?? undefined} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Toolbar — dark themed, integrated */}
        <div className="bg-[#1a1a30] border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
            {/* Left: view mode toggle */}
            <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => !flipbookFailed && setViewMode('flipbook')}
                disabled={flipbookFailed}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'flipbook'
                    ? 'bg-brand-neon text-[#0f0f1a] shadow-md shadow-brand-neon/20'
                    : flipbookFailed ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen size={14} />
              </button>
              <button
                onClick={() => setViewMode('reader')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'reader' ? 'bg-brand-neon text-[#0f0f1a] shadow-md shadow-brand-neon/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={14} /> <span className="hidden sm:inline">Reader</span>
              </button>
            </div>

            {/* Center: page navigation */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={isZoomed ? forceGoToPrev : goToPrev}
                disabled={currentPage <= 1}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-20 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} className="text-white/80" />
              </button>
              <span className="text-sm text-white/50 min-w-[80px] text-center hidden sm:inline font-medium">
                Page {currentPage} of {numPages}
              </span>
              <span className="text-sm text-white/50 min-w-[40px] text-center sm:hidden font-medium">
                {currentPage}/{numPages}
              </span>
              <button
                onClick={isZoomed ? forceGoToNext : goToNext}
                disabled={currentPage >= numPages}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-20 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight size={18} className="text-white/80" />
              </button>
            </div>

            {/* Right: zoom + utilities */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.2).toFixed(2)))} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Zoom out">
                <ZoomOut size={16} className="text-white/60" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className={`px-1.5 py-0.5 rounded transition-colors min-w-[42px] text-center ${
                  isZoomed ? 'bg-brand-neon/15 hover:bg-brand-neon/25' : 'hover:bg-white/10'
                }`}
                title="Reset zoom"
              >
                <span className={`text-xs font-bold ${isZoomed ? 'text-brand-neon' : 'text-white/50'}`}>
                  {Math.round(zoom * 100)}%
                </span>
              </button>
              <button onClick={() => setZoom(z => Math.min(4, +(z + 0.2).toFixed(2)))} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Zoom in">
                <ZoomIn size={16} className="text-white/60" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />
              <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/10 rounded" title="Fullscreen">
                {isFullscreen ? <Minimize2 size={16} className="text-white/60" /> : <Maximize2 size={16} className="text-white/60" />}
              </button>
            </div>
          </div>

          {/* Zoom mode indicator */}
          {isZoomed && (
            <div className="bg-brand-neon/5 border-t border-brand-neon/10 px-4 py-1 flex items-center justify-center gap-2">
              <Move size={12} className="text-brand-neon" />
              <span className="text-[11px] text-brand-neon/80 font-medium">
                {isMobile ? 'Drag to pan · Pinch to zoom · Tap arrows to navigate' : 'Click + drag to pan · Use arrows to navigate'}
              </span>
              <button onClick={() => setZoom(1)} className="ml-2 text-[11px] bg-brand-neon text-[#0f0f1a] px-2 py-0.5 rounded font-semibold hover:bg-brand-neon-dim transition-colors">
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Main Viewer — the magazine IS the page */}
        <div ref={containerRef} className={`relative flex-1 ${isFullscreen ? 'bg-[#0a0a16] flex flex-col' : ''}`}>
          {isFullscreen && (
            <div className="bg-[#0a0a16] px-4 py-2 flex items-center justify-between flex-shrink-0 border-b border-white/5">
              <span className="text-white/80 text-sm font-medium truncate mr-4">{edition.title}</span>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.2).toFixed(2)))} className="p-1 hover:bg-white/10 rounded"><ZoomOut size={14} className="text-white/70" /></button>
                <span className="text-white/60 text-xs font-bold min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(4, +(z + 0.2).toFixed(2)))} className="p-1 hover:bg-white/10 rounded"><ZoomIn size={14} className="text-white/70" /></button>
                <div className="w-px h-4 bg-white/20" />
                <button onClick={isZoomed ? forceGoToPrev : goToPrev} disabled={currentPage <= 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-30"><ChevronLeft size={16} className="text-white" /></button>
                <span className="text-white/60 text-sm">{currentPage} / {numPages}</span>
                <button onClick={isZoomed ? forceGoToNext : goToNext} disabled={currentPage >= numPages} className="p-1 hover:bg-white/10 rounded disabled:opacity-30"><ChevronRight size={16} className="text-white" /></button>
                <div className="w-px h-4 bg-white/20" />
                <button onClick={() => setZoom(1)} className="px-2 py-0.5 hover:bg-white/10 rounded text-xs text-white/70">Reset</button>
                <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/10 rounded"><Minimize2 size={16} className="text-white" /></button>
              </div>
            </div>
          )}

          <div className={`mx-auto px-0 py-2 md:py-4 ${isFullscreen ? 'flex-1 flex items-center justify-center' : 'flex items-center justify-center'}`}>
            {/* No extra wrapper box — magazine floats directly on the dark surface */}
            <div className={`overflow-hidden ${isFullscreen ? '' : ''}`}>
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
                  isZoomed={isZoomed}
                  pdfAspectRatio={pdfAspectRatio}
                  pinch={pinch}
                  mouseDrag={mouseDrag}
                  viewerScrollRef={viewerScrollRef}
                  forceGoToPrev={forceGoToPrev}
                  forceGoToNext={forceGoToNext}
                />
              ) : (
                <ReaderView
                  pageImages={pageImages}
                  numPages={numPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  zoom={zoom}
                  isZoomed={isZoomed}
                  handleTouchStart={handleTouchStart}
                  handleTouchEnd={handleTouchEnd}
                  isFullscreen={isFullscreen}
                  pinch={pinch}
                  mouseDrag={mouseDrag}
                  viewerScrollRef={viewerScrollRef}
                  forceGoToPrev={forceGoToPrev}
                  forceGoToNext={forceGoToNext}
                  pdfAspectRatio={pdfAspectRatio}
                />
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isFullscreen && (
          <div className="bg-[#16162a] border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <CTACard icon={<ShareButtons url={shareUrl} title={edition.seoH1 || edition.title} description={edition.description ?? undefined} />} customButton dark />
                <CTACard icon={<Newspaper size={20} />} label="Latest Articles" href="/news" dark />
                <CTACard icon={<Mail size={20} />} label="Subscribe" href="/#newsletter" dark />
                <CTACard icon={<Megaphone size={20} />} label="Advertise With Us" href="/contact" dark />
              </div>
            </div>
          </div>
        )}
      </div>
      {!isFullscreen && <Footer />}
    </>
  );
}

// ─── Flipbook View Component ─────────────────────────────────────────
function FlipbookView({
  FlipBookComponent, pageImages, numPages, currentPage, setCurrentPage,
  flipbookRef, pageNumbers, isFullscreen, isMobile, zoom, isZoomed,
  pdfAspectRatio, pinch, mouseDrag, viewerScrollRef, forceGoToPrev, forceGoToNext,
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
  isZoomed: boolean;
  pdfAspectRatio: number;
  pinch: ReturnType<typeof usePinchZoom>;
  mouseDrag: ReturnType<typeof useMouseDragPan>;
  viewerScrollRef: React.RefObject<HTMLDivElement>;
  forceGoToPrev: () => void;
  forceGoToNext: () => void;
}) {
  if (!FlipBookComponent || numPages === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple/40" />
      </div>
    );
  }

  // Calculate page dimensions that FIT the visible viewport (no vertical scrolling)
  const vpW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vpH = typeof window !== 'undefined' ? window.innerHeight : 800;
  // Reserve: title bar (~44px), toolbar (~40px), padding (~28px), nav arrows margin (~20px)
  // In new dark layout these are much more compact
  const reservedH = isFullscreen ? 60 : 150;
  const availH = Math.max(300, vpH - reservedH);

  let width: number;
  let height: number;
  if (isMobile) {
    const maxW = Math.min(vpW - 32, 420);
    const hFromW = Math.round(maxW * pdfAspectRatio);
    if (hFromW > availH) {
      // Height-constrained: shrink to fit viewport
      height = availH;
      width = Math.round(height / pdfAspectRatio);
    } else {
      width = maxW;
      height = hFromW;
    }
  } else {
    // Desktop: two-page spread, each page is half the available width
    const maxPageW = Math.min(Math.round((vpW - 80) / 2), 680);
    const hFromW = Math.round(maxPageW * pdfAspectRatio);
    if (hFromW > availH) {
      // Height-constrained: shrink to fit
      height = availH;
      width = Math.round(height / pdfAspectRatio);
    } else {
      width = maxPageW;
      height = hFromW;
    }
  }

  // When zoomed: show current page as pannable image (bypasses react-pageflip completely)
  if (isZoomed) {
    const imgSrc = pageImages.get(currentPage);
    const imgW = Math.round(width * zoom);
    const scrollH = isFullscreen ? vpH - 100 : Math.max(400, vpH - 200);

    return (
      <div className="relative">
        <div
          ref={viewerScrollRef}
          style={{
            maxHeight: scrollH,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
            cursor: mouseDrag.isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={mouseDrag.onMouseDown}
          onTouchStart={pinch.onTouchStart}
          onTouchMove={pinch.onTouchMove}
          onTouchEnd={pinch.onTouchEnd}
        >
          <div className="flex justify-center p-1">
            <div className="shadow-2xl bg-white flex-shrink-0 rounded-sm overflow-hidden">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={`Page ${currentPage}`}
                  className="block select-none"
                  style={{ width: imgW, height: 'auto', maxWidth: 'none' }}
                  draggable={false}
                />
              ) : (
                <div style={{ width: imgW, height: Math.round(imgW * pdfAspectRatio) }} className="flex items-center justify-center bg-gray-50">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-purple/30" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <NavArrows
          currentPage={currentPage}
          numPages={numPages}
          goToPrev={forceGoToPrev}
          goToNext={forceGoToNext}
          isFullscreen={isFullscreen}
        />
      </div>
    );
  }

  // Normal zoom (≤ 1): premium flipbook
  const zoomedW = Math.round(width * zoom);
  const zoomedH = Math.round(height * zoom);

  return (
    <div className="relative">
      <div
        ref={viewerScrollRef}
        className="flex justify-center items-center"
        style={{
          perspective: '2000px',
          maxHeight: isFullscreen ? vpH - 100 : availH + 16,
          overflow: 'hidden',
        }}
        onTouchStart={pinch.onTouchStart}
        onTouchMove={pinch.onTouchMove}
        onTouchEnd={pinch.onTouchEnd}
      >
        <FlipBookComponent
          ref={flipbookRef}
          width={zoomedW}
          height={zoomedH}
          size="fixed"
          showCover={true}
          mobileScrollSupport={false}
          onFlip={(e: any) => {
            if (!pinch.isPinching()) {
              setCurrentPage((e?.data ?? 0) + 1);
            }
          }}
          className="shadow-[0_8px_60px_rgba(0,0,0,0.6)]"
          useMouseEvents={true}
          swipeDistance={40}
          showPageCorners={true}
          flippingTime={600}
          disableFlipByClick={false}
          maxShadowOpacity={0.5}
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

      {/* Navigation arrows */}
      <NavArrows
        currentPage={currentPage}
        numPages={numPages}
        goToPrev={forceGoToPrev}
        goToNext={forceGoToNext}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}

// ─── Reader View Component ───────────────────────────────────────────
function ReaderView({
  pageImages, numPages, currentPage, setCurrentPage, zoom, isZoomed,
  handleTouchStart, handleTouchEnd, isFullscreen, pinch, mouseDrag,
  viewerScrollRef, forceGoToPrev, forceGoToNext, pdfAspectRatio,
}: {
  pageImages: Map<number, string>;
  numPages: number;
  currentPage: number;
  setCurrentPage: (p: number | ((p: number) => number)) => void;
  zoom: number;
  isZoomed: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  isFullscreen: boolean;
  pinch: ReturnType<typeof usePinchZoom>;
  mouseDrag: ReturnType<typeof useMouseDragPan>;
  viewerScrollRef: React.RefObject<HTMLDivElement>;
  forceGoToPrev: () => void;
  forceGoToNext: () => void;
  pdfAspectRatio: number;
}) {
  const imgSrc = pageImages.get(currentPage);
  const rvpW = typeof window !== 'undefined' ? window.innerWidth : 600;
  const rvpH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const rReservedH = isFullscreen ? 60 : 150;
  const rAvailH = Math.max(300, rvpH - rReservedH);
  // Fit page within viewport: check both width and height
  const rMaxW = Math.min(rvpW - 40, 700);
  const rHFromW = Math.round(rMaxW * pdfAspectRatio);
  const baseW = rHFromW > rAvailH ? Math.round(rAvailH / pdfAspectRatio) : rMaxW;
  const imgW = Math.round(baseW * zoom);

  const needsScrollWrapper = isZoomed || isFullscreen;
  const scrollH = isFullscreen ? rvpH - 100 : Math.max(400, rvpH - 200);

  return (
    <div className="relative">
      <div
        ref={viewerScrollRef}
        style={needsScrollWrapper ? {
          maxHeight: scrollH,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: isZoomed ? 'pan-x pan-y' : 'auto',
          cursor: isZoomed ? (mouseDrag.isDragging ? 'grabbing' : 'grab') : 'auto',
        } : undefined}
        onMouseDown={isZoomed ? mouseDrag.onMouseDown : undefined}
        onTouchStart={(e) => { pinch.onTouchStart(e); if (!isZoomed) handleTouchStart(e); }}
        onTouchMove={pinch.onTouchMove}
        onTouchEnd={(e) => { pinch.onTouchEnd(e); if (!isZoomed) handleTouchEnd(e); }}
      >
        <div className={`flex items-start ${isZoomed ? 'justify-start' : 'justify-center'} p-2`}>
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white flex-shrink-0">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={`Page ${currentPage}`}
                className="block select-none"
                style={{ width: imgW, height: 'auto', maxWidth: 'none' }}
                draggable={false}
              />
            ) : (
              <div style={{ width: Math.min(baseW, 500), height: Math.round(Math.min(baseW, 500) * pdfAspectRatio) }} className="flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple/30" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <NavArrows
        currentPage={currentPage}
        numPages={numPages}
        goToPrev={forceGoToPrev}
        goToNext={forceGoToNext}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}

// ─── Reusable navigation arrows ──────────────────────────────────────
function NavArrows({ currentPage, numPages, goToPrev, goToNext }: {
  currentPage: number;
  numPages: number;
  goToPrev: () => void;
  goToNext: () => void;
  isFullscreen?: boolean;
}) {
  const btnClass = (disabled: boolean) =>
    `absolute top-1/2 -translate-y-1/2 z-40 p-2.5 md:p-3 rounded-full transition-all ${
      disabled ? 'opacity-15 pointer-events-none' : ''
    } bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20`;

  return (
    <>
      <button onClick={goToPrev} disabled={currentPage <= 1} className={`${btnClass(currentPage <= 1)} left-1 md:left-3`} aria-label="Previous page">
        <ChevronLeft size={22} />
      </button>
      <button onClick={goToNext} disabled={currentPage >= numPages} className={`${btnClass(currentPage >= numPages)} right-1 md:right-3`} aria-label="Next page">
        <ChevronRight size={22} />
      </button>
    </>
  );
}

// ─── CTA Card Component ──────────────────────────────────────────────
function CTACard({ icon, label, href, customButton, dark }: { icon: React.ReactNode; label?: string; href?: string; customButton?: boolean; dark?: boolean }) {
  const bg = dark ? 'bg-white/5 hover:bg-white/10 border border-white/5' : 'bg-brand-gray hover:bg-brand-purple hover:text-white';
  const textColor = dark ? 'text-white/70 group-hover:text-white' : 'text-brand-purple group-hover:text-white';
  const iconColor = dark ? 'text-brand-neon' : 'text-brand-purple group-hover:text-brand-neon';
  if (customButton) {
    return (
      <div className={`flex items-center justify-center p-3 rounded-lg ${bg}`}>
        {icon}
      </div>
    );
  }
  return (
    <Link
      href={href ?? '#'}
      className={`flex items-center gap-3 p-3 rounded-lg group transition-all ${bg}`}
    >
      <span className={`transition-colors ${iconColor}`}>{icon}</span>
      <span className={`font-medium text-sm transition-colors ${textColor}`}>{label}</span>
    </Link>
  );
}
