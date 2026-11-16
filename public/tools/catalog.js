const search = document.getElementById("search");
const categories = document.getElementById("categories");
const tools = [...document.querySelectorAll(".tool")];
let category = "";

// Category buttons come from the actual tools; adding a card needs no JS changes.
for (const name of new Set(tools.map((tool) => tool.dataset.category))) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.category = name;
  button.textContent = name;
  button.setAttribute("aria-pressed", "false");
  categories.append(button);
}

function filter() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const tool of tools) {
    const text = `${tool.textContent} ${tool.dataset.keywords}`.toLowerCase();
    const matches = (!category || tool.dataset.category === category) && words.every((word) => text.includes(word));
    tool.hidden = !matches;
    if (matches) count++;
  }
  document.getElementById("count").textContent = `${count} 个工具`;
  document.getElementById("empty").hidden = count !== 0;
  for (const button of categories.querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.category === category));
}

search.addEventListener("input", filter);
categories.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  category = button.dataset.category;
  filter();
});
document.getElementById("reset").addEventListener("click", () => { search.value = ""; category = ""; filter(); search.focus(); });
filter();
