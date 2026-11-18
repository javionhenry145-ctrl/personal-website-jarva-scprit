"use strict";

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeText = themeToggle.querySelector(".theme-text");

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeText.textContent = isDark ? "Light" : "Dark";
}

const savedTheme = localStorage.getItem("javion-theme");
applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem("javion-theme", theme);
});

const greeting = document.querySelector("#greeting");
const clock = document.querySelector("#live-clock");

function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    greeting.textContent = hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";
    clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

updateClock();
setInterval(updateClock, 1000);

const hobbies = [
    ["🏓", "Table Tennis", "I enjoy competition and improving my game.", "sport ping pong practice"],
    ["🎮", "Video Games", "Gaming helps me relax and connect with friends.", "gaming console friends"],
    ["💻", "Technology", "I like learning how computers and websites work.", "coding computers websites"],
    ["🎬", "Movies & Music", "I enjoy movies and music in my free time.", "film songs entertainment"]
];

const hobbyGrid = document.querySelector("#hobby-grid");
const hobbySearch = document.querySelector("#hobby-search");
const hobbyCount = document.querySelector("#hobby-count");
const hobbyEmpty = document.querySelector("#hobby-empty");

function renderHobbies() {
    const term = hobbySearch.value.trim().toLowerCase();
    const matches = hobbies.filter(hobby => hobby.join(" ").toLowerCase().includes(term));

    hobbyGrid.replaceChildren();
    matches.forEach(([icon, title, description]) => {
        const card = document.createElement("article");
        card.className = "hobby-card";
        card.innerHTML = `<div class="hobby-icon" aria-hidden="true">${icon}</div><h3>${title}</h3><p>${description}</p>`;
        hobbyGrid.append(card);
    });

    hobbyCount.textContent = term ? `${matches.length} of ${hobbies.length} hobbies` : `All ${hobbies.length} hobbies`;
    hobbyEmpty.hidden = matches.length > 0;
}

hobbySearch.addEventListener("input", renderHobbies);
renderHobbies();

const slides = [
    ["images/javion-photo-1.jpg", "Javion standing indoors", "One of my photos"],
    ["images/javion-photo-2.jpg", "Javion outdoors wearing a cap", "Another snapshot"]
];

const slideImage = document.querySelector("#slide-image");
const slideCaption = document.querySelector("#slide-caption");
const slideStatus = document.querySelector("#slide-status");
const slideDots = document.querySelector("#slide-dots");
let slideIndex = 0;

slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    slideDots.append(dot);
});

function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    const [src, alt, caption] = slides[slideIndex];
    slideImage.src = src;
    slideImage.alt = alt;
    slideCaption.textContent = caption;
    slideStatus.textContent = `Photo ${slideIndex + 1} of ${slides.length}`;

    slideDots.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === slideIndex);
    });
}

document.querySelector("#slide-prev").addEventListener("click", () => showSlide(slideIndex - 1));
document.querySelector("#slide-next").addEventListener("click", () => showSlide(slideIndex + 1));
showSlide(0);

const form = document.querySelector("#contact-form");
const fields = {
    name: document.querySelector("#contact-name"),
    email: document.querySelector("#contact-email"),
    message: document.querySelector("#contact-message")
};
const messageCount = document.querySelector("#char-count");
const formStatus = document.querySelector("#form-status");
const formResult = document.querySelector("#form-result");

function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
    form.querySelectorAll(".field-error").forEach(error => { error.textContent = ""; });
}

function updateCount() {
    messageCount.textContent = `${fields.message.value.length} / 300 characters`;
}

fields.message.addEventListener("input", updateCount);
updateCount();

form.addEventListener("submit", event => {
    event.preventDefault();
    clearErrors();

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();
    const errors = [];

    if (name.length < 2) errors.push([fields.name, "name-error", "Please enter your name."]);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push([fields.email, "email-error", "Please enter a valid email."]);
    if (message.length < 10) errors.push([fields.message, "message-error", "Please write at least 10 characters."]);

    if (errors.length) {
        errors.forEach(([field, errorId, text]) => {
            field.setAttribute("aria-invalid", "true");
            document.querySelector(`#${errorId}`).textContent = text;
        });
        errors[0][0].focus();
        formStatus.textContent = "Please fix the highlighted fields.";
        return;
    }

    formResult.replaceChildren();
    const heading = document.createElement("h4");
    heading.textContent = "Submitted message";
    const list = document.createElement("dl");

    [
        ["Name", name],
        ["Email", email],
        ["Message", message]
    ].forEach(([label, value]) => {
        const term = document.createElement("dt");
        term.textContent = label;
        const description = document.createElement("dd");
        description.textContent = value;
        list.append(term, description);
    });

    formResult.append(heading, list);
    formResult.hidden = false;
    formStatus.textContent = `Thanks, ${name}!`;
    form.reset();
    updateCount();
});

form.addEventListener("reset", () => {
    setTimeout(() => {
        clearErrors();
        formStatus.textContent = "";
        formResult.hidden = true;
        updateCount();
    });
});
