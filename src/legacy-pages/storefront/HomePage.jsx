import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import HeroCanvas from '../../components/hero/HeroCanvas';
import useBeautyStore from '../../store/beautyStore';
import { getProducts } from '../../api/productApi';
import heroShot from '../../assets/hero.png';
import heroRhode from '../../assets/hero-rhode.jpg';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionArticle = motion.article;

const FEATURE_CARDS = [
  {
    eyebrow: 'Selection',
    title: 'Curated global brands',
    body: 'A focused edit of coveted beauty names, chosen for strong formulas, standout shades, and real demand.',
    stat: 'Rhode, Flower Knows, and more',
  },
  {
    eyebrow: 'Authenticity',
    title: 'Sourced with care',
    body: 'Every item is selected for customers who want hard-to-find makeup without compromising on trust or presentation.',
    stat: 'Original products only',
  },
  {
    eyebrow: 'Experience',
    title: 'Shopping that feels elevated',
    body: 'Editorial visuals, refined pacing, and clean product focus make the storefront feel premium from the first scroll.',
    stat: 'Luxury without clutter',
  },
  {
    eyebrow: 'Availability',
    title: 'Built for the beauty obsessed',
    body: 'From glossy lip essentials to statement palettes, the range is shaped around what customers are actively searching for now.',
    stat: 'Trending shades, cult favourites',
  },
];

const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-1',
    slug: 'velvet-bloom-elixir',
    name: 'Rhode Peptide Lip Tint',
    category: 'Tinted Lip Treatment',
    brand: 'Kivara',
    price: 3200,
    accent: '#f2a7bb',
    images: ['/images/lipstick.png'],
  },
  {
    _id: 'fallback-2',
    slug: 'moonpetal-highlighter',
    name: 'Flower Knows Moonlight Palette',
    category: 'Eyeshadow Palette',
    brand: 'Kivara',
    price: 2650,
    accent: '#d4a96a',
    images: ['/images/highlighter.png'],
  },
  {
    _id: 'fallback-3',
    slug: 'rococo-tint-serum',
    name: 'Soft Glow Everyday Edit',
    category: 'Curated Beauty Pick',
    brand: 'Kivara',
    price: 2150,
    accent: '#c0446a',
    images: [heroShot],
  },
];

const STORY_SLIDES = [
  {
    title: 'A reseller storefront with the feel of a beauty editorial.',
    copy: 'Products are presented with the polish of a campaign shoot, while still staying clear enough to browse and shop.',
    image: heroShot,
  },
  {
    title: 'Coveted products, styled for discovery.',
    copy: 'The goal is simple: make popular beauty finds feel special without losing the confidence and clarity a shopper needs.',
    image: '/images/lipstick.png',
  },
  {
    title: 'Soft luxury for the modern makeup customer.',
    copy: 'Every section balances atmosphere with utility so the page can sell while still feeling memorable.',
    image: '/images/highlighter.png',
  },
];

const TESTIMONIALS = [
  {
    quote: 'It feels like shopping a beautifully styled beauty closet instead of scrolling through a crowded catalog.',
    name: 'Aanya Mehra',
    title: 'Beauty Editor',
  },
  {
    quote: 'The products look desirable immediately, and the site still makes it easy to understand what is actually being sold.',
    name: 'Rhea Kapoor',
    title: 'Makeup Artist',
  },
  {
    quote: 'It gives premium reseller energy, not generic e-commerce energy, and that makes a huge difference.',
    name: 'Mira Sethi',
    title: 'Kivara Collector',
  },
];

const INTRO_DURATION_MS = 1500;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function useHoverChime(soundEnabled) {
  const audioContextRef = useRef(null);
  const lastPlayedRef = useRef(0);

  return () => {
    if (!soundEnabled) {
      return;
    }

    const now = Date.now();
    if (now - lastPlayedRef.current < 140) {
      return;
    }

    lastPlayedRef.current = now;

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.015, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
  };
}

function IntroOverlay() {
  const particles = useMemo(
    () =>
      Array.from({ length: 64 }, (_, index) => {
        const angle = (index / 64) * Math.PI * 2;
        const radius = 260 + (index % 9) * 26;
        return {
          id: index,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          targetX: Math.cos(angle * 1.4) * 36,
          targetY: Math.sin(angle * 1.7) * 120,
          delay: (index % 10) * 0.015,
        };
      }),
    [],
  );

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
    >
      <MotionDiv
        className="intro-overlay__core"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <MotionDiv
        className="intro-overlay__silhouette"
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(16px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      />

      {particles.map((particle) => (
        <MotionSpan
          key={particle.id}
          className="intro-overlay__particle"
          initial={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.2 }}
          animate={{
            x: particle.targetX,
            y: particle.targetY,
            opacity: [0, 0.85, 0.15],
            scale: [0.15, 1, 0.35],
          }}
          transition={{
            duration: 1.1,
            delay: particle.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </motion.div>
  );
}

function HeroPaletteVisual() {
  return (
    <div className="hero-visual hero-copy-item" data-reveal>
      <MotionDiv
        className="hero-visual__halo"
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <MotionDiv
        className="hero-visual__frame"
        animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img src={heroRhode} alt="Rhode peptide lip tint hero visual with berries and glossy drips" />
        <div className="hero-visual__shine" />
        <div className="hero-visual__grain" />
      </MotionDiv>
    </div>
  );
}

function CursorOrb({ isMobile }) {
  const cursorVariant = useBeautyStore((state) => state.cursorVariant);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.25 });

  useEffect(() => {
    if (isMobile) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isMobile, x, y]);

  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className={`cursor-orb cursor-orb--${cursorVariant}`}
      style={{ x: springX, y: springY }}
      animate={{
        width: cursorVariant === 'hover' ? 32 : 12,
        height: cursorVariant === 'hover' ? 32 : 12,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    />
  );
}

function ProgressRail() {
  const scrollProgress = useBeautyStore((state) => state.scrollProgress);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <motion.span className="scroll-progress__fill" animate={{ scaleY: Math.max(scrollProgress, 0.02) }} />
    </div>
  );
}

function TiltProductCard({ product }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const productImage = product.images?.[0] || heroShot;
  const accent = product.accent || '#f2a7bb';

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: relativeY * -14, y: relativeX * 16 });
  };

  return (
    <Link to={`/product/${product.slug}`} className="shop-card" data-reveal>
      <MotionArticle
        whileHover={{ y: -8 }}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <MotionDiv
          className="shop-card__inner"
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            transformPerspective: 1200,
          }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          <div className="shop-card__glow" style={{ background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 70%)` }} />
          <div className="shop-card__frame" />
          <div className="shop-card__media">
            <img src={productImage} alt={product.name} />
          </div>
          <div className="shop-card__meta">
            <p>{product.category || product.brand || 'Kivara'}</p>
            <h3>{product.name}</h3>
            <span>{`Rs. ${Number(product.price).toLocaleString()}`}</span>
          </div>
        </MotionDiv>
      </MotionArticle>
    </Link>
  );
}

function StoryCarousel({ activeIndex }) {
  const slide = STORY_SLIDES[activeIndex];

  return (
    <div className="story-carousel">
      <AnimatePresence mode="wait">
        <MotionDiv
          key={slide.title}
          className="story-carousel__frame"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={slide.image} alt={slide.title} />
          <div className="story-carousel__grade" />
          <div className="story-carousel__copy">
            <p>{slide.title}</p>
            <span>{slide.copy}</span>
          </div>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}

function TestimonialsCarousel({ activeIndex }) {
  const active = TESTIMONIALS[activeIndex];

  return (
    <div className="testimonial-stack" data-reveal>
      <div className="testimonial-stack__ghost testimonial-stack__ghost--one" />
      <div className="testimonial-stack__ghost testimonial-stack__ghost--two" />

      <AnimatePresence mode="wait">
        <MotionArticle
          key={active.name}
          className="testimonial-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="testimonial-card__quote-mark">"</span>
          <p className="testimonial-card__quote">{active.quote}</p>
          <div className="testimonial-card__footer">
            <span>{active.name}</span>
            <strong>{active.title}</strong>
          </div>
          <div className="testimonial-card__rating">*****</div>
        </MotionArticle>
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const pageRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroHeadlineRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const setScrollProgress = useBeautyStore((state) => state.setScrollProgress);
  const setMouseNorm = useBeautyStore((state) => state.setMouseNorm);
  const setCursorVariant = useBeautyStore((state) => state.setCursorVariant);
  const introComplete = useBeautyStore((state) => state.introComplete);
  const setIntroComplete = useBeautyStore((state) => state.setIntroComplete);
  const [storyIndex, setStoryIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showcaseProducts, setShowcaseProducts] = useState(FALLBACK_PRODUCTS);

  useEffect(() => {
    document.body.classList.add('page-immersive');
    return () => document.body.classList.remove('page-immersive');
  }, []);

  useEffect(() => {
    setIntroComplete(false);
    const timeoutId = window.setTimeout(() => setIntroComplete(true), INTRO_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [setIntroComplete]);

  useEffect(() => {
    const storyTimer = window.setInterval(() => {
      setStoryIndex((index) => (index + 1) % STORY_SLIDES.length);
    }, 4200);
    const testimonialTimer = window.setInterval(() => {
      setTestimonialIndex((index) => (index + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => {
      window.clearInterval(storyTimer);
      window.clearInterval(testimonialTimer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    getProducts()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        const curated = (data.products || []).slice(0, 3).map((product, index) => ({
          ...product,
          accent: ['#f2a7bb', '#d4a96a', '#c0446a'][index % 3],
        }));

        if (curated.length > 0) {
          setShowcaseProducts(curated);
        }
      })
      .catch(() => {
        if (active) {
          setShowcaseProducts(FALLBACK_PRODUCTS);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.04,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 1.0,
    });

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setMouseNorm(x, y);
    };

    const handlePointerOver = (event) => {
      const interactive = event.target.closest('a, button, [data-cursor="hover"]');
      if (interactive) {
        setCursorVariant('hover');
      }
    };

    const handlePointerOut = (event) => {
      if (event.target.closest('a, button, [data-cursor="hover"]')) {
        setCursorVariant('default');
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, [setCursorVariant, setMouseNorm]);

  useEffect(() => {
    if (!pageRef.current) {
      return undefined;
    }

    const elements = pageRef.current.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!pageRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.2,
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      if (!isMobile && horizontalSectionRef.current && horizontalTrackRef.current) {
        gsap.to(horizontalTrackRef.current, {
          x: () => -(horizontalTrackRef.current.scrollWidth - horizontalSectionRef.current.clientWidth + 64),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            start: 'top top',
            end: () => `+=${horizontalTrackRef.current.scrollWidth - horizontalSectionRef.current.clientWidth + window.innerWidth * 0.5}`,
            pin: true,
            scrub: 2.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, pageRef);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [isMobile, setScrollProgress]);

  useLayoutEffect(() => {
    if (!introComplete || !heroSectionRef.current || !heroHeadlineRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.fromTo(
        heroSectionRef.current.querySelectorAll('.hero-copy-item'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.18, duration: 1.6, ease: 'power4.out' }
      );
    }, heroSectionRef);

    return () => {
      context.revert();
    };
  }, [introComplete]);

  return (
    <div ref={pageRef} className="immersive-home">
      <CursorOrb isMobile={isMobile} />
      <ProgressRail />

      {/* Floating Shop Now button (Desktop only) */}
      {!isMobile && (
        <Link to="/shop" className="sound-toggle" data-cursor="hover" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Shop Now &rarr;</span>
        </Link>
      )}

      <AnimatePresence>{!introComplete ? <IntroOverlay /> : null}</AnimatePresence>

      <div className="immersive-canvas-shell" aria-hidden="true">
        <HeroCanvas isMobile={isMobile} />
        <div className="immersive-canvas-shell__veil" />
      </div>

      <header className="immersive-nav" style={{ maxWidth: '95vw', width: 'auto' }}>
        <Link to="/" className="immersive-nav__brand" style={{ flexShrink: 0 }}>
          Kivara
        </Link>
        <nav className="immersive-nav__links scrollbar-hide" style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap', padding: '0 8px', gap: '2rem' }}>
          <Link to="/shop" style={{ flexShrink: 0 }}>{isMobile ? 'Shop Now' : 'Shop All'}</Link>
          {!isMobile && (
            <Link to="/glowbot" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="animate-pulse">✨</span> Krystal
            </Link>
          )}
        </nav>
        <Link to="/account" className="immersive-nav__cta" style={{ flexShrink: 0 }}>
          Account
        </Link>
      </header>

      {/* Floating Krystal AI Button (Bottom Console) */}
      {isMobile && (
        <Link to="/glowbot" style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 60,
          background: `linear-gradient(135deg, #C2185B, #8B2252)`,
          color: '#fff', textDecoration: 'none',
          padding: '12px 24px', borderRadius: '50px',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 32px rgba(194,24,91,0.4)',
          fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px',
          letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap'
        }}>
          <span className="animate-pulse">✨</span> Ask Krystal
        </Link>
      )}

      <main className="immersive-main">
        <section ref={heroSectionRef} className="immersive-section immersive-section--hero">
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="eyebrow hero-copy-item">Kivara Beauty • Curated Makeup Store</p>
              <h1 ref={heroHeadlineRef} className="hero-headline hero-copy-item">
                Coveted Makeup, <span className="gradient-word">Curated Beautifully</span>
              </h1>
              <p className="hero-description hero-copy-item">
                A premium reselling destination for sought-after beauty products, styled with a soft luxury point of view and built for customers who shop with taste.
              </p>
              <div className="hero-actions hero-copy-item">
                <Link to="/shop" className="cta-pill cta-pill--primary">
                  Shop Bestsellers
                </Link>
                <a href="#reveal" className="cta-pill cta-pill--ghost">
                  Explore the Edit
                </a>
              </div>
              <div className="hero-meta hero-copy-item">
                <span>Curated international beauty</span>
                <span>Soft luxury presentation</span>
                <span>Scroll-led product discovery</span>
              </div>
            </div>

            <HeroPaletteVisual />
          </div>
        </section>

        <section id="reveal" className="immersive-section immersive-section--reveal">
          <div className="reveal-panel glass-panel" data-reveal>
            <p className="eyebrow">Featured Drop</p>
            <h2>
              Each highlight is framed around <span className="gradient-word">desirability, texture, and brand appeal</span>.
            </h2>
            <p>
              The homepage slows the customer down just enough to notice what makes each product worth wanting, from finish and shade to packaging and mood.
            </p>
            <div className="reveal-stats">
              <div>
                <strong>Store direction</strong>
                <span>Luxury reseller styling with a clear product-first focus</span>
              </div>
              <div>
                <strong>Visual rhythm</strong>
                <span>Slow camera movement, soft glow, and polished transitions throughout</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" ref={horizontalSectionRef} className="immersive-section immersive-section--horizontal">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Why Shop Kivara</p>
            <h2>A refined storefront for customers looking for popular makeup, trusted picks, and a more elevated way to browse.</h2>
          </div>

          <div ref={horizontalTrackRef} className={`feature-track ${isMobile ? 'feature-track--mobile' : ''}`}>
            {FEATURE_CARDS.map((card, index) => (
              <MotionArticle
                key={card.title}
                className="feature-card glass-panel"
                whileHover={{ y: -10 }}
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <MotionDiv className="feature-card__icon" whileHover={{ rotate: 18, scale: 1.06 }}>
                  *
                </MotionDiv>
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <span>{card.body}</span>
                <strong>{card.stat}</strong>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section id="shop" className="immersive-section immersive-section--shop">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Shop the Edit</p>
            <h2>A rotating mix of cult lip products, glow essentials, and everyday favourites selected for the modern beauty customer.</h2>
          </div>

          <div className="product-grid-pattern" aria-hidden="true" />
          <div className="shop-grid">
            {showcaseProducts.map((product) => (
              <TiltProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section id="story" className="immersive-section immersive-section--story">
          <div className="story-rule" />
          <div className="story-layout">
            <div className="story-copy" data-reveal>
              <p className="eyebrow">About Kivara</p>
              <h2>
                Curated beauty with a softer, more luxurious lens. <span className="gradient-word">That is the whole point.</span>
              </h2>
              <p>
                Kivara is a makeup reselling destination built for customers who want access to trending, beloved beauty products in one polished space.
              </p>
              <p>
                Instead of a crowded catalog feel, the experience stays curated, feminine, and intentional, so every product still feels special by the time it reaches the cart.
              </p>
            </div>
            <div data-reveal>
              <StoryCarousel activeIndex={storyIndex} />
            </div>
          </div>
        </section>

        <section className="immersive-section immersive-section--testimonials">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">What Customers Feel</p>
            <h2>Short impressions from shoppers who care about product quality, brand mix, and how the experience feels.</h2>
          </div>
          <TestimonialsCarousel activeIndex={testimonialIndex} />
        </section>
      </main>

      <footer className="immersive-footer">
        <div className="immersive-footer__brand" data-reveal>
          <span>Kivara</span>
          <p>Curated makeup, elevated presentation, and a shopping experience built for beauty lovers who know what they want.</p>
        </div>
        <div className="immersive-footer__links" data-reveal>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/account">Account</Link>
        </div>
        <div className="immersive-footer__social" data-reveal>
          <a href="https://www.instagram.com/kivara.beauty_?igsh=eWR4bnpzOGx3a2o1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="mailto:beautykivara@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
        <p className="immersive-footer__tag">Curated for every beauty obsession.</p>
      </footer>
    </div>
  );
}
