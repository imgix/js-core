// package version used in the ix-lib parameter
export const VERSION = '3.6.0';
// regex pattern used to determine if a domain is valid
export const DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i;
// minimum generated srcset width
export const MIN_SRCSET_WIDTH = 100;
// maximum generated srcset width
export const MAX_SRCSET_WIDTH = 8192;
// default tolerable percent difference between srcset pair widths
export const DEFAULT_SRCSET_WIDTH_TOLERANCE = 0.08;

// default quality parameter values mapped by each dpr srcset entry
export const DPR_QUALITIES = {
  1: 75,
  2: 50,
  3: 35,
  4: 23,
  5: 20,
};

export const DEFAULT_DPR = [1, 2, 3, 4, 5];

export const DEFAULT_OPTIONS = {
  domain: null,
  useHTTPS: true,
  includeLibraryParam: true,
  urlPrefix: 'https://',
  secureURLToken: null,
};
