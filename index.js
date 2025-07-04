document.addEventListener('DOMContentLoaded', function() {
  // FAQ dropdown and controls
  const faqItems = document.querySelectorAll('.faq-item');
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      faqItem.classList.toggle('active');
    });
  });
  document.getElementById('expandAllBtn').onclick = () => {
    faqItems.forEach(item => item.classList.add('active'));
  };
  document.getElementById('collapseAllBtn').onclick = () => {
    faqItems.forEach(item => item.classList.remove('active'));
  };

  // Animate timeline progress bar
  setTimeout(() => {
    const progress = document.getElementById('timeline-progress');
    if(progress) progress.style.width = '80%';
  }, 200);

  // Animate cards on scroll
  function revealOnScroll() {
    document.querySelectorAll('.card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if(rect.top < window.innerHeight - 80) card.classList.add('visible');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
});
