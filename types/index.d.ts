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

  buildURL(
    path: string,
    params?: {},
    options?: { disablePathEncoding?: boolean },
  ): string;
  _sanitizePath(path: string, options?: { encode?: boolean }): string;
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
  static _buildURL(path: string, params?: {}, options?: {}): string;
  static _buildSrcSet(
    path: string,
    params?: {},
    srcSetOptions?: {},
    clientOptions?: {},
  ): string;
}

export type DevicePixelRatio = 1 | 2 | 3 | 4 | 5 | number;

export type VariableQualities = { [key in DevicePixelRatio]?: number };

export interface SrcSetOptions {
  widths?: number[];
  widthTolerance?: number;
  minWidth?: number;
  maxWidth?: number;
  disableVariableQuality?: boolean;
  devicePixelRatios?: DevicePixelRatio[];
  variableQualities?: VariableQualities;
  disablePathEncoding?: boolean;
}

export default ImgixClient;
