import { initFileManager } from './fileManager.js';

document.addEventListener("DOMContentLoaded", () => {
  let windowCounter = 0;
  const minimizedWindows = {};

  function restoreWindow(appName) {
    const win = minimizedWindows[appName];
    if (!win) return;
    win.style.pointerEvents = "auto";
    win.style.transition = "transform 0.3s, opacity 0.3s";
    win.style.transform = "scale(1)";
    win.style.opacity = "1";
    if (win.prevState) {
      win.style.width = win.prevState.width;
      win.style.height = win.prevState.height;
      win.style.top = win.prevState.top;
      win.style.left = win.prevState.left;
      win.style.position = win.prevState.position;
      win.style.zIndex = win.prevState.zIndex;
      win.style.borderRadius = win.prevState.borderRadius || "10px";
      const trashTop = win.querySelector('.trash-top');
      if (trashTop) trashTop.style.borderRadius = win.prevState.trashTopBorderRadius || "10px 10px 0 0";
    }
    setTimeout(() => {
      delete minimizedWindows[appName];
    }, 300);
  }

  function createWindow(appName, content = "", options = {}) {
    if (!options.allowMultiple && minimizedWindows[appName]) {
      restoreWindow(appName);
      return;
    }
    const template = document.querySelector(".window-template");
    const clone = template.cloneNode(true);
    clone.classList.remove("window-template");
    clone.style.display = "block";
    clone.classList.add("app-window");
    const uniqueAppName = `${appName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    clone.setAttribute("data-app", uniqueAppName);

    const offset = Math.random() * 40;
    const baseLeft = 100 + (windowCounter * offset);
    const baseTop = 100 + (windowCounter * offset);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const windowWidth = 800;
    const windowHeight = 500;
    const finalLeft = Math.min(baseLeft, screenWidth - windowWidth - 20);
    const finalTop = Math.min(baseTop, screenHeight - windowHeight - 10);

    clone.style.left = `${finalLeft}px`;
    clone.style.top = `${finalTop}px`;
    clone.style.zIndex = 1000000 + windowCounter;
    clone.querySelector(".window-title").innerHTML = appName;
    clone.querySelector(".text-content").innerHTML = content;

    document.querySelector(".windows").appendChild(clone);
    initWindow(clone, appName);
    windowCounter++;
    return clone;
  }

  function preventOverFlow() {
    const parentEl = document.querySelector('.windows');
    const windowEl = document.querySelector('.trash');

    const parentRect = parentEl.getBoundingClientRect();
    const windowRect = windowEl.getBoundingClientRect();

    let newLeft = windowEl.offsetLeft;
    let newTop = windowEl.offsetTop;
    let newWidth = windowEl.offsetWidth;
    let newHeight = windowEl.offsetHeight;

    if (windowRect.left < parentRect.left) {
      newLeft = 0;
    }
    if (windowRect.right > parentRect.right) {
      newLeft = parentRect.width - newWidth;
    }

    if (windowRect.top < parentRect.top) {
      newTop = 0;
    }
    if (windowRect.bottom > parentRect.bottom) {
      newTop = parentRect.height - newHeight;
    }

    windowEl.style.left = `${Math.max(0, newLeft)}px`;
    windowEl.style.top = `${Math.max(0, newTop)}px`;

    if (newWidth > parentRect.width) {
      windowEl.style.width = parentRect.width + "px";
      windowEl.style.left = "0px";
    }

    if (newHeight > parentRect.height) {
      windowEl.style.height = parentRect.height + "px";
      windowEl.style.top = "0px";
    }
  }

  function initWindow(windowEl, appName) {
    const resizers = windowEl.querySelectorAll(".resizer");
    const dragBar = windowEl.querySelector(".trash-top");
    const minimizeBtn = windowEl.querySelector(".minimize-btn");
    const fullBtn = windowEl.querySelector(".full-btn");
    const closeBtn = windowEl.querySelector(".close-btn");

    let active = null, startX, startY, startWidth, startHeight, startTop, startLeft;
    let isFullscreen = false;
    let prevState = {};

    function resize(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (active === "right") windowEl.style.width = `${startWidth + dx}px`;
      if (active === "left") {
        const newWidth = startWidth - dx;
        if (newWidth > 200) {
          windowEl.style.width = `${newWidth}px`;
          windowEl.style.left = `${startLeft + dx}px`;
        }
      }
      if (active === "bottom") windowEl.style.height = `${startHeight + dy}px`;
      if (active === "top") {
        const newHeight = startHeight - dy;
        const newTop = startTop + dy;
        if (newHeight > 150 && newTop >= 0) {
          windowEl.style.height = `${newHeight}px`;
          windowEl.style.top = `${newTop}px`;
        }
      }
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
      active = null;
    }

    resizers.forEach(resizer => {
      resizer.addEventListener("mousedown", e => {
        active = resizer.classList[1];
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;
        startTop = windowEl.offsetTop;
        startLeft = windowEl.offsetLeft;

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
      });
    });

    let isDragging = false, offsetX = 0, offsetY = 0;

    dragBar.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - windowEl.offsetLeft;
      offsetY = e.clientY - windowEl.offsetTop;
      windowEl.style.zIndex = 1000000 + windowCounter++;

      preventOverFlow()
    });

    document.addEventListener("mousemove", e => {
      if (isDragging) {
        windowEl.style.left = `${e.clientX - offsetX}px`;
        windowEl.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    minimizeBtn.addEventListener("click", () => {
      prevState = {
        width: windowEl.style.width,
        height: windowEl.style.height,
        top: windowEl.style.top,
        left: windowEl.style.left,
        position: windowEl.style.position,
        zIndex: windowEl.style.zIndex,
        borderRadius: windowEl.style.borderRadius,
        trashTopBorderRadius: windowEl.querySelector('.trash-top').style.borderRadius
      };
      windowEl.prevState = prevState;
      windowEl.style.transition = "transform 0.3s, opacity 0.3s";
      windowEl.style.transform = "scale(0.1)";
      windowEl.style.opacity = "0";
      setTimeout(() => {
        windowEl.style.pointerEvents = "none";
        minimizedWindows[appName] = windowEl;
      }, 300);
    });

    fullBtn.addEventListener("click", () => {
      if (!isFullscreen) {
        prevState = {
          width: windowEl.style.width,
          height: windowEl.style.height,
          top: windowEl.style.top,
          left: windowEl.style.left,
          position: windowEl.style.position,
          zIndex: windowEl.style.zIndex,
          borderRadius: windowEl.style.borderRadius,
          trashTopBorderRadius: windowEl.querySelector('.trash-top').style.borderRadius
        };

        windowEl.style.position = "fixed";
        windowEl.style.top = "0";
        windowEl.style.left = "0";
        windowEl.style.width = "100vw";
        windowEl.style.height = "100vh";
        windowEl.style.zIndex = 100000001;
        windowEl.style.borderRadius = "0px";
        const trashTop = windowEl.querySelector('.trash-top');
        if (trashTop) trashTop.style.borderRadius = "0px";

        isFullscreen = true;
        fullBtn.classList.remove("fa-square");
        fullBtn.classList.add("fa-window-restore");
      } else {
        windowEl.style.width = prevState.width;
        windowEl.style.height = prevState.height;
        windowEl.style.top = prevState.top;
        windowEl.style.left = prevState.left;
        windowEl.style.position = prevState.position;
        windowEl.style.zIndex = prevState.zIndex;
        windowEl.style.borderRadius = prevState.borderRadius || "10px";
        const trashTop = windowEl.querySelector('.trash-top');
        if (trashTop) trashTop.style.borderRadius = prevState.trashTopBorderRadius || "10px 10px 0 0";

        isFullscreen = false;
        fullBtn.classList.add("fa-square");
        fullBtn.classList.remove("fa-window-restore");
      }
    });

    closeBtn.addEventListener("click", () => {
      windowEl.remove();
    });
  }

  const appContent = {
    chrome: `<div style="width: 100%; height: 100%; "> <iframe  src="https://www.google.com/search?igu=1" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe>`,
    sheryians: `<div style="width: 100%; height: 100%; "> <iframe  src="https://sheryians.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    chatgpt: `<div style="width: 100%; height: 100%; "> <iframe  src="https://chatgpt.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    portfolio: `<div style="width: 100%; height: 100%; "> <iframe  src="https://chetram-portfolio.vercel.app" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    figma: `<div style="width: 100%; height: 100%; "> <iframe  src="https://www.figma.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    github: `<div style="width: 100%; height: 100%; "> <iframe  src="../assets/icons/v2 chetram patel inter.pdf" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    resume: `<div style="width: 100%; height: 100%; "> <iframe  src="assets/icons/v2%20chetram%20patel%20inter.pdf" width="100%" height="100%" style="border: none;" loading="lazy"></iframe>" </div>`,
    terminal: `<div class="fake-terminal"><div class="terminal-body"></div></div>`,
    file:`<div class="file-explorer" style="width:100%;height:100%;display:flex;flex-direction:column;">
      <div class="toolbar" style="padding:5px;display:flex;gap:5px;background:#f1f1f1;">
        <button class="create-folder">Create</button>
        <button class="open-btn" disabled>Open</button>
        <button class="copy-btn" disabled>Copy</button>
        <button class="cut-btn" disabled>Cut</button>
        <button class="paste-btn" disabled>Paste</button>
      </div>
      <div class="address-bar" style="padding:5px;background:#fafafa;border-bottom:1px solid #ddd;">
        <span class="path"></span>
      </div>
      <div class="main" style="display:flex;flex:1;">
        <aside class="sidebar" style="width:200px;background:#f3f3f3;padding:10px;border-right:1px solid #ddd;"></aside>
        <section class="file-grid" style="flex:1;padding:10px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start;"></section>
      </div>
    </div>`
  };

  const drives = {
    "C:": {
      "Documents": {
        "notes.txt": { type: "file" },
        "resume.pdf": { type: "file" }
     
      },
      "Downloads": {
        "image.jpg": { type: "file" }
      },
      "Pictures": {}
    },
    "D: (Projects)": {
      "Project A": {
        "source": {},
        "build": {}
      },
      "Project B": {
        ".vscode": {},
        ".env": {}
      }
    }
  };

  let terminalWindowCounter = 1;
  const terminalAppIcons = document.querySelectorAll(".terminal");
  terminalAppIcons.forEach((e) => {
    e.addEventListener("click", () => {
      const uniqueTerminalName = `Terminal ${terminalWindowCounter++}`;
      const newWindow = createWindow(uniqueTerminalName, `${appContent.terminal}`, { allowMultiple: true });
      setTimeout(() => {
        if (window.initTerminal && newWindow) {
          const terminalBody = newWindow.querySelector('.terminal-body');
          if (terminalBody) window.initTerminal(terminalBody);
        }
      }, 0);
    });
  });

  document.querySelector("#textApp").addEventListener("click", () => {
    createWindow("Portfolio", `${appContent.portfolio}`);
  });

  document.querySelectorAll(".chrome").forEach((ele) => {
    ele.addEventListener("click", () => {
      createWindow("Chrome", `${appContent.chrome}`);
    })
  });
  document.querySelectorAll(".Sheryians").forEach((e)=>{e.addEventListener("click", () => {
    createWindow("Sheryians", `${appContent.sheryians}`);
  });
})
  document.querySelectorAll(".chatgpt").forEach((e) => {
    e.addEventListener("click", () => {
      createWindow("Chatgpt", `${appContent.chatgpt}`);
    });
  })
  document.querySelectorAll(".figma").forEach((e) => {
    e.addEventListener("click", () => {
      createWindow("Figma", `${appContent.figma}`);
    });
  })
  document.querySelectorAll(".github").forEach((e) => {
    e.addEventListener("click", () => {
      createWindow("Github", `${appContent.github}`);
    });
  })
  document.querySelectorAll(".pdf").forEach((e) => {
    e.addEventListener("click", () => {
      createWindow("Resume", `${appContent.resume}`);
    });
  })

  document.querySelectorAll(".File").forEach((e) => {
    e.addEventListener("click", () => {
      const explorerWindow = createWindow("File Explorer", appContent.file);
      const fmContainer = explorerWindow.querySelector('.text-content');
      fmContainer.classList.add('fm-container');
      fmContainer.style.position = 'relative';
      fmContainer.style.padding = '0';
      initFileManager({ container: fmContainer, drives: drives });
    });
  });

  document.querySelectorAll(".This").forEach((e) => {
    e.addEventListener("click", () => {
      const explorerWindow = createWindow("File Explorer", appContent.file);
      const fmContainer = explorerWindow.querySelector('.text-content');
      fmContainer.classList.add('fm-container');
      fmContainer.style.position = 'relative';
      fmContainer.style.padding = '0';
      initFileManager({ container: fmContainer, drives: drives });
    });
  });

 
  document.querySelectorAll('.discord').forEach((e) => {
    e.addEventListener('click', () => {
      window.open('https://discord.com/', '_blank');
    });
  });
  document.querySelectorAll('.npm').forEach((e) => {
    e.addEventListener('click', () => {
      window.open('https://www.npmjs.com/', '_blank');
    });
  });
  document.querySelectorAll('#settings, .taskbar img[id="settings"]').forEach((e) => {
    e.addEventListener('click', () => {
      createWindow('Profile (Terminal)', `
        <style>
          .profile-glass-card {
            background: rgba(10, 10, 10, 0.85);
            border-radius: 22px;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25);
            border: 2.5px solid;
            border-image: linear-gradient(90deg, #7ee787, #58a6ff, #d2a8ff, #7ee787) 1;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            padding: 38px 32px 32px 32px;
            max-width: 370px;
            width: 98vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #e5e5e5;
            position: relative;
          }
          .profile-glass-card h2 {
            margin: 0 0 8px 0;
            font-size: 1.6rem;
            color: #58a6ff;
            font-weight: 700;
          }
          .profile-glass-card .role {
            color: #7ee787;
            font-size: 1.08rem;
            margin-bottom: 12px;
          }
          .profile-glass-card .skills {
            color: #d2a8ff;
            margin-bottom: 10px;
            font-size: 1.05rem;
          }
          .profile-glass-card .contact {
            color: #8b949e;
            font-size: 1.01rem;
            margin-bottom: 0;
            word-break: break-all;
          }
          .profile-glass-outer {
            width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;min-height:0;flex-grow:1;
          }
          @media (max-width: 600px) {
            .profile-glass-card {
              padding: 18px 4vw 18px 4vw;
              max-width: 98vw;
              font-size: 1rem;
            }
          }
        </style>
        <div class="profile-glass-outer">
          <div class="profile-glass-card">
            <h2>Chetram Patel</h2>
            <div class="role">World-class Web Developer</div>
            <div class="skills"><b>Skills:</b> HTML, CSS, JavaScript, React, Node.js</div>
            <div class="contact"><b>Contact:</b> github.com/developerchetram<br>patelchetram49@gmail.com</div>
          </div>
        </div>
      `);
    });
  });

  document.querySelectorAll('.apps img[src$="Recycle Bin.svg"]').forEach((e) => {
    e.addEventListener('click', () => {
      createWindow('Recycle Bin', `
        <style>
          .recycle-bin-empty {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #888;
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
            font-size: 1.2rem;
            background: transparent;
            text-align: center;
            gap: 18px;
          }
          .recycle-bin-empty img {
            width: 54px;
            height: 54px;
            opacity: 0.7;
          }
        </style>
        <div class="recycle-bin-empty">
          <img src="./assets/icons/Recycle Bin.svg" alt="Recycle Bin">
          <div>Recycle Bin is empty</div>
        </div>
      `);
    });
  });
})