import md5 from 'md5';
import { Base64 } from 'js-base64';

import {
  VERSION,
  DOMAIN_REGEX,
  DEFAULT_OPTIONS,
  DPR_QUALITIES
} from './constants.js';

import {
  validateRange,
  validateWidths,
  validateAndDestructureOptions,
  validateVariableQuality,
  validateWidthTolerance
} from './validators.js';

export default class ImgixClient {
  constructor(opts = {}) {
    this.settings = { ...DEFAULT_OPTIONS, ...opts };
    // a cache to store memoized srcset width-pairs
    this.targetWidthsCache = {};
    if (typeof this.settings.domain != "string") {
      throw new Error('ImgixClient must be passed a valid string domain');
    }

    if (DOMAIN_REGEX.exec(this.settings.domain) == null) {
      throw new Error(
        'Domain must be passed in as fully-qualified ' +
        'domain name and should not include a protocol or any path ' +
        'element, i.e. "example.imgix.net".');
    }

    if (this.settings.includeLibraryParam) {
      this.settings.libraryParam = "js-" + VERSION;
    }

    this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://';
  }

  buildURL(path = '', params = {}) {
    const sanitizedPath = this._sanitizePath(path);

    let finalParams = this._buildParams(params);
    if (!!this.settings.secureURLToken) {
      finalParams = this._signParams(sanitizedPath, finalParams);
    }
    return this.settings.urlPrefix + this.settings.domain + sanitizedPath + finalParams;
  }

  _buildParams(params = {}) {
    const queryParams = [];
    if (this.settings.libraryParam) {
      queryParams.push('ixlib=' + this.settings.libraryParam)
    }

    for (const key in params) {
      const val = params[key];
      const encodedKey = encodeURIComponent(key);

      let encodedVal;
      if (key.substr(-2) === '64') {
        encodedVal = Base64.encodeURI(val);
      } else {
        encodedVal = encodeURIComponent(val);
      }
      queryParams.push(encodedKey + "=" + encodedVal);
    }

    if (queryParams[0]) {
      queryParams[0] = "?" + queryParams[0];
    }
    return queryParams.join('&');
  }

  _signParams(path, queryParams) {
    const signatureBase = this.settings.secureURLToken + path + queryParams;
    const signature = md5(signatureBase);

    if (queryParams.length > 0) {
      return queryParams = queryParams + "&s=" + signature;
    } else {
      return queryParams = "?s=" + signature;
    }
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
      _path = encodeURI(_path).replace(/[#?:]/g, encodeURIComponent);
    }

    return '/' + _path;
  }

  buildSrcSet(path, params = {}, options = {}) {
    const _options = {...options};
    const _params = {...params};
    const {w, h, ar} = _params;

    if ((w) || (h && ar)) {
      return this._buildDPRSrcSet(path, _params, _options);
    } else {
      return this._buildSrcSetPairs(path, _params, _options);
    }
  }

  _buildSrcSetPairs(path, params, options) {
    const [widthTolerance, minWidth, maxWidth]  = validateAndDestructureOptions(options);
    const srcset = [];
    const customWidths = options.widths;


    let targetWidths;
    if (customWidths) {
      validateWidths(customWidths);
      targetWidths = customWidths;
    } else {
      validateRange(minWidth, maxWidth);
      validateWidthTolerance(widthTolerance);
      targetWidths = this._generateTargetWidths(widthTolerance, minWidth, maxWidth);
    }

    let queryParams = {};
    for (const key in params) {
      queryParams[key] = params[key];
    }

    for (let i = 0; i < targetWidths.length; i++) {
      const currentWidth = targetWidths[i];
      queryParams.w = currentWidth;
      srcset.push(this.buildURL(path, queryParams) + ' ' + currentWidth + 'w')
    }

    return srcset.join(',\n')
  };

  _buildDPRSrcSet(path, params, options) {
    const srcset = [];
    const targetRatios = [1, 2, 3, 4, 5];
    const disableVariableQuality = options.disableVariableQuality || false;

    const queryParams = {};
    for (const key in params) {
      queryParams[key] = params[key];
    }

    const quality = queryParams.q;
    if (!disableVariableQuality) {
      validateVariableQuality(disableVariableQuality);
    }

    for (let i = 0; i < targetRatios.length; i++) {
      const currentRatio = targetRatios[i];
      queryParams.dpr = currentRatio;

      if (!disableVariableQuality) {
        queryParams.q = quality || DPR_QUALITIES[currentRatio];
      }
      srcset.push(this.buildURL(path, queryParams) + ' ' + currentRatio + 'x')
    }

    return srcset.join(',\n');
  };

  // returns an array of width values used during scrset generation
  _generateTargetWidths(widthTolerance, minWidth, maxWidth) {
    const resolutions = [];
    const INCREMENT_PERCENTAGE = widthTolerance;
    const _minWidth = Math.floor(minWidth);
    const _maxWidth = Math.floor(maxWidth);
    const cacheKey = INCREMENT_PERCENTAGE + '/' + _minWidth + '/' + _maxWidth;

    if (cacheKey in this.targetWidthsCache) {
      return this.targetWidthsCache[cacheKey];
    }

    const ensureEven = (n) => {
      return 2 * Math.round(n / 2);
    };

    let prev = _minWidth;
    while (prev < _maxWidth) {
      resolutions.push(ensureEven(prev));
      prev *= 1 + (INCREMENT_PERCENTAGE * 2);
    }

    resolutions.push(_maxWidth);

    this.targetWidthsCache[cacheKey] = resolutions;

    return resolutions;
  };
}
