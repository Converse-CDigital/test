import type { ReactNode } from 'react';

export interface ILibProps {
  bundleIdentifier: string;
  licenseKey: string;
  handleReady(statusCode: number): void;
  errorView?(error: string): ReactNode;
  documentScannerView?(handleDocumentScan: (documentType: number) => void): JSX.Element | undefined;
}

export interface IDocumentScannerProps {
  documentScannerView?(handleDocumentScan?: (documentType: number) => void): Element | undefined;
}

interface IPoint<T = number> {
  x: T;
  y: T;
}

interface ISize<T = number> {
  width: T;
  height: T;
}

export interface IFace {
  bounds: { origin: IPoint; size: ISize };
}

export enum DocumentType {
  passport,
  idCardFrontSide,
  idCardBackSide,
  fromGallery,
}
