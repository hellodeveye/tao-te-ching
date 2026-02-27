let drawerElement = null;
let backdropElement = null;
let closeButton = null;
let contentElement = null;
let currentChapterId = null;
let isOpen = false;

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
