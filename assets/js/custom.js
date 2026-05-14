// custom.js (load with: <script src="../assets/js/custom.js" type="module"></script>)
document.addEventListener('DOMContentLoaded', async () => {

  // ========= Date & Time (footer) =========
  const dtEl = document.getElementById('datetime');
  if (dtEl) {
    const updateDateTime = () => {
      const now = new Date();
      dtEl.textContent = now.toLocaleString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // ========= Mobile hamburger toggle =========
  const toggleBtn = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (toggleBtn && primaryNav) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open', !expanded);
      toggleBtn.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    });

    // Close menu after clicking a link
    primaryNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (toggleBtn.getAttribute('aria-expanded') === 'true') {
          toggleBtn.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
          toggleBtn.setAttribute('aria-label', 'Open menu');
        }
      });
    });
  }

  // ========= Gallery: PhotoSwipe (only on gallery page) =========
  const gridEl = document.getElementById('grid');
  if (gridEl) {
    // Dynamic import so non-gallery pages don't load this code
    const { default: PhotoSwipeLightbox } = await import('https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.min.js');
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#grid',
      children: 'a.image.thumb',
      pswpModule: () => import('https://unpkg.com/photoswipe@5/dist/photoswipe.esm.js')
    });
    lightbox.init();
  }

  // ========= Gallery: Category filters (no inline onclick) =========
  const filtersEl = document.getElementById('gallery-filters');
  if (filtersEl && gridEl) {
    const items = Array.from(gridEl.querySelectorAll('.work-item'));
    const buttons = Array.from(filtersEl.querySelectorAll('a[data-cat]'));

    const applyFilter = (cat) => {
      items.forEach(el => {
        el.style.display = (cat === '*' || el.classList.contains(cat)) ? '' : 'none';
      });
      // Active state
      buttons.forEach(b => b.classList.remove('is-active'));
      const hash = (cat === '*') ? '#all' : `#${cat}`;
      const activeBtn = filtersEl.querySelector(`a[href="${hash}"]`);
      if (activeBtn) activeBtn.classList.add('is-active');
    };

    // Handle clicks
    filtersEl.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-cat]');
      if (!link) return;
      e.preventDefault();
      const cat = link.dataset.cat || '*';
      applyFilter(cat);
      const hash = (cat === '*') ? '#all' : `#${cat}`;
      if (history.replaceState) history.replaceState(null, '', hash);
    });

    // Initial state from hash; default to All
    const initialHash = (location.hash || '#all').toLowerCase();
    const allowed = new Set(buttons.map(b => (b.dataset.cat === '*' ? '#all' : `#${b.dataset.cat}`)));
    const initialCat = allowed.has(initialHash) ? (initialHash === '#all' ? '*' : initialHash.slice(1)) : '*';
    applyFilter(initialCat);
  }

});

// Pause ticker on hover
document.addEventListener('DOMContentLoaded', () => {
  const ticker = document.querySelector('.news-ticker ul');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }
});

// Reviews slider 
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("testimonial-item");
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    
    // Show the current slide
    slides[slideIndex-1].style.display = "block";  
    
    setTimeout(showSlides, 8000); // Change review every 8 seconds
}

