var assert = require("assert");
var ImgixClient = require("../src/imgix-core-js");

describe("imgix-core-js + SDK library API:", function () {
  it("allows an SDK library to override libraryParam", () => {
    const client = new ImgixClient({
      domain: "testing.imgix.net",
    });

    client.settings.libraryParam = "test";

    result = client._buildParams({});

    assert(result.match(/ixlib=test/));
  });
});
