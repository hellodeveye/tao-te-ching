import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/drawer.css'
import './styles/edge-nav.css'
import './styles/responsive.css'

import { chapters } from './data/chapters.js'
import { createTitlePage } from './components/title.js'
import { createChapter, setChapterClickHandler } from './components/chapter.js'
import { createNavigation } from './components/navigation.js'
import { initScroll } from './components/scroll.js'
import { createDrawer, openDrawer } from './components/drawer.js'
import { initEdgeNav } from './components/edge-nav.js'

const app = document.getElementById('app');

// Title page
app.appendChild(createTitlePage());

// 81 chapters
chapters.forEach((ch) => app.appendChild(createChapter(ch)));

// Colophon / end page
const colophon = document.createElement('section');
colophon.className = 'section colophon-page';
colophon.id = 'colophon';
colophon.innerHTML = `
  <div class="section__inner colophon">
    <p>《道德经》</p>
    <p>王弼本 · 简体中文</p>
    <div class="chapter__divider" style="margin: 1.5rem auto;"></div>
    <p>共八十一章</p>
    <p>道经（1–37） · 德经（38–81）</p>
  </div>
`;
app.appendChild(colophon);

// Navigation sidebar
createNavigation(app);

// Scroll + keyboard
initScroll(app);

// Create drawer and wire up chapter clicks
const drawer = createDrawer();
setChapterClickHandler((chapter) => {
  openDrawer(chapter);
});

// Initialize mobile edge navigation
initEdgeNav();
