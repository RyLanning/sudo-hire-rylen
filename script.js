const output = document.getElementById("output");
const input = document.getElementById("cmdInput");
const panel = document.getElementById("panel");
const promptText = "[hiringagent@sudo_hire_rylen ~]$";
let activeTypeJob = null;
const themes = {
  matrix: { bg: "#000000", text: "#00ff66" },
  amber: { bg: "#000000", text: "#ffbf00" },
  ice: { bg: "#001018", text: "#a8ffff" },
  light: { bg: "#f5f5f5", text: "#111111" },
};

const sections = {
  about: `
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
  `,
  projects: `
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
  `,
  contact: `
    <p>Always happy to chat about collaborations, UI ideas, or cool developer tools.</p>
    <div class="contact-links">
      <div class="contact-link"><a href="mailto:rylen@example.com">✉️ rylen@example.com</a></div>
      <div class="contact-link"><a href="https://github.com/" target="_blank" rel="noreferrer noopener">🐙 GitHub</a></div>
      <div class="contact-link"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">💼 LinkedIn</a></div>
      <div class="contact-link"><a href="#" aria-label="Portfolio link placeholder">🖥️ Portfolio placeholder</a></div>
    </div>
  `,
  history: `
    <div class="timeline">
      <div class="timeline-item"><strong>2024 — Present</strong><br/>Senior Front-end Engineer crafting dashboards & design system utilities.</div>
      <div class="timeline-item"><strong>2022 — 2024</strong><br/>Built interactive data visualizations and performance-focused UI tooling.</div>
      <div class="timeline-item"><strong>2020 — 2022</strong><br/>Shipped marketing sites & product UI experiments for early-stage teams.</div>
      <div class="timeline-item"><strong>2018 — 2020</strong><br/>Learned the ropes with HTML/CSS/JS freelancing and open-source tinkering.</div>
    </div>
  `,
};

const history = [];
let historyIndex = -1;
let currentSection = null;

const welcome = [
  "booting portfolio shell...",
  'type "help" to see available commands.',
];

function applyTheme(bg, text) {
  document.documentElement.style.setProperty("--bg-color", bg);
  document.documentElement.style.setProperty("--text-color", text);
}

function isHexColor(str) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str);
}

function appendLine(text, className = "") {
  const line = document.createElement("div");
  line.className = className ? `line ${className}` : "line";
  line.textContent = text;
  output.appendChild(line);
}

function appendPromptLine(raw) {
  const line = document.createElement("div");
  line.className = "line";
  const promptSpan = document.createElement("span");
  promptSpan.className = "prompt-inline";
  promptSpan.textContent = promptText;
  line.appendChild(promptSpan);
  line.appendChild(document.createTextNode(` ${raw}`));
  output.appendChild(line);
  scrollToBottom();
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function printLines(lines, charDelay = 0) {
  const queue = Array.isArray(lines) ? lines : [lines];

  // No delay: just dump everything
  if (!charDelay || charDelay <= 0) {
    queue.forEach((line) => appendLine(line));
    scrollToBottom();
    return Promise.resolve();
  }

  // Animated typing with interrupt support
  const job = {
    timer: null,
    finished: false,
    flushNow: () => {},
    finish: () => {},
    done: null,
  };

  // This promise resolves when the job is completely finished
  job.done = new Promise((resolve) => {
    job.finish = () => {
      if (job.finished) return;
      job.finished = true;
      if (job.timer) {
        clearTimeout(job.timer);
      }
      if (activeTypeJob === job) {
        activeTypeJob = null;
      }
      resolve();
    };
  });

  activeTypeJob = job;

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;

  const flushRemaining = () => {
    if (job.finished) return;

    // Finish current and remaining lines instantly
    while (lineIndex < queue.length) {
      const line = queue[lineIndex];

      if (!currentLineEl) {
        currentLineEl = document.createElement("div");
        currentLineEl.className = "line";
        output.appendChild(currentLineEl);
      }

      currentLineEl.textContent += line.slice(charIndex);
      lineIndex += 1;
      charIndex = 0;
      currentLineEl = null;
    }

    scrollToBottom();
    job.finish();
  };

  job.flushNow = flushRemaining;

  const typeNextChar = () => {
    if (job.finished) return;

    if (lineIndex >= queue.length) {
      scrollToBottom();
      job.finish();
      return;
    }

    const line = queue[lineIndex];

    if (!currentLineEl) {
      currentLineEl = document.createElement("div");
      currentLineEl.className = "line";
      output.appendChild(currentLineEl);
    }

    if (line.length === 0) {
      lineIndex += 1;
      charIndex = 0;
      currentLineEl = null;
      job.timer = setTimeout(typeNextChar, charDelay);
      return;
    }

    currentLineEl.textContent += line[charIndex];
    charIndex += 1;
    scrollToBottom();

    if (charIndex >= line.length) {
      lineIndex += 1;
      charIndex = 0;
      currentLineEl = null;
    }

    job.timer = setTimeout(typeNextChar, charDelay);
  };

  job.timer = setTimeout(typeNextChar, charDelay);

  // handleCommand will `await printLines(...)`
  return job.done;
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

async function logAndRespond(raw, responseLines, charDelay = 10) {
  // Echo the command instantly (feels more like a real terminal)
  appendPromptLine(raw);
  await printLines(responseLines, charDelay);
}

async function handleCommand(rawInput) {
  const command = rawInput.trim();

  // Only add non-empty commands to history for recall navigation.
  if (command) {
    history.push(command);
    historyIndex = history.length;
  }

  appendPromptLine(rawInput);

  if (!command) {
    scrollToBottom();
    return;
  }

  const parts = command.split(/\s+/);
  const [cmdRaw, ...args] = parts;
  const lowerCmd = (cmdRaw || "").toLowerCase();

  // --- Executable handling (about / about.exe) -------------------------
  let sectionKey = lowerCmd.replace(/\.exe$/, ""); // strip ".exe" if present

  if (sections[sectionKey]) {
    showPanel(sectionKey);
    await printLines(
      [`executing ./${sectionKey}.exe`],
      20 // typing speed for section “launch” text
    );
    scrollToBottom();
    return;
  }

  // --- Named Commands --------------------------------------------------
  switch (lowerCmd) {
    case "help":
      await printLines(
        [
          "Available commands:",
          "  help                   - show this help menu",
          "  ls                     - list available sections",
          "  <name> or <name>.exe   - execute a section (about, projects, contact, history)",
          "  theme list             - list available color themes",
          "  theme randomhex        - apply a random color theme for bg and text",
          "  theme <name>           - apply a named theme",
          "  theme <bg> <text>      - apply custom hex colors",
          "  clear                  - clear the terminal",
          "  press ↑ / ↓            - navigate prompt history",
          "",
        ],
        15
      );
      break;

    case "theme": {
      if (args.length === 1 && args[0].toLowerCase() === "list") {
        await printLines(
          [
            "available themes:",
            ...Object.keys(themes).map((name) => `  - ${name}`),
          ],
          12
        );
        break;
      }

      if (args.length === 1 && args[0].toLowerCase() === "randomhex") {
        const randomHex = () => {
          const hex = Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0");
          return `#${hex}`;
        };
        const bgHex = randomHex();
        const textHex = randomHex();
        applyTheme(bgHex, textHex);
        await printLines(
          [`applied random theme: bg=${bgHex}, text=${textHex}`],
          12
        );
        break;
      }

      if (args.length === 1) {
        const name = args[0].toLowerCase();
        const selected = themes[name];
        if (selected) {
          applyTheme(selected.bg, selected.text);
          await printLines([`applied theme: ${name}`], 12);
        } else {
          await printLines(
            [
              `theme: "${args[0]}" not recognized`,
              "use: theme list",
              "or:  theme randomhex",
              "or:  theme <name>",
              "or:  theme <bg-hex> <text-hex>",
            ],
            12
          );
        }
        break;
      }

      if (args.length === 2) {
        const [bgHex, textHex] = args;
        if (isHexColor(bgHex) && isHexColor(textHex)) {
          applyTheme(bgHex, textHex);
          await printLines(
            [`applied custom theme: bg=${bgHex}, text=${textHex}`],
            12
          );
        } else {
          await printLines(
            [
              `theme: "${args.join(" ")}" not recognized`,
              "use: theme list",
              "or:  theme <name>",
              "or:  theme <bg-hex> <text-hex>",
            ],
            12
          );
        }
        break;
      }

      await printLines(
        [
          `theme: "${args.join(" ")}" not recognized`,
          "use: theme list",
          "or:  theme <name>",
          "or:  theme <bg-hex> <text-hex>",
        ],
        12
      );
      break;
    }

    case "ls":
      await printLines(
        ["about.exe   projects.exe   contact.exe   history.exe"],
        10
      );
      break;

    case "clear":
      output.innerHTML = "";
      closePanel();
      break;

    case "sudo hire rylen":
      await printLines(["Permission granted. Rylen has been hired! 🎉"], 25);
      break;

    default:
      await printLines([`command not found: ${cmdRaw}`], 10);
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
  printLines(welcome, 25);
}

input.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const rawValue = input.value;
    input.value = "";

    // If something is currently typing, flush it first
    if (activeTypeJob) {
      const job = activeTypeJob;
      job.flushNow();
      await job.done; // wait until the flush is fully complete
    }

    // Now safely process the new command
    await handleCommand(rawValue);
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
