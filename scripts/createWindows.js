document.addEventListener("DOMContentLoaded", () => {




  let windowCounter = 0;

  // Store minimized windows by app name
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

  function createWindow(appName, content = "") {
    // Restore if minimized
    if (minimizedWindows[appName]) {
      restoreWindow(appName);
      return;
    }
    const template = document.querySelector(".window-template");
    const clone = template.cloneNode(true);
    clone.classList.remove("window-template");
    clone.style.display = "block";
    clone.classList.add("app-window");
    clone.setAttribute("data-app", appName);


    const offset = Math.random() * 40;
    const baseLeft = 100 + (windowCounter * offset);
    const baseTop = 100 + (windowCounter * offset);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const windowWidth = 500;
    const windowHeight = 300;

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
      // windowEl.style.transition = ""

      preventOverFlow()
    });

    document.addEventListener("mousemove", e => {
      if (isDragging) {
        windowEl.style.left = `${e.clientX - offsetX}px`;
        windowEl.style.top = `${e.clientY - offsetY}px`;
        // isFullscreen = !isFullscreen
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

  // Buttons
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
      // document.querySelector(".bottom-nav").style.zIndex=10000000000
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
    chrome:  `<div style="width: 100%; height: 100%; "> <iframe  src="https://www.google.com/search?igu=1" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe>`,
    sheryians: `<div style="width: 100%; height: 100%; "> <iframe  src="https://sheryians.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    chatgpt: `<div style="width: 100%; height: 100%; "> <iframe  src="https://chatgpt.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    portfolio: `<div style="width: 100%; height: 100%; "> <iframe  src="https://chetram-portfolio.vercel.app" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    figma: `<div style="width: 100%; height: 100%; "> <iframe  src="https://www.figma.com/" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
    github: `<div style="width: 100%; height: 100%; "> <iframe  src="../assets/icons/v2 chetram patel inter.pdf" width="100%" height="100%"  style="border: none;"  loading="lazy" sandbox="allow-forms allow-scripts allow-same-origin"></iframe></div>`,
  }





  const terminalAppIcon = document.querySelector("#terminal");
  terminalAppIcon.addEventListener("click", () => {
    createWindow("Terminal", `<div class='terminal-window'>
      <div class='terminal-title'>Terminal</div>
      <div class='terminal-body'>
        <span class='terminal-user'>patelchetram@gmail.com</span>:~$ 
        <span class='terminal-command'>developerChetram</span>
        <span class='label'>OS designed by:</span> astoriaOS Tsunami (64-bit)  
        <span class='label'>OS developed by:</span> @developerChetram  
        <span class='label'>Resolution:</span> 1600x900  
        <span class='label'>Theme:</span> Light Tsunami (Default)  
        <span class='label'>Icons:</span> Default Light  
        <span class='label'>Terminal:</span> cascade1-terminal  
        <span class='label'>Terminal font:</span> astoriaOS  
        <span class='label'>Memory:</span> 4096 MB  
      </div>
    </div>`);
  });

  document.querySelector("#textApp").addEventListener("click", () => {
    createWindow("Portfolio",`${appContent.portfolio}`);
  });

  document.querySelectorAll(".chrome").forEach((ele)=>{ ele.addEventListener("click", () => {
    createWindow("Chrome", `${appContent.chrome}`);}) 
  });
  document.querySelector("#sheryians").addEventListener("click", () => {
    createWindow("Sheryians", `${appContent.sheryians}`);
  });
  document.querySelectorAll(".chatgpt").forEach((e)=>{e.addEventListener("click", () => {
    createWindow("Chatgpt", `${appContent.chatgpt}`);
  });
  })
  document.querySelectorAll(".figma").forEach((e)=>{e.addEventListener("click", () => {
    createWindow("Figma", `${appContent.figma}`);
  });
  })
  document.querySelectorAll(".github").forEach((e)=>{e.addEventListener("click", () => {
    createWindow("Github", `${appContent.github}`);
  });
  })

})