export function extractUrl({ url, options }) {
  let prefix, rest, domain, _path, path;

  const hasPrefix = url.indexOf('://') !== -1;
  // store each component of the URL
  if (!hasPrefix) {
    prefix = options.useHTTPS ? 'https://' : 'http://';
    [domain, ..._path] = url.split('/');
  } else {
    prefix = '';
    rest = url.split('://')[1];
    [domain, ..._path] = rest.split('/');
  }
  path = _path.join('/');
  return {
    prefix,
    domain,
    path,
  };
}
