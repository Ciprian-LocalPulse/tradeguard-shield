import { cp, mkdir } from "node:fs/promises";

await mkdir("build", { recursive: true });
await cp("manifest.json", "build/manifest.json");
await cp("popup", "build/popup", { recursive: true });
await cp("options", "build/options", { recursive: true });
await mkdir("build/assets", { recursive: true });
await cp("../../assets/extension", "build/assets", { recursive: true });
