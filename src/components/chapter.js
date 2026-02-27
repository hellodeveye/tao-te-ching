let onChapterClick = null;

export function createChapter(chapter) {
  const section = document.createElement('section');
  section.className = 'section chapter';
  section.id = `chapter-${chapter.id}`;

  section.innerHTML = `
    <div class="section__inner">
      <p class="chapter__label">${chapter.title}　·　${chapter.part}</p>
      <div class="chapter__divider"></div>
      <p class="chapter__text" role="button" tabindex="0" aria-label="点击查看王弼注解">${chapter.text}</p>
    </div>
  `;

  // Add click handler to chapter text
  const textElement = section.querySelector('.chapter__text');
  textElement.addEventListener('click', () => {
    if (onChapterClick) {
      onChapterClick(chapter);
    }
  });

  // Keyboard support
  textElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onChapterClick) {
        onChapterClick(chapter);
      }
    }
  });

  return section;
}

export function setChapterClickHandler(handler) {
  onChapterClick = handler;
}
