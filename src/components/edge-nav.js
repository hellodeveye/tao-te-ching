// Edge navigation for mobile - right side chapter index
// Minimal design: 81 chapter numbers floating directly on content

let edgeNavElement = null;
let isActive = false;
let isLongPress = false;
let longPressTimer = null;
let currentChapter = 1;

const LONG_PRESS_DELAY = 500; // ms, time to hold before showing nav

// Generate array of 1-81 for all chapters
const chapters = Array.from({ length: 81 }, (_, i) => i + 1);

export function initEdgeNav() {
  // Only initialize on touch devices or mobile viewport
  if (!isTouchDevice() && window.innerWidth > 768) {
    return;
  }

  createEdgeNav();
  setupEventListeners();
  setupIntersectionObserver();
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function createEdgeNav() {
  edgeNavElement = document.createElement('div');
  edgeNavElement.className = 'edge-nav';
  edgeNavElement.setAttribute('aria-hidden', 'true');

  // Create touch zone (invisible but captures touches)
  const touchZone = document.createElement('div');
  touchZone.className = 'edge-nav__touch-zone';

  // Create visible index strip with all 81 chapters
  const indexStrip = document.createElement('div');
  indexStrip.className = 'edge-nav__strip';

  chapters.forEach((chapter) => {
    const item = document.createElement('div');
    item.className = 'edge-nav__item';
    item.dataset.chapter = chapter;
    item.textContent = chapter;
    indexStrip.appendChild(item);
  });

  edgeNavElement.appendChild(touchZone);
  edgeNavElement.appendChild(indexStrip);
  document.body.appendChild(edgeNavElement);
}

function setupIntersectionObserver() {
  // Track which chapter is currently visible
  const sections = document.querySelectorAll('.section[data-chapter]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapter = parseInt(entry.target.dataset.chapter, 10);
          if (chapter) {
            currentChapter = chapter;
            updateActiveItem(chapter);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

function updateActiveItem(chapter) {
  if (!edgeNavElement) return;

  const items = edgeNavElement.querySelectorAll('.edge-nav__item');
  items.forEach((item) => {
    const itemChapter = parseInt(item.dataset.chapter, 10);
    const diff = Math.abs(itemChapter - chapter);

    item.classList.remove('edge-nav__item--active', 'edge-nav__item--near');

    if (itemChapter === chapter) {
      item.classList.add('edge-nav__item--active');
    } else if (diff <= 2) {
      item.classList.add('edge-nav__item--near');
    }
  });
}

function setupEventListeners() {
  if (!edgeNavElement) return;

  const touchZone = edgeNavElement.querySelector('.edge-nav__touch-zone');
  const strip = edgeNavElement.querySelector('.edge-nav__strip');

  // Touch events on the right edge zone
  touchZone.addEventListener('touchstart', handleTouchStart, { passive: false });
  touchZone.addEventListener('touchmove', handleTouchMove, { passive: false });
  touchZone.addEventListener('touchend', handleTouchEnd, { passive: true });
  touchZone.addEventListener('touchcancel', handleTouchEnd, { passive: true });

  // Also handle mouse events for desktop testing
  touchZone.addEventListener('mouseenter', handleMouseEnter);
  touchZone.addEventListener('mouseleave', handleMouseLeave);

  // Listen for drawer open/close to disable/enable edge nav
  document.addEventListener('drawer-state-change', handleDrawerStateChange);
}

function handleTouchStart(e) {
  // Don't activate if drawer is open
  if (isDrawerOpen()) return;

  e.preventDefault();
  isActive = true;
  isLongPress = false;

  // Start long press timer
  longPressTimer = setTimeout(() => {
    isLongPress = true;
    edgeNavElement.classList.add('edge-nav--active');
    updateTargetFromTouch(e.touches[0].clientY);
  }, LONG_PRESS_DELAY);
}

function handleTouchMove(e) {
  if (!isActive) return;

  e.preventDefault();

  // Only update if long press has been triggered
  if (isLongPress) {
    updateTargetFromTouch(e.touches[0].clientY);
  }
}

function handleTouchEnd(e) {
  if (!isActive) return;

  // Clear the long press timer
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  isActive = false;
  edgeNavElement.classList.remove('edge-nav--active');

  // Only scroll if long press was triggered (held long enough)
  if (isLongPress && currentChapter) {
    const targetSection = document.getElementById(`chapter-${currentChapter}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isLongPress = false;
}

function handleMouseEnter() {
  if (isDrawerOpen()) return;
  edgeNavElement.classList.add('edge-nav--active');
}

function handleMouseLeave() {
  edgeNavElement.classList.remove('edge-nav--active');
}

function updateTargetFromTouch(clientY) {
  const strip = edgeNavElement.querySelector('.edge-nav__strip');
  const stripRect = strip.getBoundingClientRect();

  // Calculate relative position within the strip
  const relativeY = clientY - stripRect.top;
  const itemHeight = stripRect.height / chapters.length;
  const index = Math.floor(relativeY / itemHeight);

  // Clamp index to valid range
  const clampedIndex = Math.max(0, Math.min(index, chapters.length - 1));
  const targetChapter = chapters[clampedIndex];

  // Update current chapter and visual highlight
  currentChapter = targetChapter;
  updateActiveItem(targetChapter);
}

function isDrawerOpen() {
  // Check if drawer is open by looking for the open class
  const drawer = document.querySelector('.drawer');
  return drawer && drawer.classList.contains('drawer--open');
}

function handleDrawerStateChange(e) {
  // When drawer opens, ensure edge nav is hidden and clear any pending timer
  if (e.detail && e.detail.isOpen) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    isActive = false;
    isLongPress = false;
    edgeNavElement.classList.remove('edge-nav--active');
  }
}

// Public function to manually disable edge nav (e.g., when drawer opens)
export function disableEdgeNav() {
  if (edgeNavElement) {
    edgeNavElement.classList.add('edge-nav--disabled');
  }
}

// Public function to re-enable edge nav
export function enableEdgeNav() {
  if (edgeNavElement) {
    edgeNavElement.classList.remove('edge-nav--disabled');
  }
}
