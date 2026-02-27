import { chapters } from '../data/chapters.js';

export function createNavigation(app) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.id = 'nav';

  // Scrollable content area for chapter list
  const navContent = document.createElement('div');
  navContent.className = 'nav__content';

  // Hamburger toggle for mobile
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', '导航菜单');
  toggle.textContent = '☰';
  toggle.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
  });

  // Close nav when clicking on nav items (mobile)
  nav.addEventListener('click', (e) => {
    if (e.target.closest('.nav__item') || e.target.closest('.nav__tool-btn')) {
      nav.classList.remove('nav--open');
    }
  });

  // Group labels
  let currentPart = '';
  chapters.forEach((ch) => {
    if (ch.part !== currentPart) {
      currentPart = ch.part;
      const label = document.createElement('span');
      label.className = 'nav__group-label';
      label.textContent = currentPart;
      navContent.appendChild(label);
    }

    const item = document.createElement('span');
    item.className = 'nav__item';
    item.dataset.chapter = ch.id;
    item.textContent = ch.id;
    item.addEventListener('click', () => {
      const target = document.getElementById(`chapter-${ch.id}`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('nav--open');
    });
    navContent.appendChild(item);
  });

  // Toolbar at bottom
  const toolbar = document.createElement('div');
  toolbar.className = 'nav__toolbar';

  // Random button
  const randomBtn = document.createElement('button');
  randomBtn.className = 'nav__tool-btn';
  randomBtn.setAttribute('aria-label', '随机章节');
  randomBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.8538 11.1462C14.9002 11.1927 14.9371 11.2478 14.9623 11.3085C14.9874 11.3692 15.0004 11.4343 15.0004 11.5C15.0004 11.5657 14.9874 11.6307 14.9623 11.6914C14.9371 11.7521 14.9002 11.8073 14.8538 11.8537L13.3538 13.3537C13.2599 13.4475 13.1327 13.5003 13 13.5003C12.8673 13.5003 12.7401 13.4475 12.6462 13.3537C12.5524 13.2599 12.4997 13.1327 12.4997 13C12.4997 12.8673 12.5524 12.74 12.6462 12.6462L13.2931 12H12.5588C11.8426 11.9994 11.1368 11.8281 10.5 11.5004C9.86322 11.1727 9.31365 10.698 8.89688 10.1156L6.28937 6.4656C5.96519 6.01263 5.53775 5.64342 5.04246 5.38855C4.54716 5.13367 3.99827 5.00047 3.44125 4.99997H2C1.86739 4.99997 1.74021 4.94729 1.64645 4.85353C1.55268 4.75976 1.5 4.63258 1.5 4.49997C1.5 4.36736 1.55268 4.24019 1.64645 4.14642C1.74021 4.05265 1.86739 3.99997 2 3.99997H3.44125C4.15743 4.00057 4.86316 4.17181 5.49997 4.49951C6.13679 4.82721 6.68635 5.30193 7.10313 5.88435L9.71062 9.53435C10.0348 9.98732 10.4623 10.3565 10.9575 10.6114C11.4528 10.8663 12.0017 10.9995 12.5588 11H13.2931L12.6462 10.3537C12.5524 10.2599 12.4997 10.1327 12.4997 9.99997C12.4997 9.86729 12.5524 9.74004 12.6462 9.64622C12.7401 9.5524 12.8673 9.49969 13 9.49969C13.1327 9.49969 13.2599 9.5524 13.3538 9.64622L14.8538 11.1462ZM8.9375 6.68747C8.99093 6.72564 9.05136 6.75291 9.11533 6.76772C9.1793 6.78254 9.24556 6.7846 9.31033 6.77381C9.3751 6.76301 9.4371 6.73957 9.49281 6.70481C9.54852 6.67005 9.59684 6.62466 9.635 6.57122L9.71 6.46685C10.0341 6.01356 10.4616 5.64406 10.957 5.38896C11.4524 5.13386 12.0015 5.00051 12.5588 4.99997H13.2931L12.6462 5.64622C12.5524 5.74004 12.4997 5.86729 12.4997 5.99997C12.4997 6.13265 12.5524 6.2599 12.6462 6.35372C12.7401 6.44754 12.8673 6.50025 13 6.50025C13.1327 6.50025 13.2599 6.44754 13.3538 6.35372L14.8538 4.85372C14.9002 4.80729 14.9371 4.75214 14.9623 4.69144C14.9874 4.63074 15.0004 4.56568 15.0004 4.49997C15.0004 4.43427 14.9874 4.3692 14.9623 4.3085C14.9371 4.2478 14.9002 4.19266 14.8538 4.14622L13.3538 2.64622C13.2599 2.5524 13.1327 2.49969 13 2.49969C12.8673 2.49969 12.7401 2.5524 12.6462 2.64622C12.5524 2.74004 12.4997 2.86729 12.4997 2.99997C12.4997 3.13265 12.5524 3.2599 12.6462 3.35372L13.2931 3.99997H12.5588C11.8426 4.00057 11.1368 4.17181 10.5 4.49951C9.86322 4.82721 9.31365 5.30193 8.89688 5.88435L8.82187 5.98872C8.78348 6.04216 8.75601 6.10264 8.74104 6.16672C8.72607 6.23079 8.7239 6.29719 8.73464 6.3621C8.74538 6.42701 8.76883 6.48917 8.80364 6.545C8.83845 6.60084 8.88394 6.64925 8.9375 6.68747ZM7.0625 9.31247C7.00907 9.27431 6.94864 9.24704 6.88467 9.23222C6.8207 9.21741 6.75444 9.21534 6.68967 9.22614C6.6249 9.23693 6.56289 9.26038 6.50719 9.29514C6.45148 9.3299 6.40316 9.37529 6.365 9.42872L6.29 9.5331C5.96589 9.98638 5.53841 10.3559 5.04299 10.611C4.54757 10.8661 3.99849 10.9994 3.44125 11H2C1.86739 11 1.74021 11.0527 1.64645 11.1464C1.55268 11.2402 1.5 11.3674 1.5 11.5C1.5 11.6326 1.55268 11.7598 1.64645 11.8535C1.74021 11.9473 1.86739 12 2 12H3.44125C4.15743 11.9994 4.86316 11.8281 5.49997 11.5004C6.13679 11.1727 6.68635 10.698 7.10313 10.1156L7.17812 10.0112C7.21652 9.95779 7.24399 9.8973 7.25896 9.83323C7.27393 9.76916 7.2761 9.70276 7.26536 9.63785C7.25462 9.57293 7.23117 9.51078 7.19636 9.45494C7.16155 9.39911 7.11606 9.35069 7.0625 9.31247Z" fill="currentColor"/>
    </svg>
  `;
  randomBtn.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 81) + 1;
    const target = document.getElementById(`chapter-${randomId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('nav--open');
    }
  });

  toolbar.appendChild(randomBtn);

  nav.appendChild(navContent);
  nav.appendChild(toolbar);

  document.body.prepend(toggle);
  document.body.prepend(nav);

  return nav;
}

export function setActiveNav(chapterId) {
  const items = document.querySelectorAll('.nav__item');
  items.forEach((item) => {
    const isActive = Number(item.dataset.chapter) === chapterId;
    item.classList.toggle('nav__item--active', isActive);
    if (isActive) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}
