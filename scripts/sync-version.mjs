import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const versionJsonPath = path.join(rootDir, "version.json")
const apiVersionPath = path.join(rootDir, "api", "src", "version.ts")

const versionJsonRaw = await readFile(versionJsonPath, "utf8")
const versionJson = JSON.parse(versionJsonRaw)

if (!versionJson.version || typeof versionJson.version !== "string") {
  throw new Error("version.json is missing a valid version field")
}

const versionFileContent = `export const APP_VERSION = "${versionJson.version}"\n`
await writeFile(apiVersionPath, versionFileContent, "utf8")

console.log(`Synced version ${versionJson.version} to api/src/version.ts`)
