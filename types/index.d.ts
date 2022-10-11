export type ImgixClientOptions = {
  domain: string;
  secureURLToken?: string | undefined;
  useHTTPS?: boolean;
  includeLibraryParam?: boolean;
  libraryParm?: string;
};

interface _buildURLOptions extends Omit<ImgixClientOptions, 'domain'> {
  domain?: string;
  disablePathEncoding?: boolean;
}

declare class ImgixClient {
  readonly domain: string;
  readonly useHTTPS: boolean;
  includeLibraryParam: boolean;
  readonly secureURLToken: string;
  libraryParam: string;

  constructor(opts: ImgixClientOptions);

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
  static _buildURL(
    path: string,
    params?: {},
    options?: _buildURLOptions,
  ): string;
  static _buildSrcSet(
    path: string,
    params?: {},
    srcSetOptions?: SrcSetOptions,
    clientOptions?: ImgixClientOptions,
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
