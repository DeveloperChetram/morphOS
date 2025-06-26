// File Manager Module for File Explorer
// Usage: import and call initFileManager({container, drives})

export function initFileManager({ container, drives }) {
  // State
  let currentDrive = Object.keys(drives)[0];
  let currentPath = [];
  let clipboard = null; // {item, type: 'copy'|'cut', from: {drive, path}}
  let selectedItem = { name: null, element: null };

  // In-memory file contents for .txt files
  if (!window._fileContents) window._fileContents = {};

  // Initialize notes.txt with sample text if it exists and is not set
  function setSampleTextForNotesTxt(obj) {
    for (const key in obj) {
      if (key.toLowerCase() === 'notes.txt' && obj[key] && obj[key].type === 'file') {
        if (window._fileContents[key] === undefined) {
          window._fileContents[key] = 'start writing your notes here ';
        }
      } else if (obj[key] && typeof obj[key] === 'object' && obj[key].type !== 'file') {
        setSampleTextForNotesTxt(obj[key]);
      }
    }
  }
  Object.values(drives).forEach(root => setSampleTextForNotesTxt(root));

  // Modal creation
  let modal = container.querySelector('.custom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.style.display = 'none';
    modal.innerHTML = `<div class="modal-content"></div><button class="modal-close">Close</button>`;
    container.appendChild(modal);
    modal.querySelector('.modal-close').onclick = () => { modal.style.display = 'none'; };
  }
  function showModal(html) {
    modal.querySelector('.modal-content').innerHTML = html;
    modal.style.display = 'block';
  }

  // Helper: get current directory object
  function getCurrentDir() {
    let dir = drives[currentDrive];
    for (const part of currentPath) {
      dir = dir[part];
    }
    return dir;
  }

  // Helper: get parent directory object and key
  function getParentDirAndKey() {
    if (currentPath.length === 0) return [drives, currentDrive];
    let dir = drives[currentDrive];
    for (let i = 0; i < currentPath.length - 1; i++) {
      dir = dir[currentPath[i]];
    }
    return [dir, currentPath[currentPath.length - 1]];
  }

  // Render sidebar (drives and folders)
  function renderSidebar() {
    let sidebarHTML = '<ul class="sidebar-list">';
    for (const drive of Object.keys(drives)) {
      sidebarHTML += `<li class="sidebar-drive${drive === currentDrive ? ' active' : ''}" data-drive="${drive}">${drive}</li>`;
      if (drive === currentDrive) {
        let dir = drives[drive];
        let pathSoFar = [];
        function renderFolders(obj, depth) {
          for (const key in obj) {
            if (obj[key] && obj[key].type !== 'file') {
              const isActive = currentPath[depth - 1] === key;
              sidebarHTML += `<li class="sidebar-folder${isActive ? ' active' : ''}" data-path="${[...pathSoFar, key].join('/')}">` +
                '&nbsp;'.repeat(depth * 2) + `<i class='fa-solid fa-folder'></i> ${key}</li>`;
              pathSoFar.push(key);
              if (isActive) renderFolders(obj[key], depth + 1);
              pathSoFar.pop();
            }
          }
        }
        renderFolders(dir, 1);
      }
    }
    sidebarHTML += '</ul>';
    container.querySelector('.sidebar').innerHTML = sidebarHTML;
    // Sidebar events
    container.querySelectorAll('.sidebar-drive').forEach(el => {
      el.onclick = () => {
        currentDrive = el.getAttribute('data-drive');
        currentPath = [];
        renderAll();
      };
    });
    container.querySelectorAll('.sidebar-folder').forEach(el => {
      el.onclick = () => {
        currentPath = el.getAttribute('data-path').split('/');
        renderAll();
      };
    });
  }

  // Render file grid
  function renderFiles() {
    const dir = getCurrentDir();
    let fileContainerData = '';
    for (const key in dir) {
      if (dir[key] && dir[key].type === 'file') {
        fileContainerData += `<div class="file-item" data-name="${key}" data-type="file" style="display:flex; align-items:center; gap:10px; padding:8px 15px;">
          <i class='fa-solid fa-file'></i> <span>${key}</span>
        </div>`;
      } else {
        fileContainerData += `<div class="file-item" data-name="${key}" data-type="folder" style="display:flex; align-items:center; gap:10px; padding:8px 15px;">
          <i class='fa-solid fa-folder'></i> <span>${key}</span>
        </div>`;
      }
    }
    container.querySelector('.file-grid').innerHTML = fileContainerData;
    attachFileEvents();
  }

  // Render address bar
  function renderAddressBar() {
    const pathStr = [currentDrive, ...currentPath].join(' > ');
    container.querySelector('.address-bar .path').textContent = pathStr;
  }

  // Render toolbar (copy, cut, paste, create, delete)
  function renderToolbar() {
    const toolbar = container.querySelector('.toolbar');
    toolbar.querySelector('.paste-btn').disabled = !clipboard;
    toolbar.querySelector('.copy-btn').disabled = !selectedItem.name;
    toolbar.querySelector('.cut-btn').disabled = !selectedItem.name;
    toolbar.querySelector('.open-btn').disabled = !selectedItem.name;
  }

  // Attach file grid events
  function attachFileEvents() {
    container.querySelectorAll('.file-item').forEach(item => {
      item.addEventListener('click', function(ev) {
        ev.stopPropagation(); // Prevent container click from deselecting
        if (selectedItem.element) {
          selectedItem.element.classList.remove('selected');
        }
        this.classList.add('selected');
        selectedItem = { name: this.getAttribute('data-name'), element: this };
        renderToolbar();
      });
      item.addEventListener('dblclick', function(ev) {
        const name = this.getAttribute('data-name');
        const type = this.getAttribute('data-type');
        if (type === 'folder') {
          currentPath.push(name);
          renderAll();
        } else if (type === 'file') {
          if (name.toLowerCase() === 'resume.pdf') {
            window.open('./assets/icons/v2%20chetram%20patel%20inter.pdf', '_blank');
          } else if (name.toLowerCase().endsWith('.txt')) {
            if (window._fileContents[name] === undefined) window._fileContents[name] = '';
            const grid = container.querySelector('.file-grid');
            grid.innerHTML = `
              <div class='editor-full-area' style='width:100%;height:100%;display:flex;flex-direction:column;flex:1;'>
                <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'>
                  <b>Edit: ${name}</b>
                  <button class='editor-back'>Back</button>
                </div>
                <textarea class='txt-editor' style='flex:1;width:100%; padding:10px;height:100%;min-height:200px;resize:vertical;margin-bottom:10px;'>${window._fileContents[name]}</textarea>
                <button class='txt-save'>Save</button>
              </div>
            `;
            grid.querySelector('.txt-save').onclick = () => {
              window._fileContents[name] = grid.querySelector('.txt-editor').value;
            };
            grid.querySelector('.editor-back').onclick = () => {
              renderFiles();
            };
          } else {
            showModal(`<b>Open</b><br><span>${name}</span>`);
          }
        }
      });
    });
  }

  // Open selected file or folder
  function openSelected() {
    if (!selectedItem.name) return;
    const dir = getCurrentDir();
    const name = selectedItem.name;
    const type = dir[name] && dir[name].type === 'file' ? 'file' : 'folder';
    if (type === 'folder') {
      currentPath.push(name);
      renderAll();
    } else if (type === 'file') {
      if (name.toLowerCase() === 'resume.pdf') {
        window.open('./assets/icons/v2%20chetram%20patel%20inter.pdf', '_blank');
      } else if (name.toLowerCase().endsWith('.txt')) {
        if (window._fileContents[name] === undefined) window._fileContents[name] = '';
        const grid = container.querySelector('.file-grid');
        grid.innerHTML = `
          <div class='editor-full-area' style='width:100%;height:100%;display:flex;flex-direction:column;flex:1;'>
            <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'>
              <b>Edit: ${name}</b>
              <button class='editor-back'>Back</button>
            </div>
            <textarea class='txt-editor' style='flex:1;width:100%; padding:10px;height:100%;min-height:200px;resize:vertical;margin-bottom:10px;'>${window._fileContents[name]}</textarea>
            <button class='txt-save'>Save</button>
          </div>
        `;
        grid.querySelector('.txt-save').onclick = () => {
          window._fileContents[name] = grid.querySelector('.txt-editor').value;
        };
        grid.querySelector('.editor-back').onclick = () => {
          renderFiles();
        };
      } else {
        showModal(`<b>Open</b><br><span>${name}</span>`);
      }
    }
  }

  // Toolbar actions
  const toolbar = container.querySelector('.toolbar');
  toolbar.querySelector('.copy-btn').onclick = () => {
    if (!selectedItem.name) return;
    const dir = getCurrentDir();
    clipboard = { item: JSON.parse(JSON.stringify(dir[selectedItem.name])), name: selectedItem.name, type: 'copy', from: { drive: currentDrive, path: [...currentPath] } };
    renderToolbar();
  };
  toolbar.querySelector('.cut-btn').onclick = () => {
    if (!selectedItem.name) return;
    const dir = getCurrentDir();
    clipboard = { item: dir[selectedItem.name], name: selectedItem.name, type: 'cut', from: { drive: currentDrive, path: [...currentPath] } };
    renderToolbar();
  };
  toolbar.querySelector('.paste-btn').onclick = () => {
    if (!clipboard) return;
    const dir = getCurrentDir();
    if (clipboard.type === 'copy') {
      dir[clipboard.name] = JSON.parse(JSON.stringify(clipboard.item));
    } else if (clipboard.type === 'cut') {
      let src = drives[clipboard.from.drive];
      for (const part of clipboard.from.path) {
        src = src[part];
      }
      dir[clipboard.name] = src[clipboard.name];
      delete src[clipboard.name];
    }
    clipboard = null;
    renderToolbar();
    renderFiles();
  };
  toolbar.querySelector('.open-btn').onclick = openSelected;
  toolbar.querySelector('.create-folder').onclick = () => {
    showModal(`
      <b>Create New</b><br>
      <div style='display:flex;flex-direction:column;gap:10px;'>
        <label>Name:
          <input type='text' class='create-name' placeholder='Enter name...' />
        </label>
        <label>Type:
          <select class='create-type'>
            <option value='txt'>Text File (.txt)</option>
            <option value='folder'>Folder</option>
          </select>
        </label>
        <button class='create-save'>Create</button>
      </div>
    `);
    modal.querySelector('.create-save').onclick = () => {
      let name = modal.querySelector('.create-name').value.trim();
      const type = modal.querySelector('.create-type').value;
      if (name) {
        if (type === 'txt' && !name.toLowerCase().endsWith('.txt')) {
          name += '.txt';
        }
        const dir = getCurrentDir();
        if (!dir[name]) {
          dir[name] = type === 'folder' ? {} : { type: 'file' };
          if (type === 'txt') {
            window._fileContents[name] = 'start writing your notes here ';
          }
          renderFiles();
          modal.style.display = 'none';
        }
      }
    };
  };

  // Render all
  function renderAll() {
    renderSidebar();
    renderAddressBar();
    renderToolbar();
    renderFiles();
  }

  // Initial render
  renderAll();
} 