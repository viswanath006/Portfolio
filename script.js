// Reveal project cards and about cards as they enter the viewport
document.addEventListener('DOMContentLoaded', () => {
  const revealables = document.querySelectorAll('.project-card, .about-card, .stack-group');

  revealables.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealables.forEach(el => observer.observe(el));
});
