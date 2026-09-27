let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(raw);
  } catch {
    // Unparseable input: allow, nothing to inspect.
  }
  const toolInput = input.tool_input ?? {};
  const filePath = String(
    toolInput.file_path ?? toolInput.path ?? toolInput.target_file ?? input.file_path ?? "",
  ).replace(/\\/g, "/");

  const protectedFile =
    /(^|\/)\.env(\.[^/]*)?$/.test(filePath) || /credentials|secrets?/i.test(filePath);

  if (filePath && protectedFile) {
    const message = `Protected file: AI edits are not allowed for ${filePath}`;
    process.stdout.write(
      JSON.stringify({ permission: "deny", user_message: message, agent_message: message }),
    );
    process.exit(2);
  }

  process.stdout.write(JSON.stringify({ permission: "allow" }));
});
