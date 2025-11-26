const output = document.getElementById("output");
const input = document.getElementById("cmdInput");
const panel = document.getElementById("panel");
const panelScroll = document.getElementById("panelScroll");
const terminal = document.querySelector(".terminal");
const mainInteractiveContainer = document.getElementById(
  "interactiveContainer"
);
const overviewContainer = document.getElementById("overviewMode");
const overviewGrid = document.getElementById("overviewGrid");
const overviewExitBtn = document.getElementById("returnToTerminal");
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
const history = [];
let historyIndex = -1;
let currentSection = null;
let snakeGame = null;
let mazeState = null;
let camState = null;
let overviewActive = false;
let panelHiddenBeforeOverview = true;

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
      <span class="pill">System Design</span>
    </div>
  `,
  projects: `
    <div class="project-grid">
      <div class="project-card">
        <strong>This Website</strong>
        <p>You're lookin at it! Here's some hidden features if you haven't discovered them yet.</p>
        <ul>
          <li>Try the command: <code>sl</code> for a fun easter egg!</li>
          <li>Randomize the color theme with the <code>theme random</code> command. Beware - it's not guaranteed to look good!</li>
          <li>Use <code>whoami</code> to see a fun response.</li>
        </ul>
        <a href="https://github.com/RyLanning/sudo-hire-rylen" target="_blank" aria-label="View this project on GitHub">View on GitHub</a>
      </div>
      <div class="project-card">
        <strong>This Website</strong>
        <p>You're lookin at it! Here's some hidden features if you haven't discovered them yet.</p>
        <ul>
          <li>Try the command: <code>sl</code> for a fun easter egg!</li>
          <li>Randomize the color theme with the <code>theme random</code> command. Beware - it's not guaranteed to look good!</li>
          <li>Use <code>whoami</code> to see a fun response.</li>
        </ul>
        <a href="https://github.com/RyLanning/sudo-hire-rylen" target="_blank" aria-label="View this project on GitHub">View on GitHub</a>
      </div>
      <div class="project-card">
        <strong>This Website</strong>
        <p>You're lookin at it! Here's some hidden features if you haven't discovered them yet.</p>
        <ul>
          <li>Try the command: <code>sl</code> for a fun easter egg!</li>
          <li>Randomize the color theme with the <code>theme random</code> command. Beware - it's not guaranteed to look good!</li>
          <li>Use <code>whoami</code> to see a fun response.</li>
        </ul>
        <a href="https://github.com/RyLanning/sudo-hire-rylen" target="_blank" aria-label="View this project on GitHub">View on GitHub</a>
      </div>
      <div class="project-card">
        <strong>This Website</strong>
        <p>You're lookin at it! Here's some hidden features if you haven't discovered them yet.</p>
        <ul>
          <li>Try the command: <code>sl</code> for a fun easter egg!</li>
          <li>Randomize the color theme with the <code>theme random</code> command. Beware - it's not guaranteed to look good!</li>
          <li>Use <code>whoami</code> to see a fun response.</li>
        </ul>
        <a href="https://github.com/RyLanning/sudo-hire-rylen" target="_blank" aria-label="View this project on GitHub">View on GitHub</a>
      </div>
    </div>
  `,
  contact: `
    <p>Always happy to chat about collaborations, UI ideas, or cool developer tools.</p>
    <div class="contact-links">
      <div class="contact-link"><a href="mailto:rylen.lanning@gmail.com">✉️ rylen.lanning@gmail.com</a></div>
      <div class="contact-link"><a href="https://github.com/RyLanning" target="_blank" rel="noreferrer noopener">GitHub Profile</a></div>
      <div class="contact-link"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">LinkedIn</a></div>
    </div>
  `,
  history: `
    <div class="timeline">
      <div class="timeline-item"><strong>2000 - 2000</strong><br/>TODO: ADD HISTORY</div>
      <div class="timeline-item"><strong>Aug. 2023 - Current</strong>
      <br/>SE</div>
      <div class="timeline-item"><strong>Jan. 2023 - Aug. 2023</strong>
      <br/>Head Host at Lazlo's restaurant. Fun times!</div>
      <div class="timeline-item"><strong>Aug. 2019 - Jan. 2023</strong>
      <br/>Custodial work and some rudimentary website maintenence (using WordPress) for Adultspan counseling.</div>
      <div class="timeline-item"><strong>June 2003</strong>
      <br/>Just got here, no prior experience.</div>
    </div>
  `,
};

const welcome = [
  "booting portfolio shell...",
  "This is a simulated terminal environment designed to showcase my skills and projects!",
  "Feel free to explore and interact using terminal commands.",
  "If you would rather view a traditional portfolio, type 'overview' and hit enter.",
  "You can always return to the terminal by clicking the '>_Reactive Terminal' button in the overview mode.",
  "I'll get you started with the 'help' command to show you available commands.",
];

const helpLinesArray = [
  "Available commands:",
  "| overview",
  "|     simplify the site by toggling a scrollable portfolio overview",
  "|     run this command if you prefer a traditional portfolio layout",
  "|",
  "| help",
  "|     show this help menu",
  "|",
  "| ls",
  "|     list available sections",
  "|",
  "| <name>  |  ./<name>  |  <name>.exe",
  "|     use any of the above to execute a section",
  "|     (e.g. 'about', './projects', 'contact.exe')",
  "|",
  "| theme list",
  "|     list available color themes",
  "|",
  "| theme <name>",
  "|     apply a named theme",
  "|     (e.g. 'theme light')",
  "|",
  "| theme <bg> <text> <prompt>",
  "|     apply custom hex colors",
  "|     (e.g. 'theme #000000 #00ff00 #ffffff')",
  "|",
  "| maze <size>",
  "|     generate & play an ASCII maze (size 10-50)",
  "|     (e.g. 'maze 20', generates a 20x20 maze)",
  "|",
  "| snake",
  "|     play ASCII Snake!",
  "|",
  "| clear",
  "|     clear the terminal",
  "|",
  "| press ↑ / ↓",
  "|     navigate prompt history",
  "",
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

  // if no delay just dump everything
  if (!charDelay || charDelay <= 0) {
    queue.forEach((line) => appendLine(line));
    scrollToBottom();
    return Promise.resolve();
  }

  // job state keeps track of typing progress and allows interruption with flush
  const job = {
    timer: null,
    finished: false,
    flushNow: () => {},
    finish: () => {},
    done: null,
  };

  // resolve process when job is finished
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

function runSteamLocomotive() {
  const trainLines = [
    "      ====        ________                ___________ ",
    "  _D _|  |_______/        \\__I_I_____===__|_________| ",
    "   |(_)---  |   H\\________/ |   |        =|___ ___|   ",
    "   /     |  |   H  |  |     |   |         ||_| |_||   ",
    "  |      |  |   H  |__--------------------| [___] |   ",
    "  | ________|___H__/__|_____/[][]~\\_______|       |   ",
    "  |/ |   |-----------I_____I [][] []  D   |=======|__ ",
    "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ",
    " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
    " \\_/      \\O=====O=====O=====O_/      \\_/             ",
  ];

  return new Promise((resolve) => {
    const wrap = document.createElement("div");
    wrap.className = "train";
    wrap.textContent = trainLines.join("\n");
    wrap.style.transform = "translateX(0px)";
    wrap.style.willChange = "transform";

    output.appendChild(wrap);
    scrollToBottom();

    const startX = output.clientWidth || 600;
    let x = startX;

    const animate = () => {
      x -= 8; // speed per frame
      wrap.style.transform = `translateX(${x}px)`;
      scrollToBottom();
      const offscreen = x + wrap.offsetWidth < -40;
      if (!offscreen) {
        requestAnimationFrame(animate);
      } else {
        wrap.remove();
        resolve();
      }
    };

    requestAnimationFrame(() => {
      wrap.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animate);
    });
  });
}

// --- ASCII Camera ----------------------------------------------------
async function startAsciiCam() {
  if (camState) {
    appendLine("camera already active. Press ESC to stop.");
    scrollToBottom();
    return;
  }

  let abortedInteractive = false;
  if (snakeGame) {
    endSnakeGame({ reason: "abort" });
    abortedInteractive = true;
  }
  if (mazeState) {
    endMaze("abort");
    abortedInteractive = true;
  }
  if (abortedInteractive) {
    appendLine("previous interactive mode aborted.");
    scrollToBottom();
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    appendLine("camera not supported in this browser.");
    scrollToBottom();
    return;
  }

  input.disabled = true;
  input.blur();

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (error) {
    appendLine("could not access camera (permission denied or error).");
    input.disabled = false;
    input.focus();
    scrollToBottom();
    return;
  }

  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.muted = true;
  video.srcObject = stream;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    appendLine("camera not supported in this browser.");
    stream.getTracks().forEach((track) => track.stop());
    input.disabled = false;
    input.focus();
    scrollToBottom();
    return;
  }

  const container = document.createElement("div");
  container.className = "cam-container";
  const note = document.createElement("div");
  note.className = "cam-note";
  note.textContent = "ASCII camera active — press ESC to exit.";
  const asciiEl = document.createElement("pre");
  asciiEl.className = "cam-ascii";
  asciiEl.textContent = "initializing camera...";
  container.appendChild(note);
  container.appendChild(asciiEl);
  output.appendChild(container);
  scrollToBottom();

  const baseWidth = Math.max(
    40,
    Math.min(
      120,
      Math.floor(((output && output.clientWidth) || 640) / 7)
    )
  );
  const charAspect = 0.55; // characters are taller than they are wide
  let sampleWidth = baseWidth;
  let sampleHeight = Math.max(20, Math.round(baseWidth * charAspect));

  const state = {
    stream,
    video,
    canvas,
    ctx,
    asciiEl,
    running: true,
    animationFrameId: null,
    keyHandler: null,
    container,
    sampleWidth,
    sampleHeight,
  };

  const density = " .:-=+*#%@";
  let lastFrameTime = 0;

  const renderFrame = (ts = 0) => {
    if (!camState || !camState.running) return;
    if (ts - lastFrameTime < 66) {
      camState.animationFrameId = requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime = ts;

    const { sampleWidth: w, sampleHeight: h } = camState;
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(video, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    let ascii = "";
    for (let y = 0; y < h; y++) {
      let line = "";
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const charIdx = Math.min(
          density.length - 1,
          Math.floor((lum / 255) * (density.length - 1))
        );
        line += density[charIdx];
      }
      ascii += line;
      if (y < h - 1) ascii += "\n";
    }

    asciiEl.textContent = ascii;
    camState.animationFrameId = requestAnimationFrame(renderFrame);
  };

  const startRender = () => {
    if (!camState || !camState.running) return;
    renderFrame();
  };

  const keyHandler = (event) => {
    if (!camState) return;
    if (
      [
        "Escape",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(event.key)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "Escape") {
      stopAsciiCam();
    }
  };

  state.keyHandler = keyHandler;
  camState = state;
  window.addEventListener("keydown", keyHandler, true);

  const handleReady = () => {
    const aspect =
      video.videoHeight && video.videoWidth
        ? video.videoHeight / video.videoWidth
        : 0.75;
    sampleHeight = Math.max(
      20,
      Math.round(baseWidth * aspect * charAspect)
    );
    camState.sampleWidth = sampleWidth;
    camState.sampleHeight = sampleHeight;
    video.width = video.videoWidth;
    video.height = video.videoHeight;
    startRender();
  };

  if (video.readyState >= 2) {
    handleReady();
  } else {
    video.addEventListener("loadedmetadata", handleReady, { once: true });
  }

  try {
    await video.play();
  } catch (error) {
    appendLine("could not access camera (permission denied or error).");
    stopAsciiCam();
  }
}

function stopAsciiCam() {
  if (!camState) return;
  const { stream, animationFrameId, keyHandler, container, video } = camState;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  camState.running = false;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (video) {
    video.pause();
    video.srcObject = null;
  }
  if (keyHandler) {
    window.removeEventListener("keydown", keyHandler, true);
  }
  if (container && container.parentNode === output) {
    container.remove();
  }

  camState = null;
  input.disabled = false;
  input.focus();
  appendLine("ASCII camera stopped.");
  scrollToBottom();
}

// --- Snake Game -------------------------------------------------------
function renderSnakeGrid(state) {
  const { width, height, snake, food, gridEl } = state;
  const rows = Array.from({ length: height }, () => Array(width).fill("·"));

  // place food
  rows[food.y][food.x] = "o";

  // place snake body/head
  snake.forEach((segment, idx) => {
    rows[segment.y][segment.x] = idx === 0 ? "@" : "#";
  });

  const lines = rows.map((row) => row.join(""));
  gridEl.textContent = lines.join("\n");
}

function endSnakeGame(result) {
  if (!snakeGame) return;
  const { container, intervalId, keyHandler, resolveGame, state } = snakeGame;
  clearInterval(intervalId);
  window.removeEventListener("keydown", keyHandler, true);
  snakeGame = null;

  if (container && container.parentNode === output) {
    container.remove();
  }

  const highScore = Math.max(state.score, state.highScore || 0);
  localStorage.setItem("snakeHighScore", String(highScore));
  appendLine(`Game over — Score: ${state.score}, High Score: ${highScore}`);

  input.disabled = false;
  input.focus();

  resolveGame();
}

function startSnakeGame() {
  if (snakeGame) return snakeGame.promise;

  input.disabled = true;
  input.blur();

  const container = document.createElement("div");
  container.className = "snake-wrap";

  const note = document.createElement("div");
  note.className = "snake-note";
  note.textContent = "Use arrow keys to move. Press ESC to quit.";
  container.appendChild(note);

  const gridEl = document.createElement("pre");
  gridEl.className = "snake-grid";
  container.appendChild(gridEl);

  output.appendChild(container);
  scrollToBottom();

  const width = 50;
  const height = 30;
  const placeFood = (w, h, snakeCells) => {
    while (true) {
      const x = Math.floor(Math.random() * w);
      const y = Math.floor(Math.random() * h);
      const occupied = snakeCells.some((c) => c.x === x && c.y === y);
      if (!occupied) return { x, y };
    }
  };

  const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  const snake = [center];
  let food = placeFood(width, height, snake);
  const highScore = parseInt(localStorage.getItem("snakeHighScore") || "0", 10);

  const state = {
    width,
    height,
    snake,
    dir: { x: 0, y: 0 },
    nextDir: { x: 0, y: 0 },
    started: false,
    food,
    score: 0,
    highScore,
    gridEl,
  };

  const handleDirection = (key) => {
    const dirs = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const next = dirs[key];
    if (!next) return;
    // avoid reversing direction
    const current = state.started ? state.dir : state.nextDir;
    if (next.x === -current.x && next.y === -current.y) return;
    state.nextDir = next;
    if (!state.started) {
      state.dir = next;
      state.started = true;
    }
  };

  const keyHandler = (event) => {
    if (!snakeGame) return;
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape"].includes(
        event.key
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === "Escape") {
      endSnakeGame({ reason: "quit" });
      return;
    }

    handleDirection(event.key);
  };

  const step = () => {
    if (!state.started) return;
    state.dir = state.nextDir;
    const head = { ...state.snake[0] };
    head.x += state.dir.x;
    head.y += state.dir.y;

    // collision with walls
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
      endSnakeGame({ reason: "wall" });
      return;
    }

    // collision with self
    if (state.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      endSnakeGame({ reason: "self" });
      return;
    }

    state.snake.unshift(head);

    const ateFood = head.x === state.food.x && head.y === state.food.y;
    if (ateFood) {
      state.score += 1;
      state.food = placeFood(width, height, state.snake);
    } else {
      state.snake.pop();
    }

    renderSnakeGrid(state);
  };

  renderSnakeGrid(state);

  window.addEventListener("keydown", keyHandler, true);
  const intervalId = setInterval(step, 100);

  let resolveGame;
  const promise = new Promise((res) => {
    resolveGame = res;
  });

  snakeGame = {
    container,
    intervalId,
    keyHandler,
    resolveGame,
    promise,
    state,
  };

  return promise;
}

// --- Maze Game -------------------------------------------------------
function generateMazeGrid(size) {
  const rows = size;
  const cols = size;
  const gridHeight = rows * 2 + 1;
  const gridWidth = cols * 2 + 1;
  const grid = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => "■")
  );

  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  const carve = (r, c) => {
    visited[r][c] = true;
    const gr = 2 * r + 1;
    const gc = 2 * c + 1;
    grid[gr][gc] = " ";

    const neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ].sort(() => Math.random() - 0.5);

    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr][nc]) continue;
      const wallR = (gr + (2 * nr + 1)) / 2;
      const wallC = (gc + (2 * nc + 1)) / 2;
      grid[wallR][wallC] = " ";
      carve(nr, nc);
    }
  };

  carve(0, 0);

  const startCell = { r: rows - 1, c: 0 };
  const goalCell = { r: 0, c: cols - 1 };
  grid[2 * startCell.r + 1][2 * startCell.c + 1] = " ";
  grid[2 * goalCell.r + 1][2 * goalCell.c + 1] = " ";

  return { grid, startCell, goalCell };
}

function renderMaze(state) {
  const { baseGrid, player, goal, visitedCells, pathCells, gridEl } = state;
  const rows = baseGrid.map((row) => row.slice());

  if (visitedCells) {
    visitedCells.forEach((key) => {
      const [r, c] = key.split(",").map(Number);
      rows[2 * r + 1][2 * c + 1] = "#";
    });
  }

  if (pathCells) {
    pathCells.forEach((key) => {
      const [r, c] = key.split(",").map(Number);
      rows[2 * r + 1][2 * c + 1] = "#";
    });
  }

  rows[2 * goal.r + 1][2 * goal.c + 1] = "G";
  rows[2 * player.r + 1][2 * player.c + 1] = "@";

  const lines = rows.map((row) => row.join(""));
  gridEl.textContent = lines.join("\n");
  scrollToBottom();
}

function endMaze(reason) {
  if (!mazeState) return;
  const { keyHandler, container } = mazeState;
  window.removeEventListener("keydown", keyHandler, true);
  // if (container && container.parentNode === output) {
  //   container.remove();
  // }
  mazeState = null;
  input.disabled = false;
  input.focus();

  if (reason === "abort") {
    appendLine("maze aborted.");
  } else if (reason === "win") {
    appendLine("maze completed!");
  } else if (reason === "auto") {
    appendLine("maze auto-solved.");
  }
}

function startMaze(size) {
  if (mazeState) {
    appendLine("maze already running. Press ESC to quit current maze.");
    return;
  }

  input.disabled = true;
  input.blur();

  const container = document.createElement("div");
  const note = document.createElement("div");
  note.className = "maze-note";
  note.textContent =
    "Use arrow keys to move. Press ESC to quit. Press 'S' to auto-solve.";
  const gridEl = document.createElement("pre");
  gridEl.className = "maze-output";
  container.appendChild(note);
  container.appendChild(gridEl);
  output.appendChild(container);
  scrollToBottom();

  const { grid: baseGrid, startCell, goalCell } = generateMazeGrid(size);
  const state = {
    size,
    baseGrid,
    player: { ...startCell },
    goal: { ...goalCell },
    gridEl,
    visitedCells: null,
    pathCells: null,
    solving: false,
  };

  const handleMazeKey = (event) => {
    if (!mazeState) return;
    const { key } = event;
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Escape",
        "s",
        "S",
      ].includes(key)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (key === "Escape") {
      endMaze("abort");
      return;
    }

    if (key === "s" || key === "S") {
      if (!state.solving) {
        autoSolveMaze(state);
      }
      return;
    }

    const moves = {
      ArrowUp: { r: -1, c: 0 },
      ArrowDown: { r: 1, c: 0 },
      ArrowLeft: { r: 0, c: -1 },
      ArrowRight: { r: 0, c: 1 },
    };
    const delta = moves[key];
    if (!delta) return;
    if (state.solving) return;

    const next = { r: state.player.r + delta.r, c: state.player.c + delta.c };

    if (!canStep(state, state.player, next)) {
      return;
    }
    state.player = next;
    renderMaze(state);
    if (next.r === state.goal.r && next.c === state.goal.c) {
      endMaze("win");
    }
  };

  mazeState = { state, container, keyHandler: handleMazeKey };
  window.addEventListener("keydown", handleMazeKey, true);

  renderMaze(state);
}

function canStep(state, from, to) {
  const { size, baseGrid } = state;
  const { r, c } = to;

  // bounds check in logical cell space
  if (r < 0 || r >= size || c < 0 || c >= size) return false;

  // convert logical cells to grid coords
  const fromGr = 2 * from.r + 1;
  const fromGc = 2 * from.c + 1;
  const toGr = 2 * to.r + 1;
  const toGc = 2 * to.c + 1;

  // find the wall cell between them
  const wallR = (fromGr + toGr) / 2;
  const wallC = (fromGc + toGc) / 2;

  // destination center must be open
  if (baseGrid[toGr][toGc] !== " ") return false;

  // and the wall between must also be open
  if (baseGrid[wallR][wallC] !== " ") return false;

  return true;
}

function autoSolveMaze(state) {
  state.solving = true;
  const startKey = `${state.player.r},${state.player.c}`;
  const goalKey = `${state.goal.r},${state.goal.c}`;

  const open = new Map();
  const fScore = new Map();
  const gScore = new Map();
  const cameFrom = new Map();
  const visited = new Set();
  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const heuristic = (r, c) =>
    Math.abs(r - state.goal.r) + Math.abs(c - state.goal.c);

  const setScores = (key, g, f) => {
    gScore.set(key, g);
    fScore.set(key, f);
    open.set(key, { g, f });
  };

  setScores(startKey, 0, heuristic(state.player.r, state.player.c));

  // slower for small mazes, faster for large mazes. Use maze size to scale.
  const ITERATIONS_PER_FRAME = Math.max(1, Math.floor(state.size / 5));

  const step = () => {
    if (!mazeState || mazeState.state !== state) return;

    for (let i = 0; i < ITERATIONS_PER_FRAME; i++) {
      if (open.size === 0) {
        renderMaze(state);
        appendLine("no path found.");
        state.solving = false;
        return;
      }

      let currentKey = null;
      let lowestF = Infinity;
      for (const [k, val] of open.entries()) {
        if (val.f < lowestF) {
          lowestF = val.f;
          currentKey = k;
        }
      }

      open.delete(currentKey);
      visited.add(currentKey);
      state.visitedCells = visited;

      if (currentKey === goalKey) {
        const path = [];
        let k = currentKey;
        while (cameFrom.has(k)) {
          path.push(k);
          k = cameFrom.get(k);
        }
        path.push(startKey);
        state.pathCells = new Set(path);
        // make sure in-between cells are also marked in path
        for (let pi = 0; pi < path.length - 1; pi++) {
          const [cr, cc] = path[pi].split(",").map(Number);
          const [nr, nc] = path[pi + 1].split(",").map(Number);
          const wallR = (cr + nr) / 2;
          const wallC = (cc + nc) / 2;
          state.pathCells.add(`${wallR},${wallC}`);
        }
        state.visitedCells = null;
        renderMaze(state);
        setTimeout(() => endMaze("auto"), 300);
        return;
      }

      const [cr, cc] = currentKey.split(",").map(Number);
      for (const [dr, dc] of neighbors) {
        const nr = cr + dr;
        const nc = cc + dc;

        if (!canStep(state, { r: cr, c: cc }, { r: nr, c: nc })) continue;

        const neighborKey = `${nr},${nc}`;
        if (visited.has(neighborKey)) continue;

        const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, currentKey);
          setScores(neighborKey, tentativeG, tentativeG + heuristic(nr, nc));
        }
      }
    }

    renderMaze(state);
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
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

function renderOverviewCards() {
  if (!overviewGrid) return;
  const cards = [
    { key: "about", title: "About" },
    { key: "history", title: "History" },
    { key: "projects", title: "Projects" },
    { key: "contact", title: "Contact" },
  ];
  const fragment = document.createDocumentFragment();
  cards.forEach(({ key, title }) => {
    const card = document.createElement("article");
    card.className = "overview-card";
    const heading = document.createElement("div");
    heading.className = "overview-card-title";
    heading.textContent = title;
    const body = document.createElement("div");
    body.className = "overview-card-body";
    body.innerHTML = sections[key];
    card.appendChild(heading);
    card.appendChild(body);
    fragment.appendChild(card);
  });
  overviewGrid.innerHTML = "";
  overviewGrid.appendChild(fragment);
}

function activateOverviewMode() {
  if (overviewActive) {
    appendLine("overview already active.");
    scrollToBottom();
    return;
  }

  let abortedInteractive = false;
  if (snakeGame) {
    endSnakeGame({ reason: "abort" });
    abortedInteractive = true;
  }
  if (mazeState) {
    endMaze("abort");
    abortedInteractive = true;
  }
  if (abortedInteractive) {
    appendLine("interactive game aborted (overview mode activated).");
    scrollToBottom();
  }

  overviewActive = true;
  panelHiddenBeforeOverview = panel.classList.contains("hidden");
  input.blur();
  input.disabled = true;

  if (terminal) {
    terminal.classList.add("hidden");
  }
  panel.classList.add("hidden");
  mainInteractiveContainer.classList.add("hidden");

  renderOverviewCards();
  if (overviewContainer) {
    overviewContainer.classList.remove("hidden");
  }

  window.scrollTo(0, 0);
}

function deactivateOverviewMode() {
  if (!overviewActive) return;
  overviewActive = false;

  if (overviewContainer) {
    overviewContainer.classList.add("hidden");
  }
  if (overviewGrid) {
    overviewGrid.innerHTML = "";
  }

  if (terminal) {
    terminal.classList.remove("hidden");
  }
  if (!panelHiddenBeforeOverview) {
    panel.classList.remove("hidden");
  }
  mainInteractiveContainer.classList.remove("hidden");

  input.disabled = false;
  input.focus();
  scrollToBottom();
}

async function logAndRespond(raw, responseLines, charDelay = 10) {
  appendPromptLine(raw);
  await printLines(responseLines, charDelay);
}

async function handleCommand(rawInput) {
  const command = rawInput.trim();

  // Only add non-empty commands to history
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

  let sectionKey = lowerCmd.replace(/\.exe$/, ""); // strip ".exe" or if present
  sectionKey = sectionKey.replace(/^\.\/ */, ""); // strip preceeding "./" or if present

  if (sections[sectionKey]) {
    showPanel(sectionKey);
    await printLines([`executing ./${sectionKey}.exe`], 20);
    scrollToBottom();
    return;
  }

  switch (lowerCmd) {
    case "help":
      await printLines(helpLinesArray, 20);
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

      if (args.length === 1 && args[0].toLowerCase() === "random") {
        const randomHex = () => {
          const hex = Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0");
          return `#${hex}`;
        };
        const bgHex = randomHex();
        const textHex = randomHex();
        const promptHex = randomHex();
        // TODO: make sure text and prompt are significantly different from the bg

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
              "or:  theme <name>",
              "or:  theme <bg-hex> <text-hex> <prompt-hex>",
            ],
            12
          );
        }
        break;
      }

      if (args.length === 3) {
        const [bgHex, textHex, promptHex] = args;
        if (isHexColor(bgHex) && isHexColor(textHex) && isHexColor(promptHex)) {
          applyTheme(bgHex, textHex, promptHex);
          await printLines(
            [
              `applied custom theme: bg=${bgHex}, text=${textHex}, prompt=${promptHex}`,
            ],
            12
          );
        } else {
          await printLines(
            [
              `theme: "${args.join(" ")}" not recognized`,
              "use: theme list",
              "or:  theme <name>",
              "or:  theme <bg-hex> <text-hex> <prompt-hex>",
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

    case "maze": {
      if (mazeState) {
        await printLines(
          ["maze already running. Press ESC to quit current maze."],
          10
        );
        break;
      }

      if (args.length !== 1 || Number.isNaN(Number(args[0]))) {
        await printLines(["usage: maze <size 10-50>"], 10);
        break;
      }

      const size = parseInt(args[0], 10);
      if (size < 10 || size > 50) {
        await printLines(
          ["usage: maze <size 10-50>", "error: size must be between 10 and 50"],
          10
        );
        break;
      }

      await printLines(
        [
          `generating ${size}x${size} maze...`,
          "All mazes are randomly generated and guaranteed solvable.",
          "The auto-solver uses A* pathfinding algorithm!",
        ],
        10
      );
      startMaze(size);
      break;
    }

    case "sl":
      await printLines(["You found an easter egg! Steam locomotive!"], 10);
      await runSteamLocomotive();
      break;

    case "snake":
      await printLines(["Launching Snake..."], 10);
      await startSnakeGame();
      break;

    case "cam": {
      if (camState) {
        await printLines(
          ["camera already active. Press ESC to stop."],
          10
        );
        break;
      }
      await printLines(["requesting camera access..."], 10);
      await startAsciiCam();
      break;
    }

    case "overview":
      if (overviewActive) {
        await printLines(["overview already active."], 15);
      } else {
        await printLines(["entering overview mode..."], 15);
        activateOverviewMode();
      }
      break;

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
  // print welcome message, wait to finish, then show help
  printLines(welcome, 10).then(() => {
    handleCommand("help");
  });
}

if (overviewExitBtn) {
  overviewExitBtn.addEventListener("click", () => {
    deactivateOverviewMode();
  });
}

input.addEventListener("keydown", async (event) => {
  if (overviewActive) {
    event.preventDefault();
    return;
  }
  if (mazeState || snakeGame || camState) {
    event.preventDefault();
    return;
  }
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
  if (overviewActive) return;
  if (event.target.closest("a")) return;
  input.focus();
});

boot();
