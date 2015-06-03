import Path from "./path";

export default class Client {
  constructor(host, token=null, secure=true) {
    this.host = host;
    this.token = token;
    this.secure = secure;
  }

  path(urlPath) {
    return new Path(urlPath, this.host, this.token, this.secure);
  }
}
