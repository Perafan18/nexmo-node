"use strict";

import nexmo from "./index";
import fs from "fs";
import querystring from "querystring";

class Media {
  constructor(credentials, options) {
    this.creds = credentials;
    this.options = options;

    // Used to facilitate testing of the call to the underlying object
    this._nexmo = this.options.nexmoOverride || nexmo;

    this._nexmo.initialize(
      this.creds.apiKey,
      this.creds.apiSecret,
      this.options
    );
  }

  upload(opts, callback) {
    opts = opts || {};
    if (!opts.file && !opts.url) {
      throw new Error(
        "You must provide either 'file' or 'url' to upload a file"
      );
    }

    if (opts.file) {
      opts.file = fs.createReadStream(opts.file);
    }
    return this.options.api.postFile("/v3/media", opts, callback, true);
  }

  search(options, callback) {
    if (typeof options == "function" && !callback) {
      callback = options;
      options = {};
    }

    options = options || {};

    return this._makeRequest("GET", "/v3/media", options, callback);
  }

  download(id, callback) {
    return this._makeRequest("GET", `/v3/media/${id}`, {}, callback, true);
  }

  delete(id, callback) {
    return this._makeRequest("DELETE", `/v3/media/${id}`, {}, callback);
  }

  get(id, callback) {
    return this._makeRequest("GET", `/v3/media/${id}/info`, {}, callback);
  }

  update(id, opts, callback) {
    return this._makeRequest("PUT", `/v3/media/${id}/info`, opts, callback);
  }

  _makeRequest(verb, path, options, callback, skipJsonParsing) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.creds.generateJwt()}`
    };

    let req = {};
    if (verb.toUpperCase() === "GET") {
      if (Object.keys(options).length) {
        path = path + "?" + querystring.stringify(options);
      }
    } else {
      req["body"] = JSON.stringify(options);
    }

    req["path"] = path;
    req["headers"] = headers;

    return this.options.api.request(req, verb, callback, skipJsonParsing);
  }
}

export default Media;
