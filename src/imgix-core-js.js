import md5 from "js-md5";
import URI from "URIjs";
import _ from "lodash";

export class Path {
  constructor(path, host, token=null, secure=true) {
    this.path = path;
    this.host = host;
    this.token = token;
    this.secure = secure;
    this.queryParams = {};

    // We are dealing with a fully-qualified URL as a path, encode it
    if (this.path.indexOf("http") === 0) {
      this.path = URI.encode(this.path);
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
    this.queryParams = _.merge(this.queryParams, newParams);
    return this;
  }

  _query() {
    return URI.buildQuery(_.merge(this._queryWithoutSignature(), this._signature()));
  }

  _queryWithoutSignature() {
    return this.queryParams;
  }

  _signature() {
    if (!this.token) {
      return {};
    }

    let signatureBase = this.token + this.path;
    let query = URI.buildQuery(this.queryParams);

    if (!!query) {
      signatureBase += `?${query}`;
    }

    return { s: md5(signatureBase) };
  }
}

export class Client {
  constructor(host, token=null, secure=true) {
    this.host = host;
    this.token = token;
    this.secure = secure;
  }

  path(urlPath) {
    return new Path(urlPath, this.host, this.token, this.secure);
  }
}
