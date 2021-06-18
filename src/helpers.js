/**
 * `extractUrl()` extracts the domain and path from a URL string.
 *
 * - `url` can be a partial, full URL, or full proxy URL
 * - `options` should be an object with `ImgixClient` options
 *
 * @returns {Object} `{domain, path}` (strings) extracted from the URL.
 */
export function extractUrl({ url = '', options = {} }) {
  let domain = '';
  let path = '';

  // base case
  if (url == null || url.length <= 1) {
    return { domain, path };
  }

  // parse URL attributes
  const hasScheme = url.indexOf('://') !== -1;
  const isProxy = (url.match(/http/g) || []).length >= 2;
  const useHttps = options.useHttps
    ? options.useHttps
    : url.indexOf('https') !== -1;
  const scheme = useHttps ? 'https://' : 'http://';

  if (isProxy) {
    [domain, path] = extractProxyUrl({ url, scheme, useHttps });
  } else if (!hasScheme) {
    [domain, path] = extractDomainAndPath({ url });
  } else {
    [domain, path] = extractDomainAndPath({ url, scheme });
  }

  return {
    domain,
    path,
  };
}

/**
 * `extractDomainAndPath()` first checks if the URL has a scheme. If it it does,
 * it removes the scheme. Then it extracts the domain and path components of the
 *  URL.
 *
 * - `url` string can be a partial or full URL, `https://foo.com` || `foo.com`
 * - `scheme` (optional) string should be `http://` or `https://`.
 *   Defaults to undefined.
 *
 * @returns Array of `[domain, path]` strings
 */
const extractDomainAndPath = ({ url, scheme = undefined }) => {
  let _scheme, domain, _path, path;

  // remove the scheme from the URL
  if (scheme != null) {
    [_scheme, url] = url.split(scheme);
  }

  [domain, ..._path] = url.split('/');
  path = _path.join('/');
  return [domain, path];
};

/**
 *
 * `extractProxyUrl()` extracts the URL's `domain` and proxy `path`. First, it
 * removes the full URL's scheme from the string. Then it isolates the `domain`
 * and `path` components fo the URL. Finally, it conditionally adds a `scheme`
 * back to the `proxy` path, since it might have been removed when the full
 * URL's scheme was split on.
 *
 * - `url` is a full URl with a proxy URL as its path
 * - `scheme` string should be `http://` or `https://`
 * - `useHttps` boolean defaults to `true`
 *
 * @returns Array of `[domain, path]` strings, where path is the proxy URL.
 */
const extractProxyUrl = ({ url, scheme, useHttps = true }) => {
  let _scheme, domain, path;

  // remove the scheme from the URL
  [_scheme, domain, ...path] = url.split(scheme);
  // remove any trailing slashes from the domain
  domain = domain.replace(/\/$/, '');

  // add scheme back in to the proxy path
  if (path.indexOf('http') == -1) {
    path = useHttps ? 'https://' + path : 'http://' + path;
  }

  return [domain, path];
};
