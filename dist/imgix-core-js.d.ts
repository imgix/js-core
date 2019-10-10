// Type definitions for imgix-core-js.js

// export as namespace ImgixClient;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */

/*~ Write your module's methods and properties in this class */
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
    buildSrcSet(path: string, params?: {}): string;
    _buildSrcSetPairs(path: string, params?: {}): string;
    _buildDPRSrcSet(path: string, params?: {}): string;
}
export = ImgixClient;
