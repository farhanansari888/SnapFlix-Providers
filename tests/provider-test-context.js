const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const urlsEndpoint =
  "https://raw.githubusercontent.com/farhanansari888/SnapFlix-Providers/refs/heads/main/urls.json";
const nativeFetch = global.fetch;

global.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  if (url === urlsEndpoint) {
    const providerUrls = fs.readFileSync(
      path.join(rootDir, "urls.json"),
      "utf-8",
    );
    return new Response(providerUrls, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return nativeFetch(input, init);
};

const providerContext = {
  axios,
  cheerio,
  commonHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
  Aes: {},
  kvStore: {
    _store: new Map(),
    get: async (key) => providerContext.kvStore._store.get(key),
    set: async (key, val) => { providerContext.kvStore._store.set(key, val); },
    delete: async (key) => providerContext.kvStore._store.delete(key),
    keys: async () => Array.from(providerContext.kvStore._store.keys()),
    clear: async () => { providerContext.kvStore._store.clear(); },
  },
};

module.exports = { providerContext };
