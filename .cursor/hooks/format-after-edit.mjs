import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = input.file_path ?? input.tool_input?.file_path ?? "";
    if (/\.(ts|tsx|js|jsx|json|md|css)$/.test(filePath) && existsSync(filePath)) {
      execSync(`npx prettier --write "${filePath}"`, { stdio: "ignore" });
    }
  } catch {
    // Formatting is best-effort; never block the agent.
  }
  process.exit(0);
});
