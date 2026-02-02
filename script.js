// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, my मोदक🧄`;
    
    // Set first question texts
    if (config.questions.first.noSteps && config.questions.first.noSteps.length > 0) {
  document.getElementById('question1Text').textContent = config.questions.first.noSteps[0].text;

  // only if you added <div id="gifContainer1"></div> in HTML
  renderTenorGif('gifContainer1', config.questions.first.noSteps[0].gifId);
} else {
  document.getElementById('question1Text').textContent = config.questions.first.text;
}
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();

    // Setup music player
    setupMusicPlayer();
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    // Create hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Create bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

// Function to move the "No" button when clicked
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

const noClickState = {}; // track per question

function ensureTenorLoaded() {
  return new Promise((resolve, reject) => {
    // If already ready
    if (window.TenorEmbed?.init) return resolve();

    // If script exists, wait for it
    const script = document.getElementById("tenorScript");
    if (!script) {
      return reject(new Error("Tenor script tag (#tenorScript) not found in HTML"));
    }

    const start = Date.now();
    const timer = setInterval(() => {
      if (window.TenorEmbed?.init) {
        clearInterval(timer);
        resolve();
      } else if (Date.now() - start > 5000) {
        clearInterval(timer);
        reject(new Error("TenorEmbed.init not available after 5s (script blocked or duplicated?)"));
      }
    }, 50);
  });
}

function reloadTenorScriptAndInit() {
  return new Promise((resolve) => {
    // Remove existing script tag(s)
    const scripts = [...document.querySelectorAll('script[src*="tenor.com/embed.js"]')];
    scripts.forEach(s => s.remove());

    // Add fresh script
    const s = document.createElement("script");
    s.src = "https://tenor.com/embed.js";
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

async function renderTenorGif(containerId, gifId, aspectRatio = "1") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Force a truly new embed node
  container.innerHTML = `
    <div class="tenor-gif-embed"
         data-postid="${gifId}"
         data-share-method="host"
         data-aspect-ratio="${aspectRatio}"
         data-width="100%"></div>
  `;

  // ✅ If TenorEmbed exists, use it
  if (window.TenorEmbed && typeof window.TenorEmbed.init === "function") {
    window.TenorEmbed.init();
    return;
  }

  // ✅ Otherwise reload embed.js (forces Tenor to scan again)
  await reloadTenorScriptAndInit();
}



function handleNo(qNum) {
  // Move the "No" button
  const noBtn = document.getElementById(`noBtn${qNum}`);
  if (noBtn) moveButton(noBtn);

  // Load steps from config
  const steps =
    qNum === 1 ? config.questions.first.noSteps :
    qNum === 2 ? config.questions.second.noSteps :
    qNum === 3 ? config.questions.third.noSteps :
    qNum === 4 ? config.questions.fourth.noSteps :
    null;

  if (!steps || steps.length === 0) return;

  // Advance click state
  noClickState[qNum] = (noClickState[qNum] ?? 0) + 1;
  const idx = Math.min(noClickState[qNum], steps.length - 1);

  // Update text
  const textEl = document.getElementById(`question${qNum}Text`);
  if (textEl) textEl.textContent = steps[idx].text;

  // Update gif
  renderTenorGif(`gifContainer${qNum}`, steps[idx].gifId);
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

// Music Player Setup
// Music Player Setup
function setupMusicPlayer() {
  const musicControls = document.getElementById("musicControls");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicSource = document.getElementById("musicSource");

  // Only show controls if music is enabled in config
  if (!config.music.enabled) {
    if (musicControls) musicControls.style.display = "none";
    return;
  }

  // ✅ Use local MP3 (example: "music/love-song.mp3")
  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.loop = config.music.loop ?? true; // optional
  bgMusic.load();

  const setButtonText = () => {
    musicToggle.textContent = bgMusic.paused
      ? config.music.startText
      : config.music.stopText;
  };

  const tryPlay = async () => {
    try {
      await bgMusic.play();
      setButtonText();
      return true;
    } catch (e) {
      // Autoplay blocked
      console.log("Autoplay prevented by browser:", e);
      setButtonText();
      return false;
    }
  };

  // ✅ If autoplay is enabled, try it. If blocked, play on first user interaction.
  if (config.music.autoplay) {
    tryPlay().then((played) => {
      if (!played) {
        const resumeOnFirstInteraction = () => {
          tryPlay();
          window.removeEventListener("pointerdown", resumeOnFirstInteraction);
          window.removeEventListener("keydown", resumeOnFirstInteraction);
          window.removeEventListener("touchstart", resumeOnFirstInteraction);
        };

        // One-time user gesture listeners (covers desktop + mobile)
        window.addEventListener("pointerdown", resumeOnFirstInteraction, { once: true });
        window.addEventListener("touchstart", resumeOnFirstInteraction, { once: true });
        window.addEventListener("keydown", resumeOnFirstInteraction, { once: true });

        // Optional: show user a hint via button text
        musicToggle.textContent = config.music.startText; // like "Tap to play 🎵"
      }
    });
  } else {
    setButtonText();
  }

  // Toggle music on button click
  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      await tryPlay();
    } else {
      bgMusic.pause();
      setButtonText();
    }
  });
}
