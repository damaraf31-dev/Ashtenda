const nav = document.getElementById('navHeader');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  });

  const mm = document.getElementById('mobileMenu');
  document.getElementById('mmOpen').addEventListener('click', () => mm.classList.add('open'));
  document.getElementById('mmClose').addEventListener('click', () => mm.classList.remove('open'));
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));

  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  revealEls.forEach(el => io.observe(el));

  /* ===== animations ===== */
  const JS = document.documentElement.classList.contains('js');
  const bar = document.getElementById('scrollProgress');
  function updateBar(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }
  window.addEventListener('scroll', updateBar, {passive:true});
  updateBar();

  if(JS){
    // split headline into words
    const h1 = document.querySelector('.hero h1');
    if(h1){
      const txt = h1.textContent.trim();
      h1.setAttribute('aria-label', txt);
      h1.innerHTML = txt.split(/\s+/).map((w,i) => '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>').join(' ');
    }
    // stroke-draw setup for svg lines
    document.querySelectorAll('.hero-svg-card svg *, .svc-icon svg *').forEach((el,i) => {
      if(el.classList.contains('tw')) return;
      el.setAttribute('pathLength','1');
      el.style.setProperty('--d', i);
    });
    // stagger children
    const sio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('in');
          const n = e.target.children.length;
          setTimeout(() => e.target.classList.add('done'), 900 + n*90 + 400);
          sio.unobserve(e.target);
        }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('[data-stagger]').forEach(c => {
      Array.from(c.children).forEach((ch,i) => ch.style.setProperty('--i', i));
      sio.observe(c);
    });
    // hero parallax
    const card = document.querySelector('.hero-svg-card');
    let tick = false;
    window.addEventListener('scroll', () => {
      if(tick || !card) return;
      tick = true;
      requestAnimationFrame(() => {
        card.style.setProperty('--py', (Math.min(window.scrollY,900) * 0.07) + 'px');
        tick = false;
      });
    }, {passive:true});
    // entrance
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('loaded')));
  } else {
    document.querySelectorAll('[data-stagger]').forEach(c => c.classList.add('in'));
  }

  // counters
  function countUp(el){
    const end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1600, t0 = performance.now();
    (function f(t){
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e) + suf;
      if(p < 1) requestAnimationFrame(f);
    })(t0);
  }
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        setTimeout(() => countUp(el), el.closest('.hero') ? 1300 : 200);
        cio.unobserve(el);
      }
    });
  }, {threshold:0.6});
  if(JS){
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = '0' + (el.dataset.suffix || '');
      cio.observe(el);
    });
  }
