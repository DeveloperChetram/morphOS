const loader = document.querySelector("#loader")
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.style.display = "none"

    }, 3000)
})



document.addEventListener("DOMContentLoaded", () => {


    const navBtn = document.querySelector(".nav-icons")
    const cPenel = document.querySelector(".control-panel-div")

    let toggle = false;

    navBtn.addEventListener('click', () => {
        if (toggle) {
            // cPenel.style.display = "none";
            cPenel.style.opacity = 0;
            cPenel.style.top = "-500px"

        } else {
            // cPenel.style.display = "block";
            cPenel.style.opacity = 1;
            cPenel.style.top = " calc(20px + 1.9rem)"
        }
        toggle = !toggle;
    })

    const searchBtn = document.querySelector(".search")
    const startBtn = document.querySelector("#start")
    const startDiv = document.querySelector(".start-div")

    let toggle2 = false;
    startBtn.addEventListener('click', () => {
        if (toggle2) {

            startDiv.style.opacity = 0;
            startDiv.style.bottom = "-100vh"

        } else {

            startDiv.style.opacity = 1;
            startDiv.style.bottom = " 5rem"
        }
        toggle2 = !toggle2;
    })
    searchBtn.addEventListener('click', () => {
        if (toggle2) {
            // cPenel.style.display = "none";
            // startDiv.style.opacity = 0;
            // startDiv.style.bottom = "-100vh"

        } else {
            // cPenel.style.display = "block";
            startDiv.style.opacity = 1;
            startDiv.style.bottom = " 5rem"
            toggle2 = !toggle2;
        }
    })
    document.querySelector(".windows").addEventListener("click", () => {
        startDiv.style.opacity = 0;
        startDiv.style.bottom = "-100vh"
        toggle2 = !toggle2;
    })
    // date and time system 

    const time = document.querySelector(".time")
    const date = document.querySelector(".date")
    // Tue Jun 24 2025 17:16:26 GMT+0530 (India Standard Time)
    setInterval(() => {
        let currentDate = new Date
        time.innerHTML = `<span class="time">${currentDate.getHours() <= 9 ? "0" : ""}${currentDate.getHours()}:${currentDate.getMinutes() <= 9 ? "0" : ""}${currentDate.getMinutes()}</span>`
        date.innerHTML = `<span class="date">${currentDate.getDate() <= 9 ? "0" : ""}${currentDate.getDate()}:${currentDate.getMonth() <= 9 ? "0" : ""}${currentDate.getMonth()}:${currentDate.getFullYear()}</span>`
        // console.log()
    }, 5000)

    // dynamic apps 
    let appsHTML=``;
    const app =
        [
            "pdf svgrepo-com.svg",
            "chatgpt.svg",
            "chrome.svg",
            "discord.svg",
            "figma.svg",
            "File Explorer.svg",
            "github.svg",
            "Microsoft Photos.svg",
            "npm.svg",
            "Recycle Bin.svg",
            "start.svg",
            "terminal.svg",
            "This Pc.svg",
        
            
        ]

app.forEach((appName)=>{
appsHTML += `<div class="start-apps-perticular"> <img class="${appName.split(".")[0]}" src="./assets/icons/${appName}" alt=""> <span>${appName.split(".")[0]}</span></div>`
})
document.querySelector(".start-apps").innerHTML=appsHTML
})


function initTerminal() {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  let currentDir = '/home/guest';
  const filesystem = {
    '/home/guest': ['Documents', 'Downloads', 'Music', 'Pictures'],
    '/home/guest/Documents': ['resume.pdf', 'notes.txt'],
    '/home/guest/Downloads': ['movie.mp4', 'song.mp3'],
    '/home/guest/Music': ['track1.mp3', 'track2.mp3'],
    '/home/guest/Pictures': ['photo1.jpg', 'photo2.png'],
  };

  const commands = {
    ls: () => {
      const contents = filesystem[currentDir] || [];
      return contents.join('  ');
    },
    pwd: () => currentDir,
    whoami: () => "guest",
    help: () => {
      return `Available commands:
ls        - List directory contents
pwd       - Print working directory
whoami    - Print user name
help      - Show this help message
echo      - Display a line of text
clear     - Clear the terminal
date      - Show current date and time
mkdir     - Create a directory
rm        - Remove a file or directory
cd        - Change directory
cat       - Display file contents
time      - Show current time`;
    },
    echo: (args) => args.join(' '),
    date: () => new Date().toString(),
    time: () => new Date().toLocaleTimeString(),
    mkdir: (args) => {
      if (args.length === 0) return "mkdir: missing operand";
      const dirName = args[0];
      const contents = [...(filesystem[currentDir] || [])];
      if (contents.includes(dirName)) {
        return `mkdir: cannot create directory '${dirName}': File exists`;
      }
      contents.push(dirName);
      filesystem[currentDir] = contents;
      return `mkdir: created directory '${dirName}'`;
    },
    rm: (args) => {
      if (args.length === 0) return "rm: missing operand";
      const target = args[0];
      const contents = [...(filesystem[currentDir] || [])];
      const index = contents.indexOf(target);
      if (index === -1) {
        return `rm: cannot remove '${target}': No such file or directory`;
      }
      contents.splice(index, 1);
      filesystem[currentDir] = contents;
      return `rm: removed '${target}'`;
    },
    cd: (args) => {
      if (args.length === 0) return "cd: missing operand";
      const dir = args[0];
      if (dir === '..') {
        const parts = currentDir.split('/').filter(p => p);
        if (parts.length > 1) {
          parts.pop();
          currentDir = '/' + parts.join('/');
          return `changed directory to ${currentDir}`;
        }
        return "cd: cannot go up from root";
      }
      
      const contents = filesystem[currentDir] || [];
      if (contents.includes(dir)) {
        currentDir = `${currentDir}/${dir}`.replace(/\/\/+/g, '/');
        return `changed directory to ${currentDir}`;
      }
      return `cd: no such file or directory: ${dir}`;
    },
    cat: (args) => {
      if (args.length === 0) return "cat: missing operand";
      const fileName = args[0];
      const contents = filesystem[currentDir] || [];
      if (contents.includes(fileName)) {
        return `Contents of ${fileName}:\nThis is the mock terminal, I made this only for experience basic functionality of terminal. Thanks to sheryians coding school. checkout my github for more - @developerchetram .`;
      }
      return `cat: ${fileName}: No such file or directory`;
    }
  };

  function createPrompt() {
    const line = document.createElement("div");
    line.className = "line";

    const span = document.createElement("span");
    span.className = "user";
    span.textContent = `${currentDir}~$ `;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.placeholder = "type a command...";

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const command = input.value.trim();
        input.disabled = true;
        processCommand(command, line);
      }
    });

    line.appendChild(span);
    line.appendChild(input);
    terminalBody.appendChild(line);
    input.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function processCommand(command, line) {
    if (command === "clear") {
      terminalBody.innerHTML = "";
      createPrompt();
      return;
    }

    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    let outputText = "";

    if (commands[cmd]) {
      outputText = commands[cmd](args);
    } else if (command !== "") {
      outputText = `command not found: ${cmd}`;
    }

    if (outputText !== "") {
      const output = document.createElement("div");
      output.className = "output";
      output.textContent = outputText;
      terminalBody.appendChild(output);
    }

    createPrompt();
  }

  terminalBody.innerHTML = "";
  createPrompt();
}

window.initTerminal = initTerminal;

function initFileExplorer() {
  // Mock file system
  let fs = {
    '/': ['Documents', 'Downloads', 'Pictures', 'Music'],
    '/Documents': ['Resume.pdf', 'Notes.txt'],
    '/Downloads': ['Movie.mp4', 'Song.mp3'],
    '/Pictures': ['Photo1.jpg', 'Photo2.png'],
    '/Music': ['Track1.mp3', 'Track2.mp3']
  };
  let currentPath = '/';
  let selectedItem = null;

  const contentEl = document.getElementById('fileExplorerContent');
  const contextMenu = document.getElementById('fileExplorerContextMenu');
  const newFolderOption = document.getElementById('newFolderOption');
  const deleteOption = document.getElementById('deleteOption');
  const pathEl = document.querySelector('.file-explorer .current-path');

  function openFileModal(fileName) {
    // Remove any existing modal
    document.querySelectorAll('.file-preview-modal').forEach(m => m.remove());
    const modal = document.createElement('div');
    modal.className = 'file-preview-modal';
    modal.innerHTML = `
      <div class="file-preview-content">
        <span class="file-preview-close">&times;</span>
        <div class="file-preview-filename">${fileName}</div>
        <div class="file-preview-body">This is a preview of <b>${fileName}</b>.<br>File preview is not implemented for real content.</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.file-preview-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  function renderContent() {
    if (!contentEl) return;
    contentEl.innerHTML = '';
    (fs[currentPath] || []).forEach(item => {
      const div = document.createElement('div');
      div.className = 'file-explorer-item';
      div.textContent = item;
      div.setAttribute('data-name', item);
      div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        selectedItem = item;
        showContextMenu(e);
      });
      div.addEventListener('dblclick', () => {
        // If folder, navigate in
        const newPath = currentPath === '/' ? `/${item}` : `${currentPath}/${item}`;
        if (fs[newPath]) {
          currentPath = newPath;
          updatePath();
          renderContent();
        } else {
          // Open file modal
          openFileModal(item);
        }
      });
      contentEl.appendChild(div);
    });
  }

  function updatePath() {
    if (pathEl) pathEl.textContent = currentPath;
  }

  function showContextMenu(e) {
    if (!contextMenu) return;
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
  }
  function hideContextMenu() {
    if (contextMenu) contextMenu.style.display = 'none';
  }

  // Right click on blank area
  if (contentEl) {
    contentEl.addEventListener('contextmenu', (e) => {
      if (e.target === contentEl) {
        selectedItem = null;
        showContextMenu(e);
      }
    });
  }

  // New Folder
  if (newFolderOption) {
    newFolderOption.onclick = () => {
      let base = fs[currentPath] || [];
      let name = 'New Folder';
      let i = 1;
      while (base.includes(name)) {
        name = `New Folder (${i++})`;
      }
      base.push(name);
      fs[currentPath] = base;
      hideContextMenu();
      renderContent();
    };
  }
  // Delete
  if (deleteOption) {
    deleteOption.onclick = () => {
      if (selectedItem) {
        let base = fs[currentPath] || [];
        fs[currentPath] = base.filter(x => x !== selectedItem);
        // Also delete folder contents if it's a folder
        const folderPath = currentPath === '/' ? `/${selectedItem}` : `${currentPath}/${selectedItem}`;
        if (fs[folderPath]) delete fs[folderPath];
        selectedItem = null;
        hideContextMenu();
        renderContent();
      }
    };
  }

  // Hide context menu on click elsewhere
  document.addEventListener('click', hideContextMenu);

  // Sidebar navigation
  document.querySelectorAll('.file-explorer .sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.file-explorer .sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentPath = item.getAttribute('data-path');
      updatePath();
      renderContent();
    });
  });

  updatePath();
  renderContent();
}

window.initFileExplorer = initFileExplorer;