import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const versionJsonPath = path.join(rootDir, "version.json")

const raw = await readFile(versionJsonPath, "utf8")
const current = JSON.parse(raw)

const now = new Date()
const yy = String(now.getUTCFullYear()).slice(-2)
const mm = String(now.getUTCMonth() + 1)
const dd = String(now.getUTCDate())
const prefix = `${yy}.${mm}.${dd}.`

let nextN = 1
if (typeof current.version === "string" && current.version.startsWith(prefix)) {
  const tail = current.version.slice(prefix.length)
  const parsed = Number.parseInt(tail, 10)
  if (Number.isFinite(parsed) && parsed > 0) {
    nextN = parsed + 1
  }
}

const nextVersion = `${prefix}${nextN}`
await writeFile(versionJsonPath, `${JSON.stringify({ version: nextVersion }, null, 2)}\n`, "utf8")

console.log(`Bumped version to ${nextVersion}`)
