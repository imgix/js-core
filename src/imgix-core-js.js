import crypto from "crypto";
import url from "url";

export const VERSION = "0.2.1";

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
      this.path = encodeURIComponent(this.path);
    }

    if (this.path[0] !== "/") {
      this.path = "/" + this.path;
    }
  }

  toString() {
    return url.format({
      protocol: this.secure ? "https:" : "http:",
      slashes: true,
      host: this.host,
      query: this._query(),
      pathname: this.path
    });
  }

  toUrl(newParams) {
    this.queryParams = Object.assign(this.queryParams, newParams);
    return this;
  }

  _query() {
    return Object.assign(this._queryWithoutSignature(), this._signature());
  }

  _queryWithoutSignature() {
    let query = this.queryParams;

    if (this.librarySignature && this.libraryVersion) {
      query.ixlib = `${this.librarySignature}-${this.libraryVersion}`;
    }

    return query;
  }

  _md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
  }

  _signature() {
    if (!this.token) {
      return {};
    }

    let signatureBase = this.token + this.path;
    let query = url.format({query: this.queryParams});

    if (!!query) {
      signatureBase += `${query}`;
    }

    return { s: this._md5(signatureBase) };
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