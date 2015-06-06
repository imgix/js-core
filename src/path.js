import { md5 } from "blueimp-md5";
import URI from "URIjs";
import merge from "lodash.merge";

export default class Path {
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
    this.queryParams = merge(this.queryParams, newParams);
    return this;
  }

  _query() {
    return URI.buildQuery(merge(this._queryWithoutSignature(), this._signature()));
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
