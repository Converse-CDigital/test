import type { ReactNode } from 'react';

export interface LibProps {
  bundleIdentifier: string;
  licenseKey: string;
  handleReady(statusCode: number): void;
  errorView(error: string): ReactNode;
}

interface Point<T = number> {
  x: T;
  y: T;
}

interface Size<T = number> {
  width: T;
  height: T;
}

export interface Face {
  bounds: { origin: Point; size: Size };
}
