let drawerElement = null;
let backdropElement = null;
let closeButton = null;
let contentElement = null;
let currentChapterId = null;
let isOpen = false;

// Touch handling state for mobile swipe
let touchStartY = 0;
let touchCurrentY = 0;
let isDragging = false;

export function createDrawer() {
  // Create backdrop
  backdropElement = document.createElement('div');
  backdropElement.className = 'drawer-backdrop';
  backdropElement.addEventListener('click', closeDrawer);
  document.body.appendChild(backdropElement);

  // Create drawer
  drawerElement = document.createElement('aside');
  drawerElement.className = 'drawer';
  drawerElement.setAttribute('role', 'dialog');
  drawerElement.setAttribute('aria-modal', 'true');
  drawerElement.setAttribute('aria-label', '王弼注解');

  drawerElement.innerHTML = `
    <button class="drawer__close" aria-label="关闭">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="drawer__content"></div>
  `;

  document.body.appendChild(drawerElement);

  // Get content container
  contentElement = drawerElement.querySelector('.drawer__content');

  // Close button
  closeButton = drawerElement.querySelector('.drawer__close');
  closeButton.addEventListener('click', closeDrawer);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyDown);

  // Touch/swipe handling for mobile bottom sheet
  setupTouchHandling();

  return {
    open: openDrawer,
    close: closeDrawer,
    isOpen: () => isOpen,
    updateContent: renderAnnotation
  };
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && isOpen) {
    e.preventDefault();
    closeDrawer();
  }
}

export function openDrawer(chapter) {
  if (!drawerElement || !chapter) return;

  currentChapterId = chapter.id;
  isOpen = true;

  renderAnnotation(chapter);

  drawerElement.classList.add('drawer--open');
  backdropElement.classList.add('drawer-backdrop--visible');

  // Prevent body scroll when drawer is open on mobile
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'hidden';
  }
}

export function closeDrawer() {
  if (!drawerElement) return;

  isOpen = false;
  currentChapterId = null;

  // Reset any inline transform from dragging
  drawerElement.style.transform = '';
  drawerElement.classList.remove('drawer--open');
  backdropElement.classList.remove('drawer-backdrop--visible');

  // Restore body scroll
  document.body.style.overflow = '';
}

function renderAnnotation(chapter) {
  if (!contentElement || !chapter) return;

  const hasAnnotation = chapter.annotation && chapter.annotation.trim().length > 0;

  contentElement.innerHTML = `
    <div class="drawer__body">
      ${hasAnnotation ? `
        <div class="drawer__annotation">
          <h3 class="drawer__annotation-title">【王弼注】</h3>
          <div class="drawer__annotation-text">
            ${formatAnnotation(chapter.annotation)}
          </div>
        </div>
      ` : '<p class="drawer__no-annotation">此章暂无注解</p>'}
    </div>
  `;
}

function formatAnnotation(text) {
  // Split by double newlines to create paragraphs
  return escapeHtml(text)
    .split(/\n\n+/)
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getCurrentChapterId() {
  return currentChapterId;
}

// Track touch start time for velocity calculation
let touchStartTime = 0;

// Touch handling for mobile swipe-to-close
function setupTouchHandling() {
  if (!drawerElement) return;

  // Touch start - begin tracking
  drawerElement.addEventListener('touchstart', (e) => {
    if (!isOpen) return;

    // Only start drag from the top area or drag handle area
    const rect = drawerElement.getBoundingClientRect();
    const touchY = e.touches[0].clientY;

    // Allow dragging from top 60px of drawer (drag handle + margin)
    if (touchY - rect.top > 60) return;

    touchStartY = touchY;
    touchCurrentY = touchY;
    touchStartTime = Date.now();
    isDragging = true;

    // Disable transition during drag
    drawerElement.style.transition = 'none';
  }, { passive: true });

  // Touch move - update position
  drawerElement.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    touchCurrentY = e.touches[0].clientY;
    const deltaY = touchCurrentY - touchStartY;

    // Only allow dragging down (positive delta)
    if (deltaY > 0) {
      // Apply resistance to make it feel natural
      const resistance = 0.6;
      const translateY = deltaY * resistance;
      drawerElement.style.transform = `translateY(${translateY}px)`;
    }
  }, { passive: true });

  // Touch end - determine if should close
  drawerElement.addEventListener('touchend', () => {
    if (!isDragging) return;

    isDragging = false;
    drawerElement.style.transition = '';

    const deltaY = touchCurrentY - touchStartY;
    const velocity = deltaY / (Date.now() - touchStartTime || 1);

    // Close if dragged down more than 100px or with enough velocity
    if (deltaY > 100 || (deltaY > 50 && velocity > 0.5)) {
      closeDrawer();
    } else {
      // Snap back open
      drawerElement.classList.add('drawer--open');
    }

    touchStartY = 0;
    touchCurrentY = 0;
  });

  // Touch cancel - reset state
  drawerElement.addEventListener('touchcancel', () => {
    if (!isDragging) return;

    isDragging = false;
    drawerElement.style.transition = '';
    drawerElement.classList.add('drawer--open');

    touchStartY = 0;
    touchCurrentY = 0;
  });
}
