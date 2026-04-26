import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useBeautyStore from '../../store/beautyStore';
import KrystalZone2 from './KrystalZone2';

gsap.registerPlugin(ScrollTrigger);

// ─── Pinterest image ──────────────────────────────────────────────────────────
const FLOWER_KNOWS_IMG = 'https://i.pinimg.com/736x/3d/f6/d3/3df6d3136158907d900be51d2f5e3b9d.jpg';

// ─── Mobile detection hook ────────────────────────────────────────────────────
function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  roseGold: '#B76E79',
  brass:    '#C5A059',
  deepRose: '#8B2252',
  richPink: '#C2185B',
  blush:    '#F8C8DC',
  espresso: '#2C1E22',
};

// ─── Glassmorphism panel ──────────────────────────────────────────────────────
const Glass = ({ children, style = {} }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,240,245,0.30))',
    backdropFilter: 'blur(20px) saturate(200%)',
    WebkitBackdropFilter: 'blur(20px) saturate(200%)',
    border: '1px solid rgba(255,255,255,0.65)',
    boxShadow: '0 8px 40px rgba(183,110,121,0.18)',
    borderRadius: 20,
    ...style,
  }}>
    {children}
  </div>
);

// ─── Gold star ────────────────────────────────────────────────────────────────
const Star = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#C5A059">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Verified brand image URLs (from Kivara seed database) ───────────────────
const RHODE_IMG = 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/af52944fa9696b1b54007a3f3f8ea6bf9af37fd9.png?v=1774408120';
const CT_IMG    = 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/cf428c5b1a9aabe81076f8dcddf29f624403b34b.png?v=1774422775';

// ─── Reusable brand card ──────────────────────────────────────────────────────
function BrandCard({ src, alt, brand, badge, height, animDelay = '0s', glowColor }) {
  return (
    <div style={{ position: 'relative', animation: 'float-gentle 5s ease-in-out infinite', animationDelay: animDelay }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: -16, borderRadius: 24, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
        filter: 'blur(16px)', animation: 'pulseGlow 3.5s ease-in-out infinite',
      }} />
      {/* Brand pill */}
      <div style={{ position: 'absolute', top: -12, left: 10, zIndex: 5 }}>
        <Glass style={{ padding: '4px 11px', borderRadius: 50 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fontWeight: 700, color: C.deepRose, letterSpacing: 2, textTransform: 'uppercase' }}>✦ {brand}</span>
        </Glass>
      </div>
      {/* Image */}
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 18, overflow: 'hidden', boxShadow: '0 16px 50px rgba(194,24,91,0.14), 0 4px 16px rgba(0,0,0,0.07)' }}>
        <img src={src} alt={alt} style={{ width: '100%', height, objectFit: 'cover', display: 'block', backgroundColor: '#FFF5F8' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)', pointerEvents: 'none' }} />
      </div>
      {/* Badge */}
      <div style={{ position: 'absolute', bottom: -12, right: 10, zIndex: 5 }}>
        <Glass style={{ padding: '4px 11px', borderRadius: 50 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, fontWeight: 600, color: C.espresso, letterSpacing: 1.5, textTransform: 'uppercase' }}>{badge}</span>
        </Glass>
      </div>
    </div>
  );
}

// ─── Hero right panel ──────────────────────────────────────────────────────────────
function PaletteHero({ visible, mobile }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    if (visible) gsap.to(ref.current, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.35 });
    else         gsap.to(ref.current, { opacity: 0, y: 18, scale: 0.95, duration: 0.4 });
  }, [visible]);

  // ── MOBILE: scrollable horizontal strip of all 3 images ──
  if (mobile) {
    return (
      <div ref={ref} style={{ width: '100%', opacity: 0, transform: 'translateY(16px)' }}>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, paddingTop: 18,
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        }}>
          {[
            { src: FLOWER_KNOWS_IMG, brand: 'Flower Knows', badge: '★★★★★ 4.9', h: 200, glow: 'rgba(194,24,91,0.16)', d: '0s', w: 170 },
            { src: CT_IMG,           brand: 'Charlotte Tilbury', badge: '✦ Foundation', h: 220, glow: 'rgba(197,160,89,0.16)', d: '0.3s', w: 135 },
            { src: RHODE_IMG,        brand: 'Rhode', badge: 'Lip Tint ✦', h: 210, glow: 'rgba(183,110,121,0.16)', d: '0.6s', w: 115 },
          ].map(({ src, brand, badge, h, glow, w }) => (
            <div key={brand} style={{ flexShrink: 0, width: w, scrollSnapAlign: 'start', position: 'relative', paddingTop: 14, paddingBottom: 14 }}>
              {/* glow */}
              <div style={{ position: 'absolute', inset: -10, borderRadius: 20, background: `radial-gradient(ellipse, ${glow} 0%, transparent 70%)`, filter: 'blur(12px)', pointerEvents: 'none' }} />
              {/* brand pill */}
              <div style={{ position: 'absolute', top: 2, left: 8, zIndex: 5 }}>
                <Glass style={{ padding: '3px 9px', borderRadius: 50 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 7, fontWeight: 700, color: C.deepRose, letterSpacing: 1.5, textTransform: 'uppercase' }}>✦ {brand}</span>
                </Glass>
              </div>
              {/* image */}
              <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 8px 28px rgba(194,24,91,0.12)' }}>
                <img src={src} alt={brand} style={{ width: '100%', height: h, objectFit: 'cover', display: 'block', backgroundColor: '#FFF5F8' }} />
              </div>
              {/* badge */}
              <div style={{ position: 'absolute', bottom: 2, right: 8, zIndex: 5 }}>
                <Glass style={{ padding: '3px 9px', borderRadius: 50 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 7, fontWeight: 600, color: C.espresso, letterSpacing: 1, textTransform: 'uppercase' }}>{badge}</span>
                </Glass>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── DESKTOP: 3-column horizontal row matching reference screenshot ──
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', opacity: 0, transform: 'translateY(18px) scale(0.97)' }}>
      {/* Ambient glow blob */}
      <div style={{ position: 'absolute', inset: -40, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 60%, rgba(194,24,91,0.10) 0%, transparent 70%)', filter: 'blur(32px)' }} />

      {/* Sparkle accents */}
      {[['-6%', '12%', 10], ['104%', '20%', 8], ['-4%', '78%', 9], ['103%', '70%', 7]].map(([l, t, s], i) => (
        <div key={i} style={{ position: 'absolute', left: l, top: t, zIndex: 3, animation: `float-slow ${3 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.35}s` }}>
          <svg width={s} height={s} viewBox="0 0 24 24" fill="#C5A059" opacity="0.65">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
          </svg>
        </div>
      ))}

      {/*
        3-column grid — widths match screenshot:
          FK: widest (flat lay, landscape-ish)
          CT: medium (portrait tube)
          Rhode: narrowest (slim tube)
        alignItems: end → all cards bottom-align
        marginBottom on wrappers creates the height stagger
      */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr 0.82fr',
        gap: 18,
        alignItems: 'end',
      }}>
        {/* LEFT: Flower Knows — wide flat-lay, slightly above baseline */}
        <div style={{ marginBottom: 28 }}>
          <BrandCard
            src={FLOWER_KNOWS_IMG}
            alt="Flower Knows Dreamy Makeup Flat Lay"
            brand="Flower Knows"
            badge="★★★★★ 4.9"
            height={310}
            glowColor="rgba(194,24,91,0.18)"
            animDelay="0s"
          />
        </div>

        {/* CENTER: Charlotte Tilbury — tallest, sits at baseline */}
        <div style={{ marginBottom: 0 }}>
          <BrandCard
            src={CT_IMG}
            alt="Charlotte Tilbury Beautiful Skin Foundation"
            brand="Charlotte Tilbury"
            badge="✦ Foundation"
            height={400}
            glowColor="rgba(197,160,89,0.18)"
            animDelay="0.35s"
          />
        </div>

        {/* RIGHT: Rhode — narrowest, highest above baseline */}
        <div style={{ marginBottom: 55 }}>
          <BrandCard
            src={RHODE_IMG}
            alt="Rhode Peptide Lip Tint Raspberry Jelly"
            brand="Rhode"
            badge="Lip Tint ✦"
            height={300}
            glowColor="rgba(183,110,121,0.2)"
            animDelay="0.8s"
          />
        </div>
      </div>

      {/* Decorative sparkle row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18, position: 'relative', zIndex: 2 }}>
        {['✦', '🌸', '✦', '💫', '✦'].map((s, i) => (
          <span key={i} style={{ color: i % 2 === 0 ? C.brass : C.richPink, fontSize: i === 1 || i === 3 ? 13 : 9, opacity: 0.55, animation: `float-slow ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Zone 0: Hero ─────────────────────────────────────────────────────────────
function Zone0({ visible }) {
  const mobile = useMobile();
  const textRef  = useRef();
  const imgRef   = useRef();

  useEffect(() => {
    const els = [textRef.current, imgRef.current].filter(Boolean);
    if (visible) {
      gsap.fromTo(els, { opacity: 0, y: mobile ? 20 : 0, x: 0 },
        { opacity: 1, y: 0, x: 0, duration: 1, ease: 'power3.out', delay: 0.1, stagger: 0.15 });
    } else {
      gsap.to(els, { opacity: 0, duration: 0.35 });
    }
  }, [visible, mobile]);

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: mobile ? '70px 20px 20px' : '0 48px',
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        alignItems: mobile ? 'flex-start' : 'center',
        justifyContent: mobile ? 'flex-start' : 'space-between',
        overflowY: 'hidden',
        gap: mobile ? 24 : 0,
      }}
    >
      {/* Mobile: image first, then text */}
      {mobile && (
        <div ref={imgRef} style={{ width: '100%', paddingTop: 8 }}>
          <PaletteHero visible={visible} mobile />
        </div>
      )}

      {/* Text block */}
      <div ref={textRef} style={{
        flex: mobile ? 'none' : '0 0 auto',
        width: mobile ? '100%' : 'min(420px, 40%)',
        paddingRight: mobile ? 0 : 32,
        maxWidth: mobile ? '100%' : 520,
        paddingBottom: mobile ? 32 : 0,
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 400,
          fontSize: mobile ? 9 : 11, letterSpacing: 5, textTransform: 'uppercase',
          color: C.roseGold, marginBottom: mobile ? 12 : 18,
        }}>
          Kivara Beauty · 2026 Collection
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(2rem, 9vw, 2.8rem)' : 'clamp(2.4rem, 5vw, 5rem)',
          fontWeight: 700, color: C.espresso,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          marginBottom: mobile ? 14 : 20,
        }}>
          The Era of{mobile ? ' ' : <br />}
          <em style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.roseGold}, ${C.brass})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Ethereal</em> Beauty
        </h1>

        {!mobile && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 14,
            color: 'rgba(44,30,34,0.60)', lineHeight: 1.75, maxWidth: 400, marginBottom: 28,
          }}>
            Discover a world where science meets artistry — premium makeup and skincare,
            curated for every complexion, crafted for every occasion.
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: mobile ? 20 : 32 }}>
          <Link to="/shop?category=Lips" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: mobile ? '10px 20px' : '12px 28px', borderRadius: 50, textDecoration: 'none',
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: mobile ? 10 : 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#fff',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
            boxShadow: '0 6px 24px rgba(194,24,91,0.35)',
          }}>💋 Shop Collection</Link>

          <Link to="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: mobile ? '10px 18px' : '12px 22px', borderRadius: 50, textDecoration: 'none',
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: mobile ? 10 : 11, letterSpacing: 1.5, textTransform: 'uppercase',
            color: C.roseGold, border: `2px solid ${C.roseGold}`,
          }}>Explore All →</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: mobile ? 20 : 28 }}>
          {[['56+', 'Products'], ['15+', 'Brands'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: mobile ? 20 : 26, fontWeight: 700, color: C.richPink,
              }}>{v}</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(44,30,34,0.4)',
                letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 2,
              }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Scroll cue — desktop only */}
        {!mobile && (
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 1, height: 36,
              background: `linear-gradient(to bottom, ${C.roseGold}, transparent)`,
              animation: 'pulseGlow 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 5,
              textTransform: 'uppercase', color: C.roseGold, fontWeight: 500,
            }}>🎀 Scroll to discover</span>
          </div>
        )}
      </div>

      {/* Desktop: 3-brand horizontal row on right */}
      {!mobile && (
        <div ref={imgRef} style={{
          flexShrink: 0, width: 'min(620px, 58vw)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PaletteHero visible={visible} mobile={false} />
        </div>
      )}
    </div>
  );
}

// ─── Zone 1: Category portals ─────────────────────────────────────────────────
function Zone1({ visible }) {
  const mobile = useMobile();
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll('.portal-card');
    if (visible) {
      gsap.fromTo(ref.current.querySelector('.z1-label'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo(cards, { opacity: 0, x: -28 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    } else {
      const label = ref.current.querySelector('.z1-label');
      gsap.to([label, ...cards], { opacity: 0, duration: 0.25 });
    }
  }, [visible]);

  const portals = [
    { id: 'skincare', label: 'Curated Skincare',  sub: 'Science-backed rituals for radiant skin', emoji: '🌿', link: '/shop?category=Skincare',  grad: 'linear-gradient(135deg, rgba(232,180,184,0.7), rgba(248,200,220,0.5))' },
    { id: 'makeup',   label: 'Ethereal Makeup',    sub: 'Pigment-rich artistry for every mood',   emoji: '💄', link: '/shop?category=Lips',       grad: 'linear-gradient(135deg, rgba(194,24,91,0.18), rgba(183,110,121,0.45))' },
    { id: 'hair',     label: 'Luxe Hair Care',     sub: 'Indulgent formulas for luminous locks',  emoji: '✨', link: '/shop?category=Hair+Care',  grad: 'linear-gradient(135deg, rgba(197,160,89,0.25), rgba(248,200,220,0.4))' },
    { id: 'eyes',     label: 'Statement Eyes',     sub: 'Palettes, liners & mascaras',            emoji: '👁️', link: '/shop?category=Eyes',       grad: 'linear-gradient(135deg, rgba(139,34,82,0.18), rgba(194,24,91,0.35))' },
  ];

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: mobile ? '80px 20px 20px' : '0 48px',
        display: 'flex', alignItems: mobile ? 'flex-start' : 'center',
        overflowY: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: mobile ? '100%' : 420 }}>
        <p className="z1-label" style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 10,
          letterSpacing: 5, textTransform: 'uppercase', color: C.roseGold, marginBottom: 20,
        }}>Browse the Collection</p>

        {portals.map(p => (
          <Link
            key={p.id}
            to={p.link}
            className="portal-card"
            style={{
              display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
              padding: mobile ? '12px 16px' : '15px 20px', borderRadius: 18, marginBottom: 10,
              background: p.grad,
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.55)',
              boxShadow: '0 4px 18px rgba(183,110,121,0.12)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(7px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(194,24,91,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(183,110,121,0.12)'; }}
          >
            <span style={{ fontSize: mobile ? 22 : 26 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: mobile ? 14 : 16,
                fontWeight: 700, color: C.espresso, marginBottom: 2,
              }}>{p.label}</p>
              {!mobile && (
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 300,
                  color: 'rgba(44,30,34,0.55)', lineHeight: 1.5,
                }}>{p.sub}</p>
              )}
            </div>
            <span style={{ color: C.roseGold, fontSize: 14 }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Zone 3: Reviews ──────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Priya M.',  product: 'Charlotte Tilbury Foundation',   text: 'My skin has never looked more luminous — like wearing pure light.' },
  { name: 'Anika S.',  product: 'Rhode Peptide Lip Tint',          text: 'Silky, hydrating perfection. I own four shades and counting.' },
  { name: 'Roshni K.', product: 'Flower Knows Strawberry Rococo', text: 'The most beautiful compact I\'ve ever owned. Museum-worthy design.' },
  { name: 'Sana T.',   product: 'Anua Niacinamide Serum',          text: 'Glass skin in a bottle. Korean skincare at its absolute finest.' },
  { name: 'Meera D.',  product: 'Gisou Honey Hair Oil',            text: 'My hair is shinier than ever. The honey scent is intoxicating.' },
];

function Zone3({ visible }) {
  const mobile = useMobile();
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll('.rev-card');
    const head  = ref.current.querySelector('.z3-head');
    if (visible) {
      gsap.fromTo(head, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo(cards, { opacity: 0, x: -28 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.18 });
    } else {
      gsap.to([head, ...cards], { opacity: 0, duration: 0.25 });
    }
  }, [visible]);

  return (
    <div ref={ref} className="absolute inset-0" style={{
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
      pointerEvents: visible ? 'auto' : 'none',
      padding: mobile ? '80px 20px 20px' : '0 48px',
      display: 'flex', flexDirection: 'column', justifyContent: mobile ? 'flex-start' : 'center',
      overflowY: 'hidden',
    }}>
      <div className="z3-head" style={{ marginBottom: mobile ? 20 : 26 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 10,
          letterSpacing: 5, textTransform: 'uppercase', color: C.roseGold, marginBottom: 8,
        }}>Beloved by Thousands</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: mobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(1.8rem, 4vw, 3rem)',
          color: C.espresso, letterSpacing: '-0.02em', lineHeight: 1.12,
        }}>
          Voices of the{' '}
          <em style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.brass})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Ethereal Court</em>
        </h2>
      </div>

      <div style={{
        display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
        scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
      }}>
        {REVIEWS.map(r => (
          <div key={r.name} className="rev-card" style={{
            minWidth: mobile ? 240 : 250, maxWidth: mobile ? 260 : 270, flexShrink: 0,
            scrollSnapAlign: 'start',
            padding: mobile ? '14px 16px' : '18px 20px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,240,245,0.32))',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.62)',
            boxShadow: '0 6px 28px rgba(183,110,121,0.14)', borderRadius: 18,
          }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => <Star key={i} />)}
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: mobile ? 12 : 13, fontWeight: 300,
              color: C.espresso, lineHeight: 1.7, marginBottom: 10, fontStyle: 'italic',
            }}>"{r.text}"</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: C.roseGold }}>{r.name}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(44,30,34,0.4)', marginTop: 2 }}>{r.product}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: mobile ? 20 : 26 }}>
        <Link to="/shop" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          padding: mobile ? '11px 24px' : '13px 32px', borderRadius: 50,
          fontFamily: "'Inter', sans-serif", fontWeight: 700,
          fontSize: mobile ? 10 : 11, letterSpacing: 2, textTransform: 'uppercase', color: '#fff',
          background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
          boxShadow: '0 8px 28px rgba(194,24,91,0.32)',
        }}>Enter the Collection ✦</Link>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function EtherealNav() {
  const mobile = useMobile();
  return (
    <nav style={{
      position: 'absolute', top: mobile ? 14 : 22,
      left: '50%', transform: 'translateX(-50%)',
      zIndex: 50, pointerEvents: 'auto', whiteSpace: 'nowrap',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.56), rgba(255,240,245,0.32))',
      backdropFilter: 'blur(22px) saturate(200%)', WebkitBackdropFilter: 'blur(22px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.65)',
      boxShadow: '0 6px 30px rgba(183,110,121,0.14)',
      borderRadius: 50,
      padding: mobile ? '8px 12px 8px 16px' : '10px 24px',
      display: 'flex', alignItems: 'center',
      gap: mobile ? 14 : 24,
      width: mobile ? 'max-content' : 'auto',
      maxWidth: mobile ? '94vw' : 'none',
    }}>
      <Link to="/" style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700,
        fontSize: mobile ? 15 : 18, color: C.espresso, textDecoration: 'none',
        flexShrink: 0,
      }}>Kivara</Link>

      <div style={{
        display: 'flex', alignItems: 'center', gap: mobile ? 16 : 24,
        overflowX: 'auto',
      }} className="scrollbar-hide">
        <Link to="/shop" style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: mobile ? 9 : 11,
          color: C.roseGold, textDecoration: 'none',
          letterSpacing: mobile ? 1.2 : 1.8, textTransform: 'uppercase', transition: 'color 0.2s',
          flexShrink: 0,
        }}
          onMouseEnter={e => e.target.style.color = C.espresso}
          onMouseLeave={e => e.target.style.color = C.roseGold}
        >{mobile ? 'Shop Now' : 'Shop All'}</Link>
        
        {!mobile && (
          <Link to="/glowbot" style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: mobile ? 9 : 11,
            color: C.roseGold, textDecoration: 'none',
            letterSpacing: mobile ? 1.2 : 1.8, textTransform: 'uppercase', transition: 'color 0.2s',
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px'
          }}
            onMouseEnter={e => e.target.style.color = C.espresso}
            onMouseLeave={e => e.target.style.color = C.roseGold}
          ><span className="animate-pulse">✨</span> Krystal</Link>
        )}
      </div>

      <Link to="/login" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700,
        fontSize: mobile ? 9 : 10,
        color: '#fff', padding: mobile ? '8px 14px' : '8px 18px',
        borderRadius: 50, textDecoration: 'none',
        background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
        letterSpacing: 1.2, textTransform: 'uppercase',
        boxShadow: '0 4px 14px rgba(194,24,91,0.3)',
        flexShrink: 0,
      }}>Account</Link>
    </nav>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function ScrollDOMOverlay({ scrollContainerRef }) {
  const setScrollProgress = useBeautyStore(s => s.setScrollProgress);
  const setMouseNorm      = useBeautyStore(s => s.setMouseNorm);
  const activeZone        = useBeautyStore(s => s.activeZone);

  useEffect(() => {
    if (!scrollContainerRef?.current) return;
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top', end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: self => setScrollProgress(self.progress),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const h = e => setMouseNorm(
      (e.clientX / window.innerWidth)  * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1,
    );
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 0, height: '100dvh', width: '100%', overflow: 'hidden' }}>
      <EtherealNav />
      <Zone0 visible={activeZone === 0} />
      <Zone1 visible={activeZone === 1} />
      <KrystalZone2 visible={activeZone === 2} />
      <Zone3 visible={activeZone === 3} />
    </div>
  );
}
