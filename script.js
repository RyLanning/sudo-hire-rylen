const output = document.getElementById("output");
const input = document.getElementById("cmdInput");
const panel = document.getElementById("panel");
const panelScroll = document.getElementById("panelScroll");
const promptText = "[hiringagent@sudo_hire_rylen ~]$";
const myBirthDay = new Date(2003, 6, 25); // June 25, 2003
const myAge = Math.floor(
  (Date.now() - myBirthDay.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
);
const industryStartDate = new Date(2023, 8, 14); // September 14, 2023
const myExperienceYears = (
  (Date.now() - industryStartDate.getTime()) /
  (1000 * 60 * 60 * 24 * 365.25)
).toFixed(1);
let activeTypeJob = null;
const themes = {
  matrix: { bg: "#000000", text: "#00ff66", prompt: "#ffffff" },
  amber: { bg: "#000000", text: "#ffbf00", prompt: "#ff8000" },
  ice: { bg: "#001018", text: "#a8ffff", prompt: "#6671efff" },
  light: { bg: "#f5f5f5", text: "#111111", prompt: "#000000" },
};

const sections = {
  about: `
    <p>Hi, I'm Rylen!</p>
    <p>
      I'm a ${myAge} year old software developer with ${myExperienceYears} years of industry experience.
      When I was in elementary school, I learned to open the browser developer tools while bored in typing class, 
      and taught myself HTML/CSS by reading other websites' code. I created my first simple website when I was 10,
      a simple matrix-themed 'about me' page - only on localhost back then!
      I've been in love with software development since, and that's part of how I got the idea for this terminal-style portfolio!
      I specialize in full-stack development of modern, accessible, and performant web applications, and I have experience in many
      technologies. 
      I graduated from University of Nebraska-Lincoln in 2025 with a Bachelor's degree in Software Development, where I learned a 
      wide range of software engineering principles and practices.
    </p>
    <p>
      I pride myself on my user-centric approach to development, attention to detail, and my ability to learn new technologies quickly.
      I'm always excited to take on new challenges and collaborate with others to create innovative and impactful software solutions.
    </p>
    <p>
      When I'm not coding, I enjoy hiking, photography, board games, videogames, and spending time with friends and family.
      I love games and puzzles that challenge my problem-solving skills, and I often find inspiration for my development work
      from game design principles. My desk is always covered in rubix cubes and puzzle toys!
    </p>
    <p>
      I've worked with a ton of different technologies over the years in various domains, and I'm always eager to learn more!
      Here are some of the skills I bring to the table:
    </p>
    <div class="skills">
      <span class="pill">JavaScript</span>
      <span class="pill">CSS / Animations</span>
      <span class="pill">Python</span>
      <span class="pill">PHP</span>
      <span class="pill">GoLang</span>
      <span class="pill">HTML5</span>
      <span class="pill">GitHub</span>
      <span class="pill">React</span>
      <span class="pill">Python for Data Science</span>
      <span class="pill">Python for Machine Learning</span>
      <span class="pill">SQL</span>
      <span class="pill">AWS/Azure</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">UI Design</span>
      <span class="pill">System Design</span>
    </div>
  `,
  projects: `
    <div class="project-grid">
      <div class="project-card">
        <strong>TODO: ADD PROJECT TITLE</strong>
        <p>TODO: ADD PROJECT DESCRIPTION</p>
        <a href="#" aria-label="TODO: ADD PROJECT LINK">TODO: ADD PROJECT LINK</a>
      </div>
    </div>
  `,
  contact: `
    <p>Always happy to chat about collaborations, UI ideas, or cool developer tools.</p>
    <div class="contact-links">
      <div class="contact-link"><a href="mailto:rylen.lanning@gmail.com">✉️ rylen.lanning@gmail.com</a></div>
      <div class="contact-link"><a href="#" target="_blank" rel="noreferrer noopener">TODO: UPDATE BELOW LINKS</a></div>
      <div class="contact-link"><a href="https://github.com/" target="_blank" rel="noreferrer noopener">GitHub</a></div>
      <div class="contact-link"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">LinkedIn</a></div>
    </div>
  `,
  history: `
    <div class="timeline">
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
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

function applyTheme(bg, text, prompt) {
  document.documentElement.style.setProperty("--bg-color", bg);
  document.documentElement.style.setProperty("--text-color", text);
  document.documentElement.style.setProperty("--prompt-color", prompt);
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
  panelScroll.innerHTML = `
    <div class="panel-header">/ ${sectionKey} -----------------------------------</div>
    <div class="panel-body">${content}</div>
    <div class="panel-footer">---------------------------------------------</div>
  `;
  panel.classList.remove("hidden");
  currentSection = sectionKey;
}

function closePanel() {
  panelScroll.innerHTML = "";
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
          "help",
          "    show this help menu",
          "",
          "ls",
          "    list available sections",
          "",
          "<name> or <name>.exe",
          "    execute a section (about, projects, contact, history)",
          "",
          "theme list",
          "    list available color themes",
          "",
          "theme randomhex",
          "    apply a random color theme for bg and text",
          "",
          "theme <name>",
          "    apply a named theme",
          "",
          "theme <bg> <text> <prompt>",
          "    apply custom hex colors",
          "",
          "clear",
          "    clear the terminal",
          "",
          "press ↑ / ↓",
          "    navigate prompt history",
          "",
        ],
        20
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
        const promptHex = randomHex();
        applyTheme(bgHex, textHex, promptHex);
        await printLines(
          [
            `applied random theme: bg=${bgHex}, text=${textHex}, prompt=${promptHex}`,
          ],
          12
        );
        break;
      }

      if (args.length === 1) {
        const name = args[0].toLowerCase();
        const selected = themes[name];
        if (selected) {
          applyTheme(selected.bg, selected.text, selected.prompt);
          await printLines([`applied theme: ${name}`], 12);
        } else {
          await printLines(
            [
              `theme: "${args[0]}" not recognized`,
              "use: theme list",
              "or:  theme randomhex",
              "or:  theme <name>",
              "or:  theme <bg-hex> <text-hex> <prompt-hex>",
            ],
            12
          );
        }
        break;
      }

      if (args.length === 2) {
        const [bgHex, textHex] = args;
        if (isHexColor(bgHex) && isHexColor(textHex)) {
          applyTheme(bgHex, textHex, textHex);
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

    case "whoami":
      await printLines(
        ["Hopefully a hiring agent, and you're about to hire me! ;)"],
        25
      );
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
