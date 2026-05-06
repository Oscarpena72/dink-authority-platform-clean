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
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [FlipBookComponent, setFlipBookComponent] = useState<any>(null);
  // Store the raw PDF URL for iframe fallback if interactive viewer fails
  const [fallbackPdfUrl, setFallbackPdfUrl] = useState<string | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

  // Touch/swipe handling for reader mode
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
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
                    <h1 className="font-heading font-bold text-2xl md:text-3xl text-white mt-1">{edition.seoH1 || edition.title}</h1>
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
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-white mt-1">{edition.seoH1 || edition.title}</h1>
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

        {/* View Mode Toggle + Controls */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('flipbook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'flipbook'
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-purple'
                }`}
              >
                <BookOpen size={14} /> <span className="hidden sm:inline">Flipbook</span>
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

            <div className="flex items-center gap-2">
              {/* Page indicator */}
              <span className="text-sm text-brand-gray-dark hidden sm:block">
                Page {currentPage} of {numPages}
              </span>
              <span className="text-sm text-brand-gray-dark sm:hidden">
                {currentPage}/{numPages}
              </span>

              {/* Zoom controls — visible in both modes */}
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Zoom out">
                  <ZoomOut size={16} className="text-gray-600" />
                </button>
                <button onClick={() => setZoom(1)} className="px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors min-w-[40px] text-center" title="Reset zoom">
                  <span className="text-xs font-medium text-gray-500">{Math.round(zoom * 100)}%</span>
                </button>
                <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Zoom in">
                  <ZoomIn size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Open PDF in new tab */}
              {fallbackPdfUrl && (
                <a href={fallbackPdfUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 rounded ml-1 hidden sm:block" title="Open PDF Full Screen">
                  <ExternalLink size={16} className="text-gray-600" />
                </a>
              )}

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="p-1.5 hover:bg-gray-100 rounded ml-1" title="Fullscreen">
                {isFullscreen ? <Minimize2 size={16} className="text-gray-600" /> : <Maximize2 size={16} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Viewer */}
        <div ref={containerRef} className={`${isFullscreen ? 'bg-gray-900 flex flex-col' : ''}`}>
          {isFullscreen && (
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
              <span className="text-white/80 text-sm font-medium">{edition.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Page {currentPage} / {numPages}</span>
                <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/10 rounded">
                  <Minimize2 size={16} className="text-white" />
                </button>
              </div>
            </div>
          )}

          <div className={`max-w-[1400px] mx-auto px-4 py-6 ${isFullscreen ? 'flex-1 flex items-center justify-center' : ''}`}>
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
              />
            )}
          </div>

          {/* Navigation bar */}
          <div className={`${isFullscreen ? 'bg-gray-800' : 'bg-white border-t border-gray-200'} px-4 py-3 flex-shrink-0`}>
            <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  if (viewMode === 'flipbook' && flipbookRef.current) {
                    flipbookRef.current.pageFlip()?.flipPrev();
                  }
                }}
                disabled={currentPage <= 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isFullscreen
                    ? 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
                    : 'bg-brand-purple text-white hover:bg-brand-purple-light disabled:opacity-30'
                }`}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {/* Page jump */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={currentPage}
                  onChange={e => {
                    const p = parseInt(e.target.value);
                    if (p >= 1 && p <= numPages) {
                      setCurrentPage(p);
                      if (viewMode === 'flipbook' && flipbookRef.current) {
                        flipbookRef.current.pageFlip()?.flip(p - 1);
                      }
                    }
                  }}
                  className={`w-14 text-center text-sm py-1 rounded border ${
                    isFullscreen ? 'bg-white/10 border-white/20 text-white' : 'border-gray-200'
                  }`}
                />
                <span className={`text-sm ${isFullscreen ? 'text-white/60' : 'text-gray-500'}`}>/ {numPages}</span>
              </div>

              <button
                onClick={() => {
                  const newPage = Math.min(numPages, currentPage + 1);
                  setCurrentPage(newPage);
                  if (viewMode === 'flipbook' && flipbookRef.current) {
                    flipbookRef.current.pageFlip()?.flipNext();
                  }
                }}
                disabled={currentPage >= numPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isFullscreen
                    ? 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
                    : 'bg-brand-purple text-white hover:bg-brand-purple-light disabled:opacity-30'
                }`}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
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

        {/* SEO Content Section — below viewer, clean editorial design */}
        {!isFullscreen && edition.seoContent && (
          <section className="bg-brand-gray border-t border-gray-200">
            <div className="max-w-[900px] mx-auto px-4 py-10 md:py-14">
              <div
                className="prose prose-sm md:prose-base prose-gray max-w-none text-brand-gray-dark/80 leading-relaxed [&>p]:mb-4 [&>p:first-child]:text-base [&>p:first-child]:font-medium [&>p:first-child]:text-brand-gray-dark"
                dangerouslySetInnerHTML={{ __html: edition.seoContent }}
              />
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-4">
                <Link href="/magazine" className="text-brand-purple font-medium text-sm hover:text-brand-purple-light transition-colors">
                  ← Browse all editions of our <span className="underline">pickleball magazine</span>
                </Link>
                <span className="text-gray-300 hidden md:inline">|</span>
                <Link href="/magazine" className="text-brand-purple/70 text-sm hover:text-brand-purple transition-colors">
                  Dink Authority — a <span className="underline">leading pickleball magazine</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
      {!isFullscreen && <Footer />}
    </>
  );
}

// Flipbook View Component
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
}) {
  if (!FlipBookComponent || numPages === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple/40" />
      </div>
    );
  }

  const width = isMobile ? Math.min(window.innerWidth - 32, 400) : 500;
  const height = Math.round(width * 1.414); // A4 ratio

  return (
    <div className="flex items-center justify-center overflow-auto" style={{ minHeight: isFullscreen ? 'calc(100vh - 200px)' : '600px' }}>
      <div className="transition-transform duration-200" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
      <FlipBookComponent
        ref={flipbookRef}
        width={width}
        height={height}
        size="stretch"
        minWidth={300}
        maxWidth={600}
        minHeight={400}
        maxHeight={900}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={(e: any) => setCurrentPage((e?.data ?? 0) + 1)}
        className="shadow-2xl"
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        flippingTime={600}
      >
        {pageNumbers.map(pageNum => {
          const imgSrc = pageImages.get(pageNum);
          return (
            <div key={pageNum} className="bg-white">
              {imgSrc ? (
                <img src={imgSrc} alt={`Page ${pageNum}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
  );
}

// Reader View Component
function ReaderView({
  pageImages,
  numPages,
  currentPage,
  setCurrentPage,
  zoom,
  handleTouchStart,
  handleTouchEnd,
  isFullscreen,
}: {
  pageImages: Map<number, string>;
  numPages: number;
  currentPage: number;
  setCurrentPage: (p: number | ((p: number) => number)) => void;
  zoom: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  isFullscreen: boolean;
}) {
  const imgSrc = pageImages.get(currentPage);

  return (
    <div
      className="flex items-center justify-center overflow-auto"
      style={{ minHeight: isFullscreen ? 'calc(100vh - 200px)' : '600px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="transition-transform duration-200 shadow-2xl rounded-lg overflow-hidden bg-white"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', maxWidth: '100%' }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={`Page ${currentPage}`} className="max-w-full h-auto" style={{ maxHeight: isFullscreen ? '80vh' : '75vh' }} />
        ) : (
          <div className="w-[400px] h-[566px] flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-brand-purple/30" />
          </div>
        )}
      </div>
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
