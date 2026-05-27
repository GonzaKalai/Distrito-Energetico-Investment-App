#!/usr/bin/env node
import { readdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const distClient = join(process.cwd(), "dist", "client");
const assetsDir = join(distClient, "assets");

if (!existsSync(assetsDir)) {
  console.log("dist/client/assets not found, skipping index.html generation");
  process.exit(0);
}

if (existsSync(join(distClient, "index.html"))) {
  console.log("index.html already exists in dist/client, skipping generation");
  process.exit(0);
}

const assets = readdirSync(assetsDir);
const cssFiles = assets.filter(f => f.endsWith(".css"));
const jsFiles = assets.filter(f => f.endsWith(".js") && !f.includes("vite-browser-external"));

const cssLinks = cssFiles.map(f => `  <link rel="stylesheet" href="/assets/${f}">`).join("\n");
const jsScripts = jsFiles.map(f => `  <script type="module" src="/assets/${f}"></script>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Distrito Energético — Investment Platform</title>
  <meta name="description" content="Plataforma de inversión para Vaca Muerta." />
${cssLinks}
</head>
<body>
  <div id="root"></div>
${jsScripts}
</body>
</html>`;

writeFileSync(join(distClient, "index.html"), html);
console.log("✓ Generated dist/client/index.html with", cssFiles.length, "CSS and", jsFiles.length, "JS files");
