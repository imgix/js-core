import md5 from 'md5';
import { Base64 } from 'js-base64';

import {
  VERSION,
  DOMAIN_REGEX,
  DEFAULT_OPTIONS,
  DPR_QUALITIES,
  DEFAULT_DPR,
} from './constants.js';

import {
  validateRange,
  validateWidths,
  validateAndDestructureOptions,
  validateVariableQuality,
  validateWidthTolerance,
  validateDevicePixelRatios,
  validateVariableQualities,
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

  buildURL(path = '', params = {}) {
    const sanitizedPath = this._sanitizePath(path);

    let finalParams = this._buildParams(params);
    if (!!this.settings.secureURLToken) {
      finalParams = this._signParams(sanitizedPath, finalParams);
    }
    return (
      this.settings.urlPrefix +
      this.settings.domain +
      sanitizedPath +
      finalParams
    );
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

  _sanitizePath(path) {
    // Strip leading slash first (we'll re-add after encoding)
    let _path = path.replace(/^\//, '');

    if (/^https?:\/\//.test(_path)) {
      // Use de/encodeURIComponent to ensure *all* characters are handled,
      // since it's being used as a path
      _path = encodeURIComponent(_path);
    } else {
      // Use de/encodeURI if we think the path is just a path,
      // so it leaves legal characters like '/' and '@' alone
      _path = encodeURI(_path).replace(/[#?:+]/g, encodeURIComponent);
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

  _buildSrcSetPairs(path, params, options) {
    const [widthTolerance, minWidth, maxWidth] = validateAndDestructureOptions(
      options,
    );

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
      (w) => `${this.buildURL(path, { ...params, w })} ${w}w`,
    );

    return srcset.join(',\n');
  }

  _buildDPRSrcSet(path, params, options) {
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
      return `${this.buildURL(path, {
        ...params,
        dpr: dpr,
        q: params.q || qualities[dpr] || qualities[Math.floor(dpr)],
      })} ${dpr}x`;
    };

    const srcset = disableVariableQuality
      ? targetRatios.map(
          (dpr) => `${this.buildURL(path, { ...params, dpr })} ${dpr}x`,
        )
      : targetRatios.map((dpr) => withQuality(path, params, dpr));

    return srcset.join(',\n');
  }
}
