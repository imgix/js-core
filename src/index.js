import { Base64 } from 'js-base64';
import md5 from 'md5';
import { getQuery } from 'ufo';
import {
  DEFAULT_DPR,
  DEFAULT_OPTIONS,
  DOMAIN_REGEX,
  DPR_QUALITIES,
  VERSION,
} from './constants.js';
import { extractUrl } from './helpers';
import {
  validateAndDestructureOptions,
  validateDevicePixelRatios,
  validateRange,
  validateVariableQualities,
  validateVariableQuality,
  validateWidths,
  validateWidthTolerance,
} from './validators.js';

export default class ImgixClient {
  constructor(opts = {}) {
    this.settings = { ...DEFAULT_OPTIONS, ...opts };
    // a cache to store memoized srcset width-pairs
    this.targetWidthsCache = {};
    if (typeof this.settings.domain != 'string') {
      throw new Error('ImgixClient must be passed a valid string domain');
    }

    if (DOMAIN_REGEX.exec(this.settings.domain) == null) {
      throw new Error(
        'Domain must be passed in as fully-qualified ' +
          'domain name and should not include a protocol or any path ' +
          'element, i.e. "example.imgix.net".',
      );
    }

    if (this.settings.includeLibraryParam) {
      this.settings.libraryParam = 'js-' + ImgixClient.version();
    }

    this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://';
  }

  static version() {
    return VERSION;
  }

  buildURL(rawPath = '', params = {}, options = {}) {
    const path = this._sanitizePath(rawPath, {
      encode: !options.disablePathEncoding,
    });

    let finalParams = this._buildParams(params);
    if (!!this.settings.secureURLToken) {
      finalParams = this._signParams(path, finalParams);
    }
    return this.settings.urlPrefix + this.settings.domain + path + finalParams;
  }

  /**
   *`_buildURL` static method allows full URLs to be formatted for use with
   * imgix.
   *
   * - If the source URL has included parameters, they are merged with
   * the `params` passed in as an argument.
   * - URL must match `{host}/{pathname}?{query}` otherwise an error is thrown.
   *
   * @param {String} url - full source URL path string, required
   * @param {Object} params - imgix params object, optional
   * @param {Object} options - imgix client options, optional
   *
   * @returns URL string formatted to imgix specifications.
   *
   * @example
   * const client = ImgixClient
   * const params = { w: 100 }
   * const opts = { useHttps: true }
   * const src = "sdk-test.imgix.net/amsterdam.jpg?h=100"
   * const url = client._buildURL(src, params, opts)
   * console.log(url)
   * // => "https://sdk-test.imgix.net/amsterdam.jpg?h=100&w=100"
   */
  static _buildURL(url, params = {}, options = {}) {
    if (url == null) {
      return '';
    }

    const { host, pathname, search } = extractUrl({
      url,
      useHTTPS: options.useHTTPS,
    });
    // merge source URL parameters with options parameters
    const combinedParams = { ...getQuery(search), ...params };

    // throw error if no host or no pathname present
    if (!host.length || !pathname.length) {
      throw new Error('_buildURL: URL must match {host}/{pathname}?{query}');
    }

    const client = new ImgixClient({ domain: host, ...options });

    return client.buildURL(pathname, combinedParams);
  }

  _buildParams(params = {}) {
    const queryParams = [
      // Set the libraryParam if applicable.
      ...(this.settings.libraryParam
        ? [`ixlib=${this.settings.libraryParam}`]
        : []),

      // Map over the key-value pairs in params while applying applicable encoding.
      ...Object.entries(params).reduce((prev, [key, value]) => {
        if (value == null) {
          return prev;
        }
        const encodedKey = encodeURIComponent(key);
        const encodedValue =
          key.substr(-2) === '64'
            ? Base64.encodeURI(value)
            : encodeURIComponent(value);
        prev.push(`${encodedKey}=${encodedValue}`);
        return prev;
      }, []),
    ];

    return `${queryParams.length > 0 ? '?' : ''}${queryParams.join('&')}`;
  }

  _signParams(path, queryParams) {
    const signatureBase = this.settings.secureURLToken + path + queryParams;
    const signature = md5(signatureBase);

    return queryParams.length > 0
      ? queryParams + '&s=' + signature
      : '?s=' + signature;
  }

  /**
   * "Sanitize" the path of the image URL.
   * Ensures that the path has a leading slash, and that the path is correctly
   * encoded. If it's a proxy path (begins with http/https), then encode the
   * whole path as a URI component, otherwise only encode specific characters.
   * @param {string} path The URL path of the image
   * @param {Object} options Sanitization options
   * @param {boolean} options.encode Whether to encode the path, default true
   * @returns {string} The sanitized path
   */
  _sanitizePath(path, options = {}) {
    // Strip leading slash first (we'll re-add after encoding)
    let _path = path.replace(/^\//, '');

    if (!(options.encode === false)) {
      if (/^https?:\/\//.test(_path)) {
        // Use de/encodeURIComponent to ensure *all* characters are handled,
        // since it's being used as a path
        _path = encodeURIComponent(_path);
      } else {
        // Use de/encodeURI if we think the path is just a path,
        // so it leaves legal characters like '/' and '@' alone
        _path = encodeURI(_path).replace(/[#?:+]/g, encodeURIComponent);
      }
    }

    return '/' + _path;
  }

  buildSrcSet(path, params = {}, options = {}) {
    const { w, h } = params;

    if (w || h) {
      return this._buildDPRSrcSet(path, params, options);
    } else {
      return this._buildSrcSetPairs(path, params, options);
    }
  }

  /**
   * _buildSrcSet static method allows full URLs to be used when generating
   * imgix formatted `srcset` string values.
   *
   * - If the source URL has included parameters, they are merged with
   * the `params` passed in as an argument.
   * - URL must match `{host}/{pathname}?{query}` otherwise an error is thrown.
   *
   * @param {String} url - full source URL path string, required
   * @param {Object} params - imgix params object, optional
   * @param {Object} srcsetModifiers - srcset modifiers, optional
   * @param {Object} clientOptions - imgix client options, optional
   * @returns imgix `srcset` for full URLs.
   */
  static _buildSrcSet(
    url,
    params = {},
    srcsetModifiers = {},
    clientOptions = {},
  ) {
    if (url == null) {
      return '';
    }

    const { host, pathname, search } = extractUrl({
      url,
      useHTTPS: clientOptions.useHTTPS,
    });
    // merge source URL parameters with options parameters
    const combinedParams = { ...getQuery(search), ...params };

    // throw error if no host or no pathname present
    if (!host.length || !pathname.length) {
      throw new Error(
        '_buildOneStepURL: URL must match {host}/{pathname}?{query}',
      );
    }

    const client = new ImgixClient({ domain: host, ...clientOptions });
    return client.buildSrcSet(pathname, combinedParams, srcsetModifiers);
  }

  // returns an array of width values used during srcset generation
  static targetWidths(
    minWidth = 100,
    maxWidth = 8192,
    widthTolerance = 0.08,
    cache = {},
  ) {
    const minW = Math.floor(minWidth);
    const maxW = Math.floor(maxWidth);
    validateRange(minWidth, maxWidth);
    validateWidthTolerance(widthTolerance);
    const cacheKey = widthTolerance + '/' + minW + '/' + maxW;

    // First, check the cache.
    if (cacheKey in cache) {
      return cache[cacheKey];
    }

    if (minW === maxW) {
      return [minW];
    }

    const resolutions = [];
    let currentWidth = minW;
    while (currentWidth < maxW) {
      // While the currentWidth is less than the maxW, push the rounded
      // width onto the list of resolutions.
      resolutions.push(Math.round(currentWidth));
      currentWidth *= 1 + widthTolerance * 2;
    }

    // At this point, the last width in resolutions is less than the
    // currentWidth that caused the loop to terminate. This terminating
    // currentWidth is greater than or equal to the maxW. We want to
    // to stop at maxW, so we make sure our maxW is larger than the last
    // width in resolutions before pushing it (if it's equal we're done).
    if (resolutions[resolutions.length - 1] < maxW) {
      resolutions.push(maxW);
    }

    cache[cacheKey] = resolutions;

    return resolutions;
  }

  _buildSrcSetPairs(path, params = {}, options = {}) {
    const [widthTolerance, minWidth, maxWidth] =
      validateAndDestructureOptions(options);

    let targetWidthValues;
    if (options.widths) {
      validateWidths(options.widths);
      targetWidthValues = [...options.widths];
    } else {
      targetWidthValues = ImgixClient.targetWidths(
        minWidth,
        maxWidth,
        widthTolerance,
        this.targetWidthsCache,
      );
    }

    const srcset = targetWidthValues.map(
      (w) =>
        `${this.buildURL(
          path,
          { ...params, w },
          { disablePathEncoding: options.disablePathEncoding },
        )} ${w}w`,
    );

    return srcset.join(',\n');
  }

  _buildDPRSrcSet(path, params = {}, options = {}) {
    if (options.devicePixelRatios) {
      validateDevicePixelRatios(options.devicePixelRatios);
    }

    const targetRatios = options.devicePixelRatios || DEFAULT_DPR;

    const disableVariableQuality = options.disableVariableQuality || false;

    if (!disableVariableQuality) {
      validateVariableQuality(disableVariableQuality);
    }

    if (options.variableQualities) {
      validateVariableQualities(options.variableQualities);
    }

    const qualities = { ...DPR_QUALITIES, ...options.variableQualities };

    const withQuality = (path, params, dpr) => {
      return `${this.buildURL(
        path,
        {
          ...params,
          dpr: dpr,
          q: params.q || qualities[dpr] || qualities[Math.floor(dpr)],
        },
        { disablePathEncoding: options.disablePathEncoding },
      )} ${dpr}x`;
    };

    const srcset = disableVariableQuality
      ? targetRatios.map(
          (dpr) =>
            `${this.buildURL(
              path,
              { ...params, dpr },
              { disablePathEncoding: options.disablePathEncoding },
            )} ${dpr}x`,
        )
      : targetRatios.map((dpr) => withQuality(path, params, dpr));

    return srcset.join(',\n');
  }
}
