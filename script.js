// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Function to add page count to a PDF link
async function addPageCount(link) {
  try {
    const pdfUrl = link.href;
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const pageCount = pdf.numPages;
    const title = link.querySelector('.card-title');
    if (title) {
      title.textContent += ` [${pageCount} pg]`;
    }
  } catch (error) {
    console.error(`Failed to load PDF: ${link.href}`, error);
    const title = link.querySelector('.card-title');
    if (title) {
      title.textContent += ` [TBD]`;
    }
    link.classList.add('is-inactive');
    link.addEventListener('click', e => e.preventDefault());
  }
}

// Sidebar scrollspy
function updateActiveSection() {
  const sections = document.querySelectorAll('section');
  const links = document.querySelectorAll('.sidebar a');
  let current = '';

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 150) {
      current = section.id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Project card click handler (avoids nested anchor issues)
document.querySelectorAll('.project-card[data-href]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    window.open(card.dataset.href, '_blank');
  });
});

// Smooth scroll for sidebar links
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Wait for the page to load
window.addEventListener('DOMContentLoaded', () => {
  const pdfLinks = document.querySelectorAll('.pdf-link');
  pdfLinks.forEach(link => addPageCount(link));
  updateActiveSection();
});

window.addEventListener('scroll', updateActiveSection);
