"use strict";


const THEME_STORAGE_KEY = "javion-theme";
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeText = themeToggle.querySelector(".theme-text");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

// localStorage can throw in some privacy modes, so wrap access in try/catch.
function readSavedTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        // The toggle still works for this visit even if saving fails.
    }
}

// Update the page colours, the button label and the browser tab colour.
function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeText.textContent = isDark ? "Light mode" : "Dark mode";

    if (themeColorMeta) {
        themeColorMeta.setAttribute("content", isDark ? "#0c1220" : "#ffffff");
    }
}

function getInitialTheme() {
    const savedTheme = readSavedTheme();

    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }

    // No saved choice yet, so follow the operating system preference.
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    saveTheme(nextTheme);
});

applyTheme(getInitialTheme());

/* =====================================================================
   FEATURE 2 - TIME-BASED GREETING AND LIVE CLOCK
   Uses the Date object and Intl formatters, refreshed every second.
   ===================================================================== */
const greetingText = document.getElementById("greeting");
const clockText = document.getElementById("live-clock");

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
});

function getGreetingForHour(hour) {
    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
}

function updateGreetingAndClock() {
    const now = new Date();

    greetingText.textContent = getGreetingForHour(now.getHours()) + ", and welcome!";
    clockText.textContent = timeFormatter.format(now) + " · " + dateFormatter.format(now);
    clockText.setAttribute("datetime", now.toISOString());
}

updateGreetingAndClock();
window.setInterval(updateGreetingAndClock, 1000);


const hobbyData = [
    {
        icon: "🏓",
        title: "Table Tennis",
        description: "I enjoy the speed and competition of table tennis and the challenge of improving my game.",
        keywords: "sport ping pong match competition practice"
    },
    {
        icon: "🎮",
        title: "Video Games",
        description: "Gaming is one of my favourite ways to relax, have fun, and connect with friends.",
        keywords: "gaming console friends relaxing fun"
    },
    {
        icon: "💻",
        title: "Technology",
        description: "I like learning about computers, websites, and how technology can solve problems.",
        keywords: "computers coding websites programming learning"
    },
    {
        icon: "🎬",
        title: "Movies & Music",
        description: "I enjoy watching movies and listening to music when I have free time.",
        keywords: "film films songs music relaxing"
    }
];

const hobbyGrid = document.getElementById("hobby-grid");
const hobbySearch = document.getElementById("hobby-search");
const hobbyCount = document.getElementById("hobby-count");
const hobbyEmpty = document.getElementById("hobby-empty");


function createHobbyCard(hobby) {
    const card = document.createElement("article");
    card.className = "hobby-card";

    const icon = document.createElement("div");
    icon.className = "hobby-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = hobby.icon;

    const title = document.createElement("h3");
    title.textContent = hobby.title;

    const description = document.createElement("p");
    description.textContent = hobby.description;

    card.append(icon, title, description);
    return card;
}

function matchesSearch(hobby, searchTerm) {
    const searchableText = (hobby.title + " " + hobby.description + " " + hobby.keywords).toLowerCase();
    return searchableText.includes(searchTerm);
}


function renderHobbies(searchTerm) {
    const term = (searchTerm || "").trim().toLowerCase();
    const visibleHobbies = hobbyData.filter(function (hobby) {
        return matchesSearch(hobby, term);
    });

    hobbyGrid.replaceChildren(...visibleHobbies.map(function (hobby) {
        return createHobbyCard(hobby);
    }));

    hobbyEmpty.hidden = visibleHobbies.length > 0;

    if (term === "") {
        hobbyCount.textContent = "Showing all " + hobbyData.length + " hobbies";
    } else {
        hobbyCount.textContent = "Showing " + visibleHobbies.length + " of " + hobbyData.length + " hobbies";
    }
}

hobbySearch.addEventListener("input", function (event) {
    renderHobbies(event.target.value);
});

renderHobbies("");

const slides = [
    {
        src: "images/javion-photo-1.jpg",
        alt: "Javion standing indoors in a white graphic T-shirt and pink shorts",
        caption: "One of my photos"
    },
    {
        src: "images/javion-photo-2.jpg",
        alt: "Javion outdoors wearing a green shirt, black shorts, and a cap",
        caption: "Another snapshot"
    }
];

const SLIDE_DELAY = 5000;

const slideshow = document.getElementById("slideshow");
const slideImage = document.getElementById("slide-image");
const slideCaption = document.getElementById("slide-caption");
const slideStatus = document.getElementById("slide-status");
const slideDots = document.getElementById("slide-dots");
const previousSlideButton = document.getElementById("slide-prev");
const nextSlideButton = document.getElementById("slide-next");

let currentSlide = 0;
let autoPlayTimer = null;


function createSlideDots() {
    slides.forEach(function (slide, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slide-dot";
        dot.setAttribute("aria-label", "Show photo " + (index + 1) + " of " + slides.length);
        dot.addEventListener("click", function () {
            showSlide(index);
            restartAutoPlay();
        });
        slideDots.appendChild(dot);
    });
}

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    const slide = slides[currentSlide];

    slideImage.setAttribute("src", slide.src);
    slideImage.setAttribute("alt", slide.alt);
    slideCaption.textContent = slide.caption;
    slideStatus.textContent = "Photo " + (currentSlide + 1) + " of " + slides.length;

    const dots = slideDots.querySelectorAll(".slide-dot");
    dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function startAutoPlay() {
    if (autoPlayTimer !== null) {
        return;
    }

    autoPlayTimer = window.setInterval(showNextSlide, SLIDE_DELAY);
}

function stopAutoPlay() {
    window.clearInterval(autoPlayTimer);
    autoPlayTimer = null;
}

function restartAutoPlay() {
    stopAutoPlay();

    if (!document.hidden) {
        startAutoPlay();
    }
}

previousSlideButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
    restartAutoPlay();
});

nextSlideButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
    restartAutoPlay();
});


slideshow.addEventListener("mouseenter", stopAutoPlay);
slideshow.addEventListener("mouseleave", startAutoPlay);
slideshow.addEventListener("focusin", stopAutoPlay);
slideshow.addEventListener("focusout", startAutoPlay);

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

createSlideDots();
showSlide(0);
startAutoPlay();

/* =====================================================================
   FEATURE 5 - CONTACT FORM VALIDATION + CHARACTER COUNTER
   Reads the form values, checks them, then displays what was submitted.
   ===================================================================== */
const contactForm = document.getElementById("contact-form");
const nameField = document.getElementById("contact-name");
const emailField = document.getElementById("contact-email");
const messageField = document.getElementById("contact-message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const characterCount = document.getElementById("char-count");
const formStatus = document.getElementById("form-status");
const formResult = document.getElementById("form-result");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE_LENGTH = 300;

function setFieldError(field, errorElement, message) {
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
}

function clearFieldError(field, errorElement) {
    field.removeAttribute("aria-invalid");
    errorElement.textContent = "";
}

function clearAllFormErrors() {
    clearFieldError(nameField, nameError);
    clearFieldError(emailField, emailError);
    clearFieldError(messageField, messageError);
}

function updateCharacterCount() {
    const usedCharacters = messageField.value.length;

    characterCount.textContent = usedCharacters + " / " + MAX_MESSAGE_LENGTH + " characters";
    characterCount.classList.toggle("is-near-limit", usedCharacters > MAX_MESSAGE_LENGTH - 40);
}

// Show the values that the visitor submitted.
function displaySubmittedValues(values) {
    const heading = document.createElement("h4");
    heading.textContent = "Submitted values";

    const list = document.createElement("dl");
    const rows = [
        ["Name", values.name],
        ["Email", values.email],
        ["Message", values.message]
    ];

    rows.forEach(function (row) {
        const label = document.createElement("dt");
        label.textContent = row[0];

        const value = document.createElement("dd");
        value.textContent = row[1];

        list.append(label, value);
    });

    formResult.replaceChildren(heading, list);
    formResult.hidden = false;
}

// Return the trimmed form values when everything is valid, otherwise null.
function validateForm() {
    const values = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        message: messageField.value.trim()
    };

    let isValid = true;
    let firstInvalidField = null;

    clearAllFormErrors();

    if (values.name.length < 2) {
        setFieldError(nameField, nameError, "Please enter your name (at least 2 characters).");
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = nameField;
        }
    }

    if (!EMAIL_PATTERN.test(values.email)) {
        setFieldError(emailField, emailError, "Enter a valid email address, for example name@example.com.");
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = emailField;
        }
    }

    if (values.message.length < 10) {
        setFieldError(messageField, messageError, "Your message needs at least 10 characters.");
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = messageField;
        }
    }

    if (!isValid) {
        firstInvalidField.focus();
        return null;
    }

    return values;
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const values = validateForm();

    if (!values) {
        formStatus.textContent = "Please fix the highlighted fields and try again.";
        formStatus.className = "form-status is-error";
        formResult.hidden = true;
        return;
    }

    displaySubmittedValues(values);

    formStatus.textContent = "Thanks, " + values.name + "! Your message has been recorded below.";
    formStatus.className = "form-status is-success";

    contactForm.reset();
    updateCharacterCount();
});

// The "Clear" button also removes the messages and resets the counter.
// It is attached to the button rather than the form's reset event because
// form.reset() is called after a successful submit too.
const resetButton = contactForm.querySelector('button[type="reset"]');

resetButton.addEventListener("click", function () {
    window.setTimeout(function () {
        clearAllFormErrors();
        formStatus.textContent = "";
        formStatus.className = "form-status";
        formResult.hidden = true;
        formResult.replaceChildren();
        updateCharacterCount();
    }, 0);
});

// Remove an error message as soon as the visitor starts fixing that field.
nameField.addEventListener("input", function () {
    clearFieldError(nameField, nameError);
});

emailField.addEventListener("input", function () {
    clearFieldError(emailField, emailError);
});

messageField.addEventListener("input", function () {
    clearFieldError(messageField, messageError);
    updateCharacterCount();
});

updateCharacterCount();
