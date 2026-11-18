# Javion Henry — Personal Website

My name is Javion Henry. This is my personal website, which introduces who I am, my table tennis achievement, my hobbies, a small photo gallery and a way to contact me. The site was built for my web development practical assignments and now includes five JavaScript features that make it interactive.

## JavaScript enhancements

The HTML and CSS were extended with an external JavaScript file (`js/script.js`). The JavaScript uses the DOM, event listeners and the browser's built-in objects to add the features below. Nothing about the previous design was removed — the new controls follow the same colours, spacing and card style as the rest of the site.

### The five features

| # | Feature | Where it is | What it does |
|---|---------|-------------|--------------|
| 1 | **Dark / light theme toggle** | Button in the header | Switches the whole site between a light and a dark colour scheme by changing a `data-theme` attribute on the page. The choice is saved in `localStorage` and restored on the next visit, and the button's `aria-pressed` state and `theme-color` meta tag are kept in sync. |
| 2 | **Time-based greeting and live clock** | Hero section | Reads the visitor's local time with `Date` and `Intl.DateTimeFormat`, shows "Good morning / afternoon / evening" and updates the clock every second with `setInterval`. The `<time>` element's `datetime` attribute is updated as well. |
| 3 | **Live hobby search** | Hobbies section | Builds the four hobby cards from a JavaScript array with `document.createElement`, then rebuilds them on every `input` event so only cards matching the typed word remain. A count ("Showing 2 of 4 hobbies") and an empty-state message are updated at the same time. |
| 4 | **Photo gallery slideshow** | Gallery section | Shows one photo at a time with Previous / Next buttons, clickable indicator dots and automatic rotation every 5 seconds. The image `src` and `alt` are changed with `setAttribute`, the caption and "Photo 1 of 2" status are updated, and the slideshow pauses while the mouse is over it, while a control has focus, or when the browser tab is hidden. |
| 5 | **Contact form validation and character counter** | Contact section | Counts the characters typed in the message box (`0 / 300 characters`). On submit it reads the form values, checks the name, email pattern and minimum message length, shows clear error messages next to each field and moves focus to the first problem. When everything is valid it displays a "Submitted values" summary built from the form data and clears the fields. |

### How the features meet the assignment requirements

* **Two or more features that create, modify or remove elements:** features 3 (cards created and removed) and 5 (the submitted-values summary and error messages are created with the DOM), plus features 1, 2 and 4 which modify existing elements.
* **One or more features that respond to user interaction:** all five use events — `click` (theme, slideshow, dots), `input` (search, character counter), `submit` (form), `mouseenter` / `mouseleave` and `focusin` / `focusout` (slideshow pause).
* **One or more features that read information:** feature 5 reads the values typed into the form, feature 2 reads the visitor's system time, and feature 3 reads the search input to decide which cards to build.

## Technologies used

* HTML5
* CSS3 (custom properties, flexbox, grid, media queries)
* JavaScript (ES6, DOM API, events, `localStorage`, `Date`, `Intl`)
* Git and GitHub (branch, commits, pull request, GitHub Pages)

## Project structure

```
personal-website/
│
├── index.html              # all page content and the five feature controls
├── README.md               # this file
│
├── css/
│   └── style.css           # design, layout, responsive rules and feature styles
│
├── js/
│   └── script.js           # the five JavaScript features
│
└── images/
    ├── javion-photo-1.jpg
    └── javion-photo-2.jpg
```

The JavaScript file is loaded at the end of `index.html` with `defer`, so the HTML is ready before the script runs and no inline JavaScript is used:

```html
<script src="js/script.js" defer></script>
```

> **Images:** the two photos in `images/` are the same ones used across the site. If a file name changes, update the `<img>` tags in `index.html` and the `slides` array in `js/script.js`.

## How to view the website

1. Download or clone the repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, right-click `index.html` in VS Code and choose **Open with Live Server**.

The website is published with GitHub Pages at: **https://javionhenry145-ctrl.github.io/personal-website-jarva-scprit/**

## Testing checklist

| Check | Result |
|-------|--------|
| Theme toggle switches colours, button label and `aria-pressed`, and the choice survives a page reload | Passed |
| Greeting changes with the time of day and the clock updates every second | Passed |
| Search filters by hobby name, description and keywords; empty search restores all four cards; a no-match search shows the empty message | Passed |
| Slideshow Next / Previous wrap around, dots stay in sync, autoplay rotates and pauses on hover / focus | Passed |
| Form blocks empty and invalid submissions with field-level messages, focuses the first invalid field, shows the submitted values on success, and Clear resets everything | Passed |
| Browser console shows no JavaScript errors after a fresh load and after using every feature | Passed |
| No horizontal scrolling at 390 px, 768 px and 1280 px widths | Passed |
| Existing navigation links, contact links and layout still work | Passed |

## Git workflow used

The JavaScript work was done on a separate branch and merged into `main` through a pull request:

```bash
git switch main
git pull origin main
git switch -c f1qfqf

# ... update and test the JavaScript features and styles ...

git push -u origin f1qfqf
```

* **Repository:** https://github.com/javionhenry145-ctrl/personal-website-jarva-scprit
* **JavaScript branch:** `f1qfqf`
* **Pull request:** [#4 — Refresh warm site styling and interactions](https://github.com/javionhenry145-ctrl/personal-website-jarva-scprit/pull/4), merged into `main`

The pull request changes `js/script.js` and `css/style.css`. Its summary reads: "Revise the responsive layout and warm color palette, and streamline the theme toggle, greeting, hobby search, photo slideshow, and contact form."

Two earlier pull requests, [#1](https://github.com/javionhenry145-ctrl/personal-website-jarva-scprit/pull/1) and [#2](https://github.com/javionhenry145-ctrl/personal-website-jarva-scprit/pull/2), made smaller edits to `js/script.js` and were also merged into `main`.

## Reflection

Adding JavaScript to my website was harder than the HTML and CSS work because the page now has to react to what the visitor does. I implemented five features: a theme toggle that remembers the choice with `localStorage`, a greeting and live clock, a hobby search that rebuilds the hobby cards as the visitor types, a slideshow with previous and next controls, and a contact form with validation and a character counter. The search and the form taught me the most about the DOM. It was satisfying to see card elements appear and disappear from a typed word, and to build the submitted-values summary from the form data. The hardest part was the form. My success message disappeared straight after a valid submission because the form's `reset()` call triggered my own reset listener; I solved it by listening for a click on the Clear button instead. Testing in the browser console and checking the page at different widths also showed me how small mistakes affect the layout. Using a branch kept `main` safe while the work was unfinished, and the pull request gave me a clear summary of the changes to review before merging. I now understand how JavaScript, the DOM and events work together.

## Credits

Written by Javion Henry for the CIT234 practical assignments. Emoji icons are standard Unicode characters; no third-party JavaScript libraries or frameworks were used.
