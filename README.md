# 💖 Valentine Proposal Website 💖

A fun, interactive Valentine website built with **HTML, CSS, and JavaScript** — featuring playful questions, moving buttons, dynamic GIF reactions, background music, and a celebratory finale 🎉💝

---

## 🌟 Features

- 💕 Interactive **Yes / No questions**
- 😈 “No” button that **runs away**
- 🎬 **Dynamic reaction GIFs** on every “No”
- 🎵 Background music (local MP3 support)
- ❤️ Love meter slider with surprise overflow
- 🎉 Celebration screen with animations
- ⚙️ Fully configurable via `config.js`

---

## 🗂️ Project Structure
``
valentine-project/
│
├── index.html # Main HTML file
├── style.css # Styling and animations
├── script.js # Core logic & interactions
├── config.js # Custom text, GIFs, music, colors
├── theme.js # Theme & color handling
│
├── music/
│ └── Gehra_hua.mp3
│
├── images/ # (Optional) local images
└── README.md
``

---

## 🚀 How to Run Locally

### Option 1: Using VS Code Live Server (Recommended)

1. Open the project folder in **VS Code**
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

### Option 2: Open directly

You can also double-click `index.html`, but some features (music/GIFs) work best with Live Server.

---

## ⚙️ Configuration (`config.js`)

You can customize everything from one place.

### ✨ Example

```js
valentineName: "Disha",

pageTitle: "Will You Be My Valentine? 💝💖💝",

questions: {
  first: {
    text: "Do you like me?",
    yesBtn: "Yes",
    noBtn: "No",
    secretAnswer: "I don't like you, I love you! ❤️",
    noSteps: [
      { gifId: "16882350712313044153", text: "Do you like me? 🥺" },
      { gifId: "25672197", text: "Aww… why no? 😭" },
      { gifId: "20695333", text: "Are you 100% sure? 😢💔" },
      { gifId: "22609185", text: "Okay last chance… 😭❤️" }
    ]
  }
}

## 🎵 Background Music

Supports **local MP3 files**.


```
music/
└── Gehra_hua.mp3
```

```
music: {
  enabled: true,
  autoplay: true,
  musicUrl: "music/Gehra_hua.mp3",
  startText: "🎵 Play Music",
  stopText: "🔇 Stop Music",
  volume: 0.5
}
```

### ⚠️ Note: Browsers may require user interaction before audio plays.

## 💡 Tips

- Use **Live Server** to avoid CORS/audio issues
- Keep file names **lowercase & space-free**
- Use `\n` + CSS `white-space: pre-line` for multi-line text
- Prefer local **MP4/GIFs** for 100% reliability if needed

---

## ❤️ Customization Ideas

- Add personal images
- Replace GIFs with inside jokes
- Add a countdown timer
- Add confetti / fireworks animation
- Deploy on **GitHub Pages**

---

## 📸 Preview

> 💌 A playful, romantic experience designed to make your Valentine smile.

https://myvalentinegiftforyou.netlify.app/
---

## 📜 License

This project is for **personal and educational use**.  
GIFs and media belong to their respective owners.

---

## 💖 Made with Love

Built with ❤️ to create a memorable Valentine’s moment.
