const { createElement: h, useEffect, useState, useRef, Fragment } = React;

/* ------------------------------------------------------------------ *
 *  Farah — the actual content (links, projects, skills, facts) lives
 *  in content.json, not here, so the admin page (admin.html) can edit
 *  and publish it without touching code. These four are filled in by
 *  loadContent() below, before the first render.
 * ------------------------------------------------------------------ */
let LINKS = {};
let projects = [];
let skills = [];
let facts = [];

function applyContent(data) {
  LINKS = data.links;
  projects = data.projects.map((p) => ({
    ...p,
    links: (p.links || []).map((l) => ({
      label: l.label,
      href: l.linkKey ? LINKS[l.linkKey] : l.href,
    })),
  }));
  skills = data.skills;
  facts = data.facts;
}

// Decorative floating bubbles drifting behind the whole page.
// Set to 0 to remove them entirely.
const FLOATING_BALLS = 44;

// Eased "momentum" scrolling + smooth section-to-section navigation.
// Set to false for plain native scrolling.
const SMOOTH_SCROLL = true;

/* ------------------------------------------------------------------ */

const BALL_COLORS = ['#f2559a', '#ff7ab8', '#a786ff', '#68d8d6', '#ffb59a'];

function makeBalls(n) {
  const rnd = (min, max) => min + Math.random() * (max - min);
  return Array.from({ length: n }, (_, id) => {
    const size = rnd(10, 64);
    return {
      id,
      left: rnd(1, 97),
      top: rnd(1, 96),
      size,
      color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
      ring: Math.random() < 0.22,
      opacity: rnd(0.12, 0.3),
      blur: size > 24 ? rnd(0.6, size / 22) : 0,
      dx: rnd(-38, 38),
      dy: rnd(-56, 56),
      duration: rnd(9, 24),
      delay: -rnd(0, 24),
    };
  });
}

function Decor({ count }) {
  const [balls] = useState(() => makeBalls(count));
  if (!count) return null;
  return h(
    'div',
    { className: 'decor', 'aria-hidden': 'true' },
    balls.map((b) =>
      h('span', {
        key: b.id,
        className: 'decor-ball',
        style: {
          left: `${b.left}%`,
          top: `${b.top}%`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          opacity: b.opacity,
          background: b.ring ? 'transparent' : b.color,
          border: b.ring ? `1.5px solid ${b.color}` : 'none',
          filter: b.blur ? `blur(${b.blur}px)` : 'none',
          '--dx': `${b.dx}px`,
          '--dy': `${b.dy}px`,
          animationDuration: `${b.duration}s`,
          animationDelay: `${b.delay}s`,
        },
      })
    )
  );
}

function Nav() {
  return h(
    'nav',
    { className: 'nav' },
    h(
      'a',
      { href: '#top', className: 'nav-brand' },
      'Farah Aqrt',
      h('span', { className: 'nav-brand-tag' }, ' — Portfolio')
    ),
    h(
      'div',
      { className: 'nav-links' },
      h('a', { href: '#about' }, 'About'),
      h('a', { href: '#skills' }, 'Skills'),
      h('a', { href: '#work' }, 'Work'),
      h('a', { href: '#contact' }, 'Contact')
    )
  );
}

function Ambient({ dots }) {
  return h(
    'div',
    { className: 'ambient', 'aria-hidden': 'true' },
    h('span', { className: 'blob blob-a' }),
    h('span', { className: 'blob blob-b' }),
    dots && h('div', { className: 'ring' }),
    dots &&
      [0, 1, 2, 3, 4].map((i) => h('span', { key: i, className: `mesh-dot dot-${i + 1}` }))
  );
}

function Hero() {
  return h(
    'header',
    { className: 'hero', id: 'top' },
    h(Ambient, { dots: true }),
    h(
      'div',
      { className: 'container hero-inner' },
      h(
        'div',
        { className: 'hero-copy' },
        h('p', { className: 'hero-kicker' }, 'Farah Aqrt'),
        h(
          'h1',
          { className: 'hero-title' },
          h('span', { className: 'line' }, 'Software developer'),
          h('span', { className: 'line' }, 'building useful,'),
          h('span', { className: 'line' }, 'expressive interfaces.')
        ),
        h(
          'p',
          { className: 'hero-intro' },
          'I design and build product UIs, dashboards, and small games — from a full school-management platform to a published mobile app.'
        ),
        h(
          'div',
          { className: 'hero-actions' },
          h('a', { href: '#work', className: 'btn btn-solid' }, 'See my work'),
          h(
            'a',
            { href: LINKS.cv, target: '_blank', rel: 'noreferrer', className: 'btn btn-ghost' },
            'Download CV'
          )
        )
      ),
      h(
        'div',
        { className: 'hero-portrait', 'aria-hidden': 'true' },
        h('div', { className: 'portrait-orb' })
      )
    ),
    h('a', { className: 'scroll-cue', href: '#about', 'aria-label': 'Scroll to about section' }, h('span'))
  );
}

function About() {
  return h(
    'section',
    { className: 'section about reveal', id: 'about' },
    h(
      'div',
      { className: 'container about-grid' },
      h(
        'div',
        { className: 'about-media reveal' },
        h(
          'div',
          { className: 'frame frame-paper', 'data-lenis-prevent': true },
          h('img', { src: 'assets/about/cv-screenshot.png', alt: 'Farah Aqrt CV' })
        ),
        h(
          'a',
          { href: LINKS.cv, target: '_blank', rel: 'noreferrer', className: 'btn btn-ghost' },
          'Open CV'
        )
      ),
      h(
        'div',
        { className: 'about-copy reveal' },
        h('p', { className: 'eyebrow' }, 'About'),
        h(
          'h2',
          null,
          'I turn complex school and product ideas into screens people can actually use.'
        ),
        h(
          'p',
          null,
          'I’m a practical software-engineering graduate from the Technion, experienced in full-stack web and mobile development — React, React Native, Node.js, and MySQL. This portfolio follows the same approach: clear structure, a strong pink identity, and motion that feels designed rather than decorative.'
        ),
        h(
          'dl',
          { className: 'facts' },
          facts.map(([k, v]) =>
            h(Fragment, { key: k }, h('dt', null, k), h('dd', null, v))
          )
        )
      )
    )
  );
}

function Skills() {
  return h(
    'section',
    { className: 'section skills reveal', id: 'skills' },
    h(
      'div',
      { className: 'container' },
      h('p', { className: 'eyebrow reveal' }, 'Toolbox'),
      h('h2', { className: 'reveal section-title' }, 'What I build with'),
      h(
        'div',
        { className: 'skill-groups' },
        skills.map((grp) =>
          h(
            'div',
            { key: grp.group, className: 'skill-group reveal' },
            h('h3', null, grp.group),
            h(
              'ul',
              null,
              grp.items.map((it) => h('li', { key: it }, it))
            )
          )
        )
      )
    )
  );
}

function Frame({ variant, src, alt }) {
  if (variant === 'browser') {
    return h(
      'div',
      { className: 'frame frame-browser' },
      h('div', { className: 'frame-bar' }, h('span'), h('span'), h('span')),
      h('div', { className: 'frame-screen' }, h('img', { src, alt }))
    );
  }
  return h('div', { className: 'frame frame-bare' }, h('img', { src, alt }));
}

function ProjectBlock({ project, index, onOpen }) {
  const count = project.gallery.length;
  return h(
    'article',
    { className: 'project reveal', 'data-align': index % 2 ? 'right' : 'left' },
    h(
      'div',
      { className: 'project-visual' },
      h(
        'button',
        {
          className: 'project-visual-btn',
          type: 'button',
          onClick: () => onOpen(project),
          'aria-label': `View ${project.name} screens`,
        },
        h(Frame, { variant: project.frame, src: project.cover, alt: `${project.name} preview` }),
        h('span', { className: 'project-visual-hint' }, `View ${count} screen${count > 1 ? 's' : ''}`)
      )
    ),
    h(
      'div',
      { className: 'project-info' },
      h('p', { className: 'eyebrow' }, project.type),
      h('h3', null, project.name),
      h('p', { className: 'project-summary' }, project.summary),
      h(
        'ul',
        { className: 'stack' },
        project.stack.map((s) => h('li', { key: s }, s))
      ),
      h(
        'div',
        { className: 'project-links' },
        project.links.map((l) =>
          h(
            'a',
            { key: l.label, href: l.href, target: '_blank', rel: 'noreferrer', className: 'btn btn-ghost' },
            l.label
          )
        ),
        h('button', { type: 'button', className: 'btn btn-solid', onClick: () => onOpen(project) }, 'View screens')
      )
    )
  );
}

function Projects({ onOpen }) {
  return h(
    'section',
    { className: 'section work reveal', id: 'work' },
    h(
      'div',
      { className: 'container' },
      h('p', { className: 'eyebrow reveal' }, 'Selected work'),
      h('h2', { className: 'reveal section-title' }, 'Three projects, three problems'),
      h(
        'div',
        { className: 'project-list' },
        projects.map((p, i) => h(ProjectBlock, { key: p.id, project: p, index: i, onOpen }))
      )
    )
  );
}

function ProjectModal({ project, onClose }) {
  const [lightbox, setLightbox] = useState(null);
  const total = project.gallery.length;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightbox != null) setLightbox(null);
        else onClose();
      } else if (lightbox != null && e.key === 'ArrowRight') {
        setLightbox((i) => (i + 1) % total);
      } else if (lightbox != null && e.key === 'ArrowLeft') {
        setLightbox((i) => (i - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, total, onClose]);

  return h(
    'div',
    { className: 'modal-backdrop', onClick: onClose },
    h(
      'div',
      {
        className: 'modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': `${project.name} details`,
        'data-lenis-prevent': true,
        onClick: (e) => e.stopPropagation(),
      },
      h('button', { className: 'modal-close', type: 'button', onClick: onClose, 'aria-label': 'Close' }, '×'),
      h(
        'div',
        { className: 'modal-head' },
        h('p', { className: 'eyebrow' }, project.type),
        h('h2', null, project.name),
        project.details.map((d, i) => h('p', { key: i, className: 'modal-detail' }, d)),
        h(
          'div',
          { className: 'project-links' },
          project.links.map((l) =>
            h(
              'a',
              { key: l.label, href: l.href, target: '_blank', rel: 'noreferrer', className: 'btn btn-ghost' },
              l.label
            )
          )
        )
      ),
      h(
        'div',
        { className: 'gallery' },
        project.gallery.map((g, i) =>
          h(
            'figure',
            { key: g.src, className: 'gallery-item' },
            h(
              'button',
              { type: 'button', onClick: () => setLightbox(i), 'aria-label': `Enlarge: ${g.caption}` },
              h('img', { src: g.src, alt: g.caption, loading: 'lazy' })
            ),
            h('figcaption', null, g.caption)
          )
        )
      )
    ),
    lightbox != null &&
      h(
        'div',
        {
          className: 'lightbox',
          onClick: (e) => {
            e.stopPropagation();
            setLightbox(null);
          },
        },
        total > 1 &&
          h(
            'button',
            {
              className: 'lightbox-nav prev',
              type: 'button',
              'aria-label': 'Previous',
              onClick: (e) => {
                e.stopPropagation();
                setLightbox((i) => (i - 1 + total) % total);
              },
            },
            '‹'
          ),
        h('img', {
          src: project.gallery[lightbox].src,
          alt: project.gallery[lightbox].caption,
          onClick: (e) => e.stopPropagation(),
        }),
        h('p', { className: 'lightbox-cap' }, project.gallery[lightbox].caption),
        total > 1 &&
          h(
            'button',
            {
              className: 'lightbox-nav next',
              type: 'button',
              'aria-label': 'Next',
              onClick: (e) => {
                e.stopPropagation();
                setLightbox((i) => (i + 1) % total);
              },
            },
            '›'
          )
      )
  );
}

function Contact() {
  return h(
    'section',
    { className: 'section contact reveal', id: 'contact' },
    h(Ambient, {}),
    h(
      'div',
      { className: 'container contact-inner reveal' },
      h('p', { className: 'eyebrow' }, 'Contact'),
      h('h2', null, 'Let’s build something'),
      h(
        'p',
        { className: 'contact-lead' },
        'I’m looking for a full-stack or mobile development role where I can keep turning hard problems into clear, working software. The fastest way to reach me is email.'
      ),
      h(
        'div',
        { className: 'contact-actions' },
        h('a', { className: 'btn btn-solid', href: `mailto:${LINKS.email}` }, LINKS.email),
        h('a', { className: 'btn btn-ghost', href: LINKS.linkedin, target: '_blank', rel: 'noreferrer' }, 'LinkedIn'),
        h('a', { className: 'btn btn-ghost', href: LINKS.github, target: '_blank', rel: 'noreferrer' }, 'GitHub')
      )
    ),
    h('footer', { className: 'site-footer' }, `© ${new Date().getFullYear()} Farah Aqrt`)
  );
}

function App() {
  const [active, setActive] = useState(null);
  const lenisRef = useRef(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    document.body.classList.toggle('locked', Boolean(active));
    const lenis = lenisRef.current;
    if (lenis) {
      if (active) lenis.stop();
      else lenis.start();
    }
    return () => document.body.classList.remove('locked');
  }, [active]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const roots = revealEls.filter(
      (el) => el.tagName === 'SECTION' || !el.closest('section.reveal')
    );
    const cleanups = [];

    // ---- Scroll reveals -------------------------------------------------
    // Native IntersectionObserver so content shows even if GSAP/Lenis are
    // blocked. CSS runs the transition. It REPLAYS every time a section
    // enters the viewport (scrolling down or back up), not just once.
    const timers = new Map();
    const clearFor = (el) => {
      (timers.get(el) || []).forEach(window.clearTimeout);
      timers.delete(el);
    };
    const enter = (el) => {
      clearFor(el);
      el.classList.add('in');
      const kids = Array.from(el.querySelectorAll('.reveal'));
      const ids = kids.map((kid, i) =>
        window.setTimeout(() => kid.classList.add('in'), 70 + i * 85)
      );
      if (ids.length) timers.set(el, ids);
    };
    const leave = (el) => {
      clearFor(el);
      el.classList.remove('in');
      el.querySelectorAll('.reveal').forEach((kid) => kid.classList.remove('in'));
    };

    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (navigatingRef.current) return;
          entries.forEach((entry) => (entry.isIntersecting ? enter : leave)(entry.target));
        },
        { threshold: 0, rootMargin: '-8% 0px -14% 0px' }
      );
      roots.forEach((el) => io.observe(el));
      const failsafe = window.setTimeout(
        () => revealEls.forEach((el) => el.classList.add('in')),
        4000
      );
      cleanups.push(() => {
        io.disconnect();
        window.clearTimeout(failsafe);
        timers.forEach((ids) => ids.forEach(window.clearTimeout));
      });
    }

    // ---- Smooth section-to-section navigation -------------------------
    const docTop = (el) => {
      let y = 0;
      for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
      return y;
    };
    const onNavClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const sel = link.getAttribute('href');
      const target = sel.length > 1 && document.querySelector(sel);
      if (!target) return;
      e.preventDefault();
      const y = Math.max(0, docTop(target) - 80);
      const arrive = () => {
        navigatingRef.current = false;
        if (reduce) return;
        const vh = window.innerHeight;
        roots.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.86 && r.bottom > vh * 0.08) enter(el);
        });
      };
      navigatingRef.current = true;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.1, onComplete: arrive });
        window.setTimeout(arrive, 1500);
      } else {
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
        window.setTimeout(arrive, 700);
      }
    };
    document.addEventListener('click', onNavClick);
    cleanups.push(() => document.removeEventListener('click', onNavClick));

    // ---- Lenis: eased "momentum" wheel scrolling ---------------------
    if (SMOOTH_SCROLL && !reduce && typeof window.Lenis === 'function') {
      const lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
      lenisRef.current = lenis;
      const g = window.gsap;
      const ST = window.ScrollTrigger;
      if (ST) lenis.on('scroll', ST.update);
      const withGsap = Boolean(g && g.ticker);
      const tick = (t) => lenis.raf(withGsap ? t * 1000 : t);
      let frame;
      if (withGsap) {
        g.ticker.add(tick);
        g.ticker.lagSmoothing(0);
      } else {
        const loop = (t) => {
          tick(t);
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      }
      cleanups.push(() => {
        if (withGsap) g.ticker.remove(tick);
        else cancelAnimationFrame(frame);
        lenis.destroy();
        lenisRef.current = null;
      });
    }

    // ---- GSAP decorative parallax (nothing here hides content) -------
    if (!reduce && window.gsap && window.ScrollTrigger) {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.to('.hero .blob-a', {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero .blob-b', {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.mesh-dot', { y: -16, repeat: -1, yoyo: true, duration: 2.8, stagger: 0.25, ease: 'sine.inOut' });
        gsap.utils.toArray('.project-visual').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 22 },
            { y: -22, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } }
          );
        });
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);
      cleanups.push(() => {
        window.removeEventListener('load', onLoad);
        ctx.revert();
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return h(
    Fragment,
    null,
    h(Decor, { count: FLOATING_BALLS }),
    h(Nav),
    h(Hero),
    h(About),
    h(Skills),
    h(Projects, { onOpen: setActive }),
    h(Contact),
    active && h(ProjectModal, { project: active, onClose: () => setActive(null) })
  );
}

fetch('content.json', { cache: 'no-store' })
  .then((res) => {
    if (!res.ok) throw new Error(`content.json ${res.status}`);
    return res.json();
  })
  .then((data) => {
    applyContent(data);
    ReactDOM.createRoot(document.getElementById('root')).render(h(App));
  })
  .catch((err) => {
    console.error('Failed to load content.json', err);
    document.getElementById('root').innerHTML =
      '<p style="max-width:520px;margin:15vh auto;padding:0 24px;font:16px/1.6 sans-serif;color:#7a1f50;text-align:center">' +
      'Could not load the page content (content.json). If you just opened this file directly, ' +
      'serve it over http instead — e.g. <code>npx serve</code> — or check your connection and reload.</p>';
  });
