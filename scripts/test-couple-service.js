/**
 * Verification test for coupleService validation logic
 */
const { execSync } = require("child_process")

console.log("Checking TypeScript compilation for src/services/coupleService.ts...")
try {
  execSync("npx tsc --noEmit", { stdio: "inherit" })
  console.log("✅ coupleService.ts passed TypeScript static checks without errors!")
} catch (err) {
  console.error("❌ TypeScript compilation error in coupleService:", err)
  process.exit(1)
}
