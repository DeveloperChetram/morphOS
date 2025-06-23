let windowCounter = 0;

function createWindow(appName, content = "This is a new window") {
  const template = document.querySelector(".window-template");
  const clone = template.cloneNode(true);
  clone.classList.remove("window-template");
  clone.style.display = "block";
  clone.classList.add("app-window");


  const offset = Math.random()*40;
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
  clone.style.zIndex = 1000 + windowCounter;
  clone.querySelector(".window-title").innerHTML = appName;
  clone.querySelector(".text-content").innerHTML = content;

  document.querySelector(".windows").appendChild(clone);
  initWindow(clone);

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
function initWindow(windowEl) {
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
    windowEl.style.zIndex = 1000 + windowCounter++;
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

  // Buttons
  minimizeBtn.addEventListener("click", () => {
    windowEl.style.opacity = "0";
    windowEl.style.pointerEvents = "none";
  });

  fullBtn.addEventListener("click", () => {
    if (!isFullscreen) {
      // Save current state
      prevState = {
        width: windowEl.style.width,
        height: windowEl.style.height,
        top: windowEl.style.top,
        left: windowEl.style.left,
        position: windowEl.style.position,
        zIndex: windowEl.style.zIndex
      };

      // Go fullscreen
      windowEl.style.position = "fixed";
      windowEl.style.top = "0";
      windowEl.style.left = "0";
      windowEl.style.width = "100vw";
      windowEl.style.height = "100vh";
      windowEl.style.zIndex = 9999;

      isFullscreen = true;
    } else {
      // Restore previous state
      windowEl.style.width = prevState.width;
      windowEl.style.height = prevState.height;
      windowEl.style.top = prevState.top;
      windowEl.style.left = prevState.left;
      windowEl.style.position = prevState.position;
      windowEl.style.zIndex = prevState.zIndex;

      isFullscreen = false;
    }
  });


  closeBtn.addEventListener("click", () => {
    windowEl.remove();
  });
}

document.querySelector("#textApp").addEventListener("click", () => {
  createWindow("Task manager (<span style='color:red; font-size:.8rem'>task manager is not responding</span>)", "");
});

document.querySelector("#terminal").addEventListener("click", () => {
 createWindow("", `<div class='terminal-window'>
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
    </pre>
  </div>
</div>
`);

});
