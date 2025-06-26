const loader = document.querySelector("#loader")
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.style.display = "none"

    }, 4000)
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
    // Show time and date immediately, then update every 5 seconds
    function updateTimeAndDate() {
        let currentDate = new Date();
        time.innerHTML = `<span class="time">${currentDate.getHours() <= 9 ? "0" : ""}${currentDate.getHours()}:${currentDate.getMinutes() <= 9 ? "0" : ""}${currentDate.getMinutes()}</span>`;
        date.innerHTML = `<span class="date">${currentDate.getDate() <= 9 ? "0" : ""}${currentDate.getDate()}:${currentDate.getMonth() <= 9 ? "0" : ""}${currentDate.getMonth()}:${currentDate.getFullYear()}</span>`;
    }
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 5000);

    // dynamic apps 
    let appsHTML=``;
    const app =
        [
            "pdf Resume.svg",
            "chatgpt.svg",
            "chrome.svg",
            "Sheryians.webp",
           
        
            "File Explorer.svg",
           
            // "Microsoft Photos.svg",
          
            // "Recycle Bin.svg",
            "start.svg",
            "terminal.svg",
            "This Pc.svg",
        
            
        ]

    function renderStartApps(filter = "") {
      let html = "";
      app.forEach((appName) => {
        const appLabel = appName.split(".")[0];
        if (appLabel.toLowerCase().includes(filter.toLowerCase())) {
          html += `<div class="start-apps-perticular"> <img class="${appLabel}" src="./assets/icons/${appName}" alt=""> <span>${appLabel}</span></div>`;
        }
      });
      document.querySelector(".start-apps").innerHTML = html;
    }
    renderStartApps();

    // Search bar in start menu
    const startSearchInput = document.querySelector('.start-search');
    if (startSearchInput) {
      startSearchInput.addEventListener('input', function() {
        renderStartApps(this.value);
      });
    }
    // Taskbar search (bottom nav)
    const taskbarSearchInput = document.querySelector('.search input');
    if (taskbarSearchInput) {
      taskbarSearchInput.addEventListener('input', function() {
        renderStartApps(this.value);
      });
    }
})


function initTerminal(terminalBody) {
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
