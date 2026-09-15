import { spawnSync } from "node:child_process";
import { renameSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectId = "yvcouckoailptddiygmc";
const outputPath = resolve("src/types/database.ts");
const temporaryPath = `${outputPath}.tmp`;
const voltaCommand = process.platform === "win32" ? "volta.exe" : "volta";
const result = spawnSync(
  voltaCommand,
  [
    "run",
    "--pnpm",
    "11.27.0",
    "pnpm",
    "dlx",
    "supabase@latest",
    "gen",
    "types",
    "typescript",
    "--project-id",
    projectId,
    "--schema",
    "public",
  ],
  {
    encoding: "utf8",
  },
);

if (result.error) {
  throw new Error(`Unable to start the Supabase CLI: ${result.error.message}`);
}

if (result.status !== 0) {
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exit(result.status ?? 1);
}

try {
  writeFileSync(temporaryPath, result.stdout);
  renameSync(temporaryPath, outputPath);
} finally {
  try {
    unlinkSync(temporaryPath);
  } catch {
    // The temporary file is absent when generation or rename succeeds.
  }
}
