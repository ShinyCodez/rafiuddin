// -------------------------
// Clock
// -------------------------
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// -------------------------
// Welcome Screen
// -------------------------
document.getElementById('closeWelcome').addEventListener('click', () => {
  document.getElementById('welcomeScreen').style.display = 'none';
});

// -------------------------
// Desktop Icons
// -------------------------
const icons = document.querySelectorAll('.desktop-icon');
const taskbarWindows = document.querySelector('.taskbar-windows');

icons.forEach((icon, index) => {
  // Consecutive placement
  icon.style.top = 20 + index * 120 + 'px';
  icon.style.left = '20px';

  icon.addEventListener('dblclick', () => {
    const winId = icon.dataset.window;
    const win = document.getElementById(winId);
    if (win) {
      win.style.display = 'block';
      win.style.zIndex = 1000;
      addTaskbarButton(winId, icon.querySelector('span').textContent);
    }
  });
});

// -------------------------
// Window functionality (drag, resize, buttons)
// -------------------------
document.querySelectorAll('.window').forEach(win => {
  const titlebar = win.querySelector('.window-titlebar');
  const closeBtn = win.querySelector('.close');
  const maximizeBtn = win.querySelector('.maximize');
  const minimizeBtn = win.querySelector('.minimize');
  const resizer = win.querySelector('.resizer');

  // Close / Minimize / Maximize
  closeBtn.addEventListener('click', () => { 
    win.style.display = 'none';
    removeTaskbarButton(win.id);
  });
  minimizeBtn.addEventListener('click', () => { win.style.display = 'none'; });
  maximizeBtn.addEventListener('click', () => {
    if (win.dataset.maximized === "true") {
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
      win.style.top = win.dataset.prevTop;
      win.style.left = win.dataset.prevLeft;
      win.dataset.maximized = "false";
    } else {
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevLeft = win.style.left;
      win.style.width = "90%";
      win.style.height = "80%";
      win.style.top = "20px";
      win.style.left = "20px";
      win.dataset.maximized = "true";
    }
  });

  // Drag functionality
  let isDragging = false, offsetX = 0, offsetY = 0;
  titlebar.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = 1000;
  });
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  });
  document.addEventListener('mouseup', () => { isDragging = false; });

  // Optional: Resize with corner resizer
  if (resizer) {
    let isResizing = false, startX, startY, startWidth, startHeight;
    resizer.addEventListener('mousedown', e => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
      e.preventDefault();
      e.stopPropagation();
      win.style.zIndex = 1000;
    });
    document.addEventListener('mousemove', e => {
      if (isResizing) {
        win.style.width = (startWidth + (e.clientX - startX)) + 'px';
        win.style.height = (startHeight + (e.clientY - startY)) + 'px';
      }
    });
    document.addEventListener('mouseup', () => { isResizing = false; });
  }

  // Make windows resizable with native browser resize as fallback
  win.style.resize = "both";
  win.style.overflow = "auto";
});

// -------------------------
// Taskbar Buttons
// -------------------------
function addTaskbarButton(winId, title){
  if(document.getElementById('taskbtn-' + winId)) return; // already exists
  const btn = document.createElement('button');
  btn.id = 'taskbtn-' + winId;
  btn.textContent = title;
  btn.onclick = () => {
    const win = document.getElementById(winId);
    if (win.style.display === 'none') {
      win.style.display = 'block';
      win.style.zIndex = 1000;
    } else {
      win.style.zIndex = 1000;
    }
  };
  taskbarWindows.appendChild(btn);
}

function removeTaskbarButton(winId){
  const btn = document.getElementById('taskbtn-' + winId);
  if(btn) btn.remove();
}

// -------------------------
// Start Menu Toggle
// -------------------------
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

startButton.addEventListener('click', () => {
  if (startMenu.style.display === 'block') {
    startMenu.style.display = 'none';
  } else {
    startMenu.style.display = 'block';
  }
});

// Optional: Close Start menu if clicked outside
document.addEventListener('click', (e) => {
  if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.style.display = 'none';
  }
});
