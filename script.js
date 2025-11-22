const output = document.getElementById("output");
const input = document.getElementById("cmdInput");
const panel = document.getElementById("panel");
const promptText = "[hiringagent@sudo_hire_rylen ~]$";

const sections = {
  about: `
    <div class="ascii-line">---------------- about ----------------</div>
    <p>Hi, I'm Rylen — a front-end engineer who likes turning ideas into tactile, fast UIs. I enjoy building deliberate, playful interfaces that still feel professional.</p>
    <p>Currently exploring web animation, design systems, and ways to make developer tooling feel friendlier.</p>
    <div class="skills">
      <span class="pill">JavaScript</span>
      <span class="pill">TypeScript</span>
      <span class="pill">CSS / Animations</span>
      <span class="pill">React-ish</span>
      <span class="pill">Accessibility</span>
      <span class="pill">Design Systems</span>
      <span class="pill">Node</span>
      <span class="pill">UI Prototyping</span>
    </div>
    <div class="ascii-line">---------------------------------------</div>
  `,
  projects: `
    <div class="ascii-line">--------------- projects ---------------</div>
    <div class="project-grid">
      <div class="project-card">
        <strong>Signal Board</strong>
        <p>Real-time status wall for ops teams with keyboard-driven controls and ambient sounds.</p>
        <a href="#" aria-label="View Signal Board project">view placeholder link</a>
      </div>
      <div class="project-card">
        <strong>Palette Play</strong>
        <p>Browser-based color lab that generates palettes, exports tokens, and previews UI states.</p>
        <a href="#" aria-label="View Palette Play project">view placeholder link</a>
      </div>
      <div class="project-card">
        <strong>Waypoint Docs</strong>
        <p>Minimal docs theme with fuzzy search, code tabs, and a built-in changelog feed.</p>
        <a href="#" aria-label="View Waypoint Docs project">view placeholder link</a>
      </div>
    </div>
    <div class="ascii-line">---------------------------------------</div>
  `,
  contact: `
    <div class="ascii-line">---------------- contact ----------------</div>
    <p>Always happy to chat about collaborations, UI ideas, or cool developer tools.</p>
    <div class="contact-links">
      <div class="contact-link"><a href="mailto:rylen@example.com">✉️ rylen@example.com</a></div>
      <div class="contact-link"><a href="https://github.com/" target="_blank" rel="noreferrer noopener">🐙 GitHub</a></div>
      <div class="contact-link"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">💼 LinkedIn</a></div>
      <div class="contact-link"><a href="#" aria-label="Portfolio link placeholder">🖥️ Portfolio placeholder</a></div>
    </div>
    <div class="ascii-line">----------------------------------------</div>
  `,
  history: `
    <div class="ascii-line">---------------- history ----------------</div>
    <div class="timeline">
      <div class="timeline-item"><strong>2024 — Present</strong><br/>Senior Front-end Engineer crafting dashboards & design system utilities.</div>
      <div class="timeline-item"><strong>2022 — 2024</strong><br/>Built interactive data visualizations and performance-focused UI tooling.</div>
      <div class="timeline-item"><strong>2020 — 2022</strong><br/>Shipped marketing sites & product UI experiments for early-stage teams.</div>
      <div class="timeline-item"><strong>2018 — 2020</strong><br/>Learned the ropes with HTML/CSS/JS freelancing and open-source tinkering.</div>
    </div>
    <div class="ascii-line">----------------------------------------</div>
  `,
};

const history = [];
let historyIndex = -1;
let currentSection = null;

const lsOutput = "about/   projects/   contact/   history/";

const welcome = [
  "booting portfolio shell...",
  'type "help" to see available commands.',
];

function appendLine(text, className = "") {
  const line = document.createElement("div");
  line.className = className ? `line ${className}` : "line";
  line.textContent = text;
  output.appendChild(line);
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function printLines(lines, delayed = false) {
  const queue = Array.isArray(lines) ? lines : [lines];
  if (!delayed || queue.length === 0) {
    queue.forEach((line) => appendLine(line));
    scrollToBottom();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let idx = 0;
    const tick = () => {
      appendLine(queue[idx]);
      scrollToBottom();
      idx += 1;
      if (idx < queue.length) {
        setTimeout(tick, 35);
      } else {
        resolve();
      }
    };
    tick();
  });
}

function showPanel(sectionKey) {
  const content = sections[sectionKey];
  panel.innerHTML = `
    <div class="panel-header">/ ${sectionKey} -----------------------------------</div>
    <div class="panel-body">${content}</div>
    <div class="panel-footer">---------------------------------------------</div>
  `;
  panel.classList.remove("hidden");
  currentSection = sectionKey;
}

function closePanel() {
  panel.innerHTML = "";
  panel.classList.add("hidden");
  currentSection = null;
}

async function logAndRespond(raw, responseLines, delayed = false) {
  appendLine(`${promptText} ${raw}`);
  await printLines(responseLines, delayed);
}

async function handleCommand(rawInput) {
  const command = rawInput.trim();

  // Only add non-empty commands to history for recall navigation.
  if (command) {
    history.push(command);
    historyIndex = history.length;
  }

  const [cmd, ...args] = command.split(/\s+/);
  const lowerCmd = cmd.toLowerCase();

  switch (lowerCmd) {
    case "":
      appendLine(`${promptText} ${rawInput}`);
      break;
    case "help":
      await logAndRespond(
        rawInput,
        [
          "Available commands:",
          "  help               - show this help menu",
          "  ls                 - list available sections",
          "  cd <section>       - open a section (about, projects, contact, history)",
          "  cd ..  or  cd /    - return to root",
          "  clear              - clear the terminal",
          "  press ↑ / ↓        - navigate prompt history",
          "  sudo hire rylen    - hire Rylen (if you have permission)",
          "",
          "Examples:",
          "  cd projects",
          "  cd ..",
        ],
        true
      );
      break;
    case "ls":
      await logAndRespond(rawInput, [lsOutput]);
      break;
    case "cd": {
      const target = (args[0] || "").toLowerCase();
      if (!target) {
        await logAndRespond(rawInput, ["cd: missing operand"]);
        break;
      }
      if (target === ".." || target === "/") {
        closePanel();
        await logAndRespond(rawInput, ["returned to /"]);
        break;
      }
      if (!sections[target]) {
        await logAndRespond(rawInput, [
          `cd: no such file or directory: ${target}`,
        ]);
        break;
      }
      showPanel(target);
      await logAndRespond(rawInput, [`navigated to /${target}`], true);
      break;
    }
    case "sudo hire rylen":
      await logAndRespond(rawInput, [
        "Permission granted. Rylen has been hired! 🎉",
      ]);
      break;
    case "clear":
      output.innerHTML = "";
      break;
    default:
      await logAndRespond(rawInput, [`command not found: ${cmd}`]);
  }

  scrollToBottom();
}

function handleHistoryNavigation(key) {
  if (!history.length) return;
  if (key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex -= 1;
    }
  } else if (key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex += 1;
    } else {
      historyIndex = history.length;
      input.value = "";
      return;
    }
  }
  input.value = history[historyIndex] || "";
  setTimeout(
    () => input.setSelectionRange(input.value.length, input.value.length),
    0
  );
}

function boot() {
  input.focus();
  printLines(welcome, true);
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const rawValue = input.value;
    input.value = "";
    handleCommand(rawValue);
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    handleHistoryNavigation(event.key);
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("a")) return;
  input.focus();
});

boot();
