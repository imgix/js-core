// Type definitions for imgix-core-js.js

declare class ImgixClient {
    domain: string;
    useHTTPS: boolean;
    includeLibraryParam: boolean;
    secureURLToken: string;

    constructor(opts: {domain: string; secureURLToken?: string; useHTTPS?: boolean; includeLibraryParam?: boolean;});


    buildURL(path: string, params?: {}): string;
    _sanitizePath(path: string): string;
    _buildParams(params: {}): string;
    _signParams(path: string, queryParams?: {}): string;
    buildSrcSet(path: string, params?: {}, options?: {}): string;
    _buildSrcSetPairs(path: string, params?: {}, options?: {}): string;
    _buildDPRSrcSet(path: string, params?: {}, options?: {}): string;
}
export = ImgixClient;
