/**
 * Contact form: load the Web3Forms client script (which pulls in hCaptcha,
 * ~45 KB of JS plus third-party cookies) only when the visitor first
 * interacts with the form, instead of on every page view.
 */
const WEB3FORMS_SCRIPT = "https://web3forms.com/client/script.js";

const form = document.querySelector<HTMLFormElement>("form[name='contact']");
const captcha = document.querySelector<HTMLElement>(".h-captcha");

if (form && captcha) {
  // Match the captcha widget to the site theme (must be set before hCaptcha renders).
  captcha.setAttribute(
    "data-theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  let loading: Promise<void> | null = null;
  const loadCaptcha = (): Promise<void> => {
    loading ??= new Promise<void>((resolve) => {
      const s = document.createElement("script");
      s.src = WEB3FORMS_SCRIPT;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null; // allow a retry on the next interaction
        resolve();
      };
      document.body.appendChild(s);
    });
    return loading;
  };

  for (const type of ["focusin", "pointerdown", "touchstart"]) {
    form.addEventListener(type, () => void loadCaptcha(), { once: true, passive: true });
  }

  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.className = "text-sm";
  status.style.color = "var(--accent)";
  captcha.insertAdjacentElement("afterend", status);

  form.addEventListener("submit", (e) => {
    const response = form.querySelector<HTMLTextAreaElement | HTMLInputElement>(
      "[name='h-captcha-response']",
    );
    if (response?.value) {
      status.textContent = "";
      return;
    }
    e.preventDefault();
    void loadCaptcha();
    status.textContent = "Please complete the captcha above, then press Send message again.";
    captcha.scrollIntoView({ block: "center" });
  });
}
