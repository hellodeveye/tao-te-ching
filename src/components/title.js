export function createTitlePage() {
  const section = document.createElement('section');
  section.className = 'section title-page';
  section.id = 'title';

  section.innerHTML = `
    <div class="section__inner">
      <h1 class="title-page__heading">道德经</h1>
      <p class="title-page__author">老子 著</p>
    </div>
  `;

  return section;
}
