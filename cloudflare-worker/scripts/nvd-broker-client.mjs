#!/usr/bin/env node

/**
 * Minimal NVD broker client for other toolkits.
 *
 * Usage examples:
 *   node ./scripts/nvd-broker-client.mjs cve CVE-2024-3094
 *   node ./scripts/nvd-broker-client.mjs download-cve CVE-2024-3094
 *   node ./scripts/nvd-broker-client.mjs search "cpeName=cpe:2.3:o:linux:linux_kernel:*"
 *
 * Environment variables:
 *   NVD_BROKER_BASE_URL (required) e.g. https://<worker-domain>
 *   NVD_BROKER_TOKEN (optional, required only if broker enforces x-broker-token)
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function requiredEnv(name) {
  const value = (process.env[name] || "").trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name) {
  return (process.env[name] || "").trim();
}

function buildHeaders() {
  const headers = {
    Accept: "application/json"
  };

  const token = optionalEnv("NVD_BROKER_TOKEN");
  if (token) {
    headers["x-broker-token"] = token;
  }

  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders()
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = payload?.message || payload?.error || `HTTP ${response.status}`;
    throw new Error(`Broker request failed: ${message}`);
  }

  return payload;
}

async function fetchDownloadToFile(url, defaultFileName) {
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders()
  });

  const body = await response.text();
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const payload = JSON.parse(body);
      message = payload?.message || payload?.error || message;
    } catch {
      // Keep generic message
    }

    throw new Error(`Broker download failed: ${message}`);
  }

  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/i);
  const fileName = (match?.[1] || defaultFileName).trim();

  await fs.mkdir("./downloads", { recursive: true });
  const filePath = path.join("./downloads", fileName);
  await fs.writeFile(filePath, body, "utf8");

  return { filePath };
}

function baseUrl() {
  const raw = requiredEnv("NVD_BROKER_BASE_URL");
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

async function main() {
  const [command, arg] = process.argv.slice(2);
  if (!command) {
    throw new Error("Usage: nvd-broker-client.mjs <cve|download-cve|search|download-search> <arg>");
  }

  const broker = baseUrl();

  if (command === "cve") {
    const cveId = (arg || "").trim().toUpperCase();
    if (!cveId) throw new Error("cve command requires a CVE id, e.g. CVE-2024-3094");

    const payload = await fetchJson(`${broker}/nvd/cve/${encodeURIComponent(cveId)}`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === "download-cve") {
    const cveId = (arg || "").trim().toUpperCase();
    if (!cveId) throw new Error("download-cve command requires a CVE id, e.g. CVE-2024-3094");

    const { filePath } = await fetchDownloadToFile(
      `${broker}/nvd/download/cve/${encodeURIComponent(cveId)}`,
      `${cveId.toLowerCase()}.json`
    );

    console.log(`Saved: ${filePath}`);
    return;
  }

  if (command === "search") {
    const query = (arg || "").trim();
    if (!query) {
      throw new Error("search command requires a query string, e.g. cpeName=cpe:2.3:o:linux:linux_kernel:*");
    }

    const payload = await fetchJson(`${broker}/nvd/search?${query}`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === "download-search") {
    const query = (arg || "").trim();
    if (!query) {
      throw new Error("download-search command requires a query string, e.g. keywordSearch=openssl");
    }

    const { filePath } = await fetchDownloadToFile(
      `${broker}/nvd/download/search?${query}`,
      `nvd-search-${Date.now()}.json`
    );

    console.log(`Saved: ${filePath}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
