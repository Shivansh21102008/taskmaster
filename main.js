// main.js — task app logic (deploy-ready)

(function () {
  // Safe localStorage keys
  const STORAGE_KEY = 'taskmaster_tasks_v1';
  const THEME_KEY = 'taskmaster_theme_v1';
  const NAME_KEY = 'taskmaster_user_v1';

  // Elements
  const container = document.getElementById('bubble-container');
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('task-list');
  const sidebar = document.getElementById('sidebar');
  const welcomeText = document.getElementById('welcomeText');
  const sidebarDate = document.getElementById('sidebar-date');
  const countToday = document.getElementById('count-today');
  const countComp = document.getElementById('count-comp');
  const viewTitle = document.getElementById('view-title');
  const menuToggle = document.getElementById('menu-toggle');
  const toggleDarkBtn = document.getElementById('toggle-dark');

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let view = 'today';

  // Ensure user is logged in (simple check)
  const userName = localStorage.getItem(NAME_KEY) || localStorage.getItem('userName');
  if (!userName) {
    // No user — redirect to login
    window.location.href = 'index.html';
    return;
  }
  welcomeText.textContent = `Hi, ${userName}`;

  // Date
  function updateDate() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    sidebarDate.textContent = now.toLocaleDateString(undefined, options);
  }

  // Bubbles
  function generateBubbles(count = 12) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = (Math.random() * 60 + 20);
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${Math.random() * 100}%`;
      b.style.animationDuration = `${Math.random() * 10 + 8}s`;
      b.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(b);
    }
  }

  // Save
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    render();
  }

  // Render tasks
  function render() {
    list.innerHTML = '';
    const filtered = tasks.filter(t => view === 'today' ? !t.completed : t.completed);

    if (filtered.length === 0) {
      const el = document.createElement('div');
      el.className = 'empty-msg';
      el.textContent = 'No tasks in this section.';
      list.appendChild(el);
    } else {
      filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);

        // checkbox
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'checkbox';
        cb.checked = !!task.completed;
        cb.setAttribute('aria-label', task.completed ? 'Mark as not completed' : 'Mark as completed');
        cb.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const del = document.createElement('button');
        del.className = 'del-btn';
        del.setAttribute('aria-label', 'Delete task');
        del.textContent = '✕';
        del.addEventListener('click', () => delTask(task.id));

        li.appendChild(cb);
        li.appendChild(span);
        li.appendChild(del);
        list.appendChild(li);
      });
    }

    countToday.textContent = tasks.filter(t => !t.completed).length;
    countComp.textContent = tasks.filter(t => t.completed).length;
  }

  // CRUD
  function addTask(text) {
    const newTask = { id: Date.now(), text: text.trim(), completed: false };
    tasks.push(newTask);
    save();
  }
  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    save();
  }
  function delTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
  }

  // Events
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addTask(val);
    input.value = '';
    input.focus();
  });

  // Sidebar nav
  sidebar.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
    view = btn.dataset.view;
    viewTitle.innerText = view === 'today' ? "Today's Focus" : "Finished Tasks";
    render();
    if (menuToggle) {
      document.getElementById('sidebar').classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Menu toggle (mobile)
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const sb = document.getElementById('sidebar');
      const expanded = sb.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    // close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      const sb = document.getElementById('sidebar');
      if (sb.classList.contains('show') && !sb.contains(e.target) && e.target !== menuToggle) {
        sb.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Theme
  function loadTheme() {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'dark') {
      document.body.classList.add('dark');
      toggleDarkBtn.setAttribute('aria-pressed', 'true');
      document.getElementById('dark-icon').innerText = '☀️';
    } else {
      document.getElementById('dark-icon').innerText = '🌙';
      toggleDarkBtn.setAttribute('aria-pressed', 'false');
    }
  }
  toggleDarkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    document.getElementById('dark-icon').innerText = isDark ? '☀️' : '🌙';
    toggleDarkBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  });

  // Init
  updateDate();
  generateBubbles(12);
  loadTheme();
  render();

  // periodically update date at midnight (optional)
  setInterval(updateDate, 1000 * 60 * 30);
})();
