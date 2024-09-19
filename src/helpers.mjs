import { parseURL, hasProtocol } from 'ufo';

/**
 * `extractUrl()` extracts URL components from a source URL string.
 * It does this by matching the URL against regular expressions. The irrelevant
 * (entire URL) matches are removed and the rest stored as their corresponding
 * URL components.
 *
 * `url` can be a partial, full URL, or full proxy URL. `useHttps` boolean
 * defaults to false.
 *
 * @returns {Object} `{ protocol, auth, host, pathname, search, hash }`
 * extracted from the URL.
 */
export function extractUrl({ url = '', useHttps = false }) {
  const defaultProto = useHttps ? 'https://' : 'http://';
  if (!hasProtocol(url, true)) {
    return extractUrl({ url: defaultProto + url });
  }
  /**
   * Regex are hard to parse. Leaving this breakdown here for reference.
   * - `protocol`: ([^:/]+:)? - all not `:` or `/` & preceded by `:`, 0-1 times
   * - `auth`: ([^/@]+@)? - all not `/` or `@` & preceded by `@`, 0-1 times
   * - `domainAndPath`: (.*) /) -  all except line breaks
   * - `domain`: `([^/]*)` - all before a `/` token
   */
  return parseURL(url);
}
