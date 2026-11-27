(() => {
  const root = document.documentElement;
  const model = root.dataset.portfolioModel;
  const key = `portfolio-tech${model}-theme`;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let choice = 'dark';
  try { const saved = localStorage.getItem(key); if (['light', 'dark', 'auto'].includes(saved)) choice = saved; } catch {}
  function apply() {
    root.dataset.theme = choice;
    root.dataset.resolvedTheme = choice === 'auto' ? (system.matches ? 'dark' : 'light') : choice;
    document.dispatchEvent(new Event('portfolio-theme'));
    document.querySelectorAll('[data-theme-option]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeOption === choice));
    });
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.setAttribute('aria-label', `Tema atual: ${choice === 'light' ? 'claro' : choice === 'dark' ? 'escuro' : 'automático'}. Escolher tema`);
  }
  apply();
  system.addEventListener('change', () => { if (choice === 'auto') apply(); });
  addEventListener('DOMContentLoaded', () => {
    const control = document.createElement('div');
    control.className = 'portfolio-theme-control';
    control.innerHTML = '<button type="button" data-theme-toggle aria-expanded="false" aria-controls="portfolio-theme-options">◐ <span>Tema</span></button><div id="portfolio-theme-options" class="portfolio-theme-options" hidden><button type="button" data-theme-option="light">☀ <span>Claro</span></button><button type="button" data-theme-option="dark">☾ <span>Escuro</span></button><button type="button" data-theme-option="auto">▣ <span>Automático</span></button></div>';
    document.body.append(control);
    const toggle = control.querySelector('[data-theme-toggle]');
    const options = control.querySelector('.portfolio-theme-options');
    const close = () => { options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      options.hidden = !options.hidden;
      toggle.setAttribute('aria-expanded', String(!options.hidden));
      if (!options.hidden) options.querySelector('[aria-pressed="true"]')?.focus();
    });
    control.querySelectorAll('[data-theme-option]').forEach(button => button.addEventListener('click', () => {
      choice = button.dataset.themeOption;
      try { localStorage.setItem(key, choice); } catch {}
      apply(); close(); toggle.focus();
    }));
    document.addEventListener('pointerdown', event => { if (!control.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !options.hidden) { close(); toggle.focus(); } });
    apply();
  });
})();
