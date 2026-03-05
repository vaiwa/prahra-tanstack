import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const packageJsonPath = path.join(rootDir, "package.json")
const apiVersionPath = path.join(rootDir, "api", "src", "version.ts")

const packageJsonRaw = await readFile(packageJsonPath, "utf8")
const packageJson = JSON.parse(packageJsonRaw)

if (!packageJson.version || typeof packageJson.version !== "string") {
  throw new Error("package.json is missing a valid version field")
}

const versionFileContent = `export const APP_VERSION = "${packageJson.version}"\n`
await writeFile(apiVersionPath, versionFileContent, "utf8")

console.log(`Synced version ${packageJson.version} to api/src/version.ts`)
