// script.js — login + typewriter (index.html)

document.addEventListener('DOMContentLoaded', () => {
  // Typewriter
  const text = "A clean and powerful way to manage tasks and keep your team in sync.";
  const speed = 40;
  const pauseAfter = 1200;
  let idx = 0;
  const subtitle = document.getElementById('subtitle');

  function type() {
    if (!subtitle) return;
    if (idx < text.length) {
      subtitle.textContent += text.charAt(idx++);
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        subtitle.textContent = '';
        idx = 0;
        type();
      }, pauseAfter);
    }
  }
  type();

  // Overlay elements
  const overlay = document.getElementById('loginOverlay');
  const openLoginBtns = [document.getElementById('openLogin'), document.getElementById('openFromCta')];
  const closeBtn = document.getElementById('closeLogin');
  const loginBtn = document.getElementById('loginSubmit');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');

  function showOverlay() {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    nameInput.focus();
  }
  function hideOverlay() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  openLoginBtns.forEach(b => b && b.addEventListener('click', showOverlay));
  closeBtn && closeBtn.addEventListener('click', hideOverlay);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) hideOverlay();
  });

  // Basic validation & login
  loginBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!name || !email) {
      alert('Please fill all details');
      return;
    }
    // simple email check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      alert('Please enter a valid email');
      emailInput.focus();
      return;
    }
    // store and go to app
    localStorage.setItem('userName', name);
    localStorage.setItem('taskmaster_user_v1', name); // keep consistent with main.js
    localStorage.setItem('userEmail', email);
    window.location.href = 'main.html';
  });
});
