import { setActiveNav } from './navigation.js';

export function initScroll(app) {
  const sections = app.querySelectorAll('.section');
  let currentIndex = 0;

  // IntersectionObserver to track active section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section--visible');
          const id = entry.target.id;
          const match = id.match(/chapter-(\d+)/);
          if (match) {
            const chapterId = Number(match[1]);
            setActiveNav(chapterId);
            history.replaceState(null, '', `#${id}`);
          } else {
            setActiveNav(0);
            history.replaceState(null, '', '#');
          }
          currentIndex = Array.from(sections).indexOf(entry.target);
        }
      });
    },
    { root: app, threshold: 0.5 }
  );

  sections.forEach((s) => observer.observe(s));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Restore position from URL hash on load
  const hash = window.location.hash;
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView());
    }
  }
}
