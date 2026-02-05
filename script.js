 const text = "A clean and powerful way to manage tasks and keep your team in sync.";
    const speed = 50;
    const delay = 1200; // typing ke baad rukne ka time

    let index = 0;
    const subtitle = document.getElementById("subtitle");

    function typeWriter() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            setTimeout(resetText, delay);
        }
    }

    function resetText() {
        subtitle.textContent = "";
        index = 0;
        typeWriter();
    }

    typeWriter();



    const overlay = document.getElementById("loginOverlay");

function openLogin() {
    overlay.classList.add("show");
}

function closeLogin() {
    overlay.classList.remove("show");
}

document.getElementById("openLogin").addEventListener("click", openLogin);
document.getElementById("openFromCta").addEventListener("click", openLogin);
document.getElementById("closeLogin").addEventListener("click", closeLogin);

const loginBtn = document.getElementById("loginSubmit");

    loginBtn.addEventListener("click", function () {
        const name = document.getElementById("userName").value;
        const email = document.getElementById("userEmail").value;

        if (name === "" || email === "") {
            alert("Please fill all details");
            return;
        }
        localStorage.setItem("userName", name);
        window.location.href = "main.html";
    });

        

        