const INITIAL_STATUS = "支持 \\xNN 十六进制转义、UTF-8 中文、JSON 字符串解包和 JSON 格式化。";
const SAMPLE = String.raw`{\x22sourceCode\x22:\x22DEMO202611160001\x22,\x22message\x22:\x22\xE6\x8F\x90\xE4\xBA\xA4\xE6\x88\x90\xE5\x8A\x9F\x22,\x22amount\x22:123.45,\x22result\x22:true}`;

function formatJson(text) {
  // Format tokens rather than parsed values: long numeric IDs must stay exact.
  const tokens = text.match(/"(?:\\.|[^"\\])*"|[{}\[\],:]|[^\s{}\[\],:]+/g);
  let result = "";
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const previous = tokens[i - 1];
    if (token === "{" || token === "[") {
      result += token;
      depth++;
      if (tokens[i + 1] !== (token === "{" ? "}" : "]")) result += "\n" + "  ".repeat(depth);
    } else if (token === "}" || token === "]") {
      depth--;
      if (previous !== (token === "}" ? "{" : "[")) result += "\n" + "  ".repeat(depth);
      result += token;
    } else if (token === ",") result += ",\n" + "  ".repeat(depth);
    else if (token === ":") result += ": ";
    else result += token.startsWith('"') ? JSON.stringify(JSON.parse(token)) : token;
  }
  return result;
}

export function decodeLog(input) {
  let text = input.trim();
  let layers = 0;
  let escapes = 0;
  if (!text) return { text: "", kind: "empty", layers, escapes };

  // SLS can copy the field as a JSON-quoted string, sometimes nested.
  while (text.startsWith('"') && text.endsWith('"')) {
    let parsed;
    try { parsed = JSON.parse(text); } catch { break; }
    if (typeof parsed !== "string" || !/\\+x[\da-f]{2}|^\s*[\[{"]/i.test(parsed)) break;
    text = parsed;
    layers++;
  }

  if (/\\+x(?![\da-f]{2})/i.test(text)) {
    throw new Error("十六进制转义不完整。请复制完整的 request_body，正确示例为 \\x22。");
  }

  text = text.replace(/(?:\\+x[\da-f]{2})+/gi, (run) => {
    const tokens = run.match(/x([\da-f]{2})/gi);
    const bytes = Uint8Array.from(tokens, (token) => parseInt(token.slice(1), 16));
    let decoded;
    try { decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
    catch { throw new Error("发现不完整或非 UTF-8 的中文转义。请确认报文未被截断，且原始编码为 UTF-8。"); }
    escapes += tokens.length;
    return decoded;
  });

  try {
    JSON.parse(text);
    return { text: formatJson(text), kind: "json", layers, escapes };
  } catch {
    return { text, kind: /^[\[{]/.test(text.trim()) ? "invalid-json" : "text", layers, escapes };
  }
}

const input = document.getElementById("input");
const output = document.getElementById("output");
const status = document.getElementById("status");
const copy = document.getElementById("copy");
const download = document.getElementById("download");
let timer;
let outputKind = "empty";

function showStatus(message, tone = "") {
  status.textContent = message;
  status.dataset.tone = tone;
}

function decode() {
  clearTimeout(timer);
  document.getElementById("input-count").textContent = `${input.value.length.toLocaleString()} 字符`;
  try {
    const result = decodeLog(input.value);
    output.value = result.text;
    outputKind = result.kind;
    if (result.kind === "empty") showStatus(INITIAL_STATUS);
    else if (result.kind === "invalid-json") showStatus("转义已解码，但 JSON 语法不完整，已按文本显示。请检查是否复制了完整报文。", "warning");
    else if (!result.escapes && !result.layers && result.kind === "text") showStatus("未发现 \\xNN 转义或 JSON，已原样显示文本。");
    else showStatus(`已${result.kind === "json" ? "格式化 JSON" : "解码文本"}${result.escapes ? `，还原 ${result.escapes} 处转义` : ""}${result.layers ? `，解开 ${result.layers} 层字符串` : ""}。`, "success");
  } catch (error) {
    output.value = "";
    outputKind = "empty";
    showStatus(error.message, "error");
  }
  copy.disabled = download.disabled = !output.value;
  document.getElementById("output-count").textContent = output.value ? `${output.value.length.toLocaleString()} 字符` : "等待输入";
}

input.addEventListener("input", () => {
  clearTimeout(timer);
  // Do not leave a previous report available to copy while input changes.
  output.value = "";
  copy.disabled = download.disabled = true;
  document.getElementById("input-count").textContent = `${input.value.length.toLocaleString()} 字符`;
  document.getElementById("output-count").textContent = "等待解码";
  showStatus("正在解码…");
  timer = setTimeout(decode, 180);
});
document.getElementById("decode").addEventListener("click", decode);
document.getElementById("sample").addEventListener("click", () => { input.value = SAMPLE; decode(); });
document.getElementById("clear").addEventListener("click", () => { input.value = ""; decode(); input.focus(); });
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); decode(); }
});
copy.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(output.value); showStatus("已复制解码结果。", "success"); }
  catch { showStatus("复制未成功，请选中右侧结果后手动复制。", "warning"); }
});
download.addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([output.value], { type: outputKind === "json" ? "application/json;charset=utf-8" : "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = outputKind === "json" ? "decoded-log.json" : "decoded-log.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
