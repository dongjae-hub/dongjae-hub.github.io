import { initSnakeGame } from "./game.js";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".primary-nav");
const year = document.querySelector("[data-year]");

const setNavOpen = (open) => {
  if (!header || !toggle || !nav) return;
  header.dataset.navOpen = String(open);
  toggle.setAttribute("aria-expanded", String(open));
};

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (toggle && header && nav) {
  toggle.addEventListener("click", () => {
    const open = header.dataset.navOpen === "true";
    setNavOpen(!open);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) setNavOpen(false);
  });
}

initSnakeGame();
