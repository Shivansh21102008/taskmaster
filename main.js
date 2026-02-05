const userName = localStorage.getItem("userName");

    if (userName) {
        document.getElementById("welcomeText").textContent =
            "Hi, " + userName;
    } else {
        // agar direct main.html open kare
        window.location.href = "index.html"; // ya login page
    }


    function updateDate() {
    const now = new Date();

    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };

    const formattedDate = now.toLocaleDateString('en-US', options);

    document.querySelector(".date-display").innerText = formattedDate;
}

updateDate(); // call once



  // --- BUBBLE GENERATOR ---
        const container = document.getElementById('bubble-container');
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = Math.random() * 60 + 20 + 'px';
            bubble.style.width = size;
            bubble.style.height = size;
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDuration = Math.random() * 10 + 10 + 's';
            bubble.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(bubble);
        }

        // --- APP LOGIC ---
        let tasks = JSON.parse(localStorage.getItem('glass_tasks')) || [];
        let view = 'today';

        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        const list = document.getElementById('task-list');
        const sidebar = document.getElementById('sidebar');

        sidebar.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (!item) return;
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            view = item.dataset.view;
            document.getElementById('view-title').innerText = view === 'today' ? "Today's Focus" : "Finished Tasks";
            render();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!input.value.trim()) return;
            tasks.push({ id: Date.now(), text: input.value, completed: false });
            input.value = '';
            save();
        });

        window.toggleTask = (id) => {
            tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
            save();
        };

        window.delTask = (id) => {
            tasks = tasks.filter(t => t.id !== id);
            save();
        };

        function save() {
            localStorage.setItem('glass_tasks', JSON.stringify(tasks));
            render();
        }

        function render() {
            list.innerHTML = '';
            const filtered = tasks.filter(t => view === 'today' ? !t.completed : t.completed);
            
            if (filtered.length === 0) {
                list.innerHTML = `<div class="empty-msg">No tasks in this section.</div>`;
            }

            filtered.forEach(t => {
                const li = document.createElement('li');
                li.className = `task-item ${t.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
                    <span class="task-text">${t.text}</span>
                    <button class="del-btn" onclick="delTask(${t.id})">✕</button>
                `;
                list.appendChild(li);
            });

            document.getElementById('count-today').innerText = tasks.filter(t => !t.completed).length;
            document.getElementById('count-comp').innerText = tasks.filter(t => t.completed).length;
        }

        render();