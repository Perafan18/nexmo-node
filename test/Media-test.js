import Media from "../lib/Media";
import { expect, sinon, TestUtils } from "./NexmoTestUtils";

describe("Media", function() {
  beforeEach(function() {
    this.httpClientStub = TestUtils.getHttpClient();
    sinon.stub(this.httpClientStub, "request");
    this.media = new Media(TestUtils.getCredentials(), {
      api: this.httpClientStub
    });
  });

  describe("#search", function() {
    it("should default to no parameters", function() {
      return expect(this.media)
        .method("search")
        .to.get.url("/v3/media");
    });

    it("should pass through supplied parameters", function() {
      return expect(this.media)
        .method("search")
        .withParams({ order: "ascending", page_size: 11 })
        .to.get.url("/v3/media?order=ascending&page_size=11");
    });
  });

  describe("#download", function() {
    it("should call the correct URL", function() {
      return expect(this.media)
        .method("download")
        .withParams("ABC123")
        .to.get.url("/v3/media/ABC123");
    });
  });

  describe("#get", function() {
    it("should call the correct URL", function() {
      return expect(this.media)
        .method("get")
        .withParams("ABC123")
        .to.get.url("/v3/media/ABC123/info");
    });
  });

  describe("#delete", function() {
    it("should call the correct URL", function() {
      return expect(this.media)
        .method("delete")
        .withParams("ABC123")
        .to.delete.url("/v3/media/ABC123");
    });
  });

  describe("#upload", function() {
    // @TODO Add assertions for POST body
    // @TODO Add mocks for request
    xit("should call the correct URL (file provided)", function() {
      return expect(this.media)
        .method("upload")
        .withParams({ file: "/dev/null" })
        .to.post.to.url("/v3/media");
    });

    xit("should call the correct URL (url provided)", function() {
      return expect(this.media)
        .method("upload")
        .withParams({ url: "http://example.com" })
        .to.post.to.url("/v3/media");
    });
  });

  describe("#update", function() {
    it("should call the correct URL", function() {
      return expect(this.media)
        .method("update")
        .withParams("ABC123", { public_item: true })
        .to.put.to.url("/v3/media/ABC123/info");
    });
  });
});
