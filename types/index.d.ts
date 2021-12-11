declare class ImgixClient {
  domain: string;
  useHTTPS: boolean;
  includeLibraryParam: boolean;
  secureURLToken: string;

  constructor(opts: {
    domain: string;
    secureURLToken?: string;
    useHTTPS?: boolean;
    includeLibraryParam?: boolean;
  });

  buildURL(path: string, params?: {}): string;
  _sanitizePath(path: string): string;
  _buildParams(params: {}): string;
  _signParams(path: string, queryParams?: {}): string;
  buildSrcSet(path: string, params?: {}, options?: SrcSetOptions): string;
  _buildSrcSetPairs(path: string, params?: {}, options?: SrcSetOptions): string;
  _buildDPRSrcSet(path: string, params?: {}, options?: SrcSetOptions): string;
  static targetWidths(
    minWidth?: number,
    maxWidth?: number,
    widthTolerance?: number,
    cache?: {},
  ): number[];
}

export type TargetDPRRatio = 1 | 2 | 3 | 4 | 5;

// Non-empty array of TargetDPRRatio
export type TargetDPRRatios = [TargetDPRRatio, ...TargetDPRRatio[]];

export type TargetDPRRatiosQualities = { [key in TargetDPRRatio]?: number };

export interface SrcSetOptions {
  widths?: number[];
  widthTolerance?: number;
  minWidth?: number;
  maxWidth?: number;
  disableVariableQuality?: boolean;
  targetDPRRatios?: TargetDPRRatios;
  targetDPRRatiosQualities?: TargetDPRRatiosQualities;
}

export default ImgixClient;
