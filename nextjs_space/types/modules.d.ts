declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(params: any): { promise: Promise<any> };
}

declare module 'react-pageflip' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';
  interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    onFlip?: (e: any) => void;
    className?: string;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    flippingTime?: number;
    disableFlipByClick?: boolean;
    children?: React.ReactNode;
  }
  const HTMLFlipBook: ForwardRefExoticComponent<HTMLFlipBookProps & RefAttributes<any>>;
  export default HTMLFlipBook;
}

declare module 'embla-carousel-autoplay' {
  const Autoplay: (options?: any) => any;
  export default Autoplay;
}

declare module '@vercel/blob' {
  export function put(pathname: string, body: any, options: any): Promise<any>;
}

declare module '@vercel/blob/client' {
  export function handleUpload(options: any): Promise<any>;
  export function upload(pathname: string, body: any, options: any): Promise<any>;
  export type HandleUploadBody = any;
}

declare module 'sharp' {
  namespace sharp {
    interface Sharp {
      resize(...args: any[]): Sharp;
      jpeg(options?: any): Sharp;
      png(options?: any): Sharp;
      toBuffer(): Promise<Buffer>;
      composite(images: any[]): Sharp;
      metadata(): Promise<any>;
      [key: string]: any;
    }
    type OverlayOptions = any;
  }
  function sharp(input?: any, options?: any): sharp.Sharp;
  export = sharp;
}
