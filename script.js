const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section[id]");
const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  body.classList.add("light-mode");
  themeToggle.setAttribute("aria-label", "Switch to dark mode");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

const setError = (field, message) => {
  const group = field.closest(".form-group");
  const error = group.querySelector(".error-message");
  group.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusMessage.textContent = "";

  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  let isValid = true;

  if (!name.value.trim()) {
    setError(name, "Please enter your name.");
    isValid = false;
  } else {
    setError(name, "");
  }

  if (!email.value.trim()) {
    setError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    isValid = false;
  } else {
    setError(email, "");
  }

  if (!message.value.trim()) {
    setError(message, "Please enter your message.");
    isValid = false;
  } else {
    setError(message, "");
  }

  if (!isValid) return;

  statusMessage.textContent = "Thank you. Your message has been validated successfully.";
  form.reset();
});
