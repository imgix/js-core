import md5 from "js-md5";

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
    const protocol = this.secure ? "https://" : "http://";
    const host = this.host;
    const path = this.path;
    const query = this._query();

    return `${protocol}${host}${path}${query}`;
  }

  toUrl(newParams) {
    this.queryParams = Object.assign(this.queryParams, newParams);
    return this;
  }

  _toQueryString(queryParams) {
    let r20 = /%20/g;

    let queryStringComponents = Object.keys(queryParams).map((key) => {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(queryParams[key]);

      return `${encodedKey}=${encodedValue}`;
    });

    return queryStringComponents.join("&").replace(r20, "+");
  }

  _query() {
    let queryParams = Object.assign(this._queryWithoutSignature(), this._signature());
    let queryString = this._toQueryString(queryParams);

    return( queryString ? `?${queryString}` : '' );
  }

  _queryWithoutSignature() {
    let query = this.queryParams;

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
    let query = this._toQueryString(this.queryParams);

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