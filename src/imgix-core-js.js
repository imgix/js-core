import md5 from "js-md5";
import URI from "urijs";
import Base64 from "js-base64";

export const VERSION = "0.2.4";

export class Path {
  constructor(path, host, token=null, secure=true, librarySignature="js", libraryVersion=VERSION) {
    this.path = path;
    this.host = host;
    this.token = token;
    this.secure = secure;
    this.queryParams = {};
    this.librarySignature = librarySignature;
    this.libraryVersion = libraryVersion;

    // We are dealing with a fully-qualified URL as a path, encode it
    if (this.path.indexOf("http") === 0) {
      this.path = URI.encode(this.path);
    } else {
      this.path = URI.encodeReserved(this.path);
    }

    if (this.path[0] !== "/") {
      this.path = "/" + this.path;
    }
  }

  toString() {
    let uri = new URI({
      protocol: this.secure ? "https" : "http",
      hostname: this.host,
      path: this.path,
      query: this._query()
    });
    return uri.toString();
  }

  toUrl(newParams) {
    this.queryParams = Object.assign(this.queryParams, newParams);
    return this;
  }

  _query() {
    return URI.buildQuery(Object.assign(this._queryWithoutSignature(), this._signature()), false, false);
  }

  _b64EncodedQuery() {
    let query = this.queryParams;
    let encodedQuery = {};

    for (let key in query) {
      let val = query[key];

      if (key.substr(-2) == '64') {
        encodedQuery[key] = Base64.Base64.encodeURI(val);
      } else {
        encodedQuery[key] = val;
      }
    }

    return encodedQuery;
  }

  _queryWithoutSignature() {
    let query = this._b64EncodedQuery();

    if (this.librarySignature && this.libraryVersion) {
      query.ixlib = `${this.librarySignature}-${this.libraryVersion}`;
    }

    return query;
  }

  _signature() {
    if (!this.token) {
      return {};
    }

    let signatureBase = this.token + this.path;
    let query = URI.buildQuery(this._b64EncodedQuery());

    if (!!query) {
      signatureBase += `?${query}`;
    }

    return { s: md5(signatureBase) };
  }
}

export class Client {
  constructor(host, token=null, secure=true, librarySignature="js", libraryVersion=VERSION) {
    this.host = host;
    this.token = token;
    this.secure = secure;
    this.librarySignature = librarySignature;
    this.libraryVersion = libraryVersion;
  }

  path(urlPath) {
    return new Path(urlPath, this.host, this.token, this.secure, this.librarySignature, this.libraryVersion);
  }
}
