import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { consultGlowBot } from '../../api/glowbotApi';
import ProductCard from '../storefront/ProductCard';

// ─── Mobile detection hook ─────────────────────────────────────────────────────────────
function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  roseGold: '#B76E79',
  richPink: '#C2185B',
  deepRose: '#8B2252',
  brass: '#C5A059',
  espresso: '#2C1E22',
};

// ─── Glassmorphism wrapper ────────────────────────────────────────────────────
const Glass = ({ children, style = {}, className = '' }) => (
  <div
    className={className}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,240,245,0.32))',
      backdropFilter: 'blur(22px) saturate(200%)',
      WebkitBackdropFilter: 'blur(22px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.65)',
      boxShadow: '0 8px 40px rgba(183,110,121,0.18)',
      borderRadius: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Skin type + concerns data ─────────────────────────────────────────────────
const SKIN_TYPES   = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const CONCERNS     = ['Acne', 'Dark Spots', 'Dryness', 'Oiliness', 'Anti-Aging', 'Redness', 'Dullness', 'Dark Circles', 'Uneven Tone', 'Large Pores'];

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function Markdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const els = [];
  let k = 0;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      els.push(
        <h3 key={k++} style={{
          fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700,
          color: C.espresso, marginTop: 18, marginBottom: 8, paddingBottom: 6,
          borderBottom: '1px solid rgba(183,110,121,0.2)',
        }}>{line.slice(3)}</h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      els.push(
        <li key={k++} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7, listStyle: 'none' }}>
          <span style={{ color: C.richPink, fontSize: 12, marginTop: 3, flexShrink: 0 }}>✦</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44,30,34,0.8)', lineHeight: 1.65 }}>
            {parts.map((p, i) =>
              i % 2 === 1
                ? <strong key={i} style={{ fontWeight: 700, color: C.espresso }}>{p}</strong>
                : p
            )}
          </span>
        </li>
      );
    } else if (line.trim()) {
      els.push(
        <p key={k++} style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44,30,34,0.7)',
          lineHeight: 1.65, marginBottom: 6,
        }}>{line}</p>
      );
    }
  }
  return <ul style={{ padding: 0, margin: 0 }}>{els}</ul>;
}

// ─── Main Krystal Zone 2 component ───────────────────────────────────────────────────
export default function KrystalZone2({ visible }) {
  const mobile = useMobile();
  const panelRef = useRef();
  const fileRef  = useRef();

  const [step,       setStep]       = useState(1);  // 1=photo, 2=profile, 3=loading, 4=results
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [skinType,   setSkinType]   = useState('');
  const [concerns,   setConcerns]   = useState([]);
  const [allergies,  setAllergies]  = useState('');
  const [goals,      setGoals]      = useState('');
  const [result,     setResult]     = useState('');
  const [products,   setProducts]   = useState([]);
  const [error,      setError]      = useState('');
  const [dragging,   setDragging]   = useState(false);

  // GSAP slide-up when visible
  useEffect(() => {
    if (!panelRef.current) return;
    if (visible) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.3,
      });
    } else {
      gsap.to(panelRef.current, { opacity: 0, y: 30, duration: 0.4 });
    }
  }, [visible]);

  const handleFile = (file) => {
    if (!file) return;
    setImgFile(file);
    const r = new FileReader();
    r.onloadend = () => setImgPreview(r.result);
    r.readAsDataURL(file);
  };

  const toggleConcern = (c) =>
    setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSubmit = async () => {
    if (!skinType) return;
    setStep(3);
    setError('');
    try {
      let imageBase64 = null, mimeType = null;
      if (imgFile) {
        const r = new FileReader();
        imageBase64 = await new Promise(res => {
          r.onloadend = () => res(r.result.split(',')[1]);
          r.readAsDataURL(imgFile);
        });
        mimeType = imgFile.type;
      }
      const { data } = await consultGlowBot({ imageBase64, mimeType, skinType, concerns: concerns.join(', '), allergies, goals });
      setResult(data.recommendation);
      setProducts(data.recommendedProducts || []);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStep(2);
    }
  };

  const reset = () => {
    setStep(1); setResult(''); setProducts([]); setImgFile(null);
    setImgPreview(null); setConcerns([]); setSkinType(''); setError(''); setGoals(''); setAllergies('');
  };

  const BTN = (onClick, label, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '11px 28px', borderRadius: 50, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11,
        letterSpacing: 2, textTransform: 'uppercase', color: '#fff',
        background: disabled
          ? 'rgba(183,110,121,0.3)'
          : `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
        boxShadow: disabled ? 'none' : '0 6px 24px rgba(194,24,91,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'scale(1.04)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: mobile ? '70px 16px 16px' : '80px 24px 24px',
        overflowY: 'hidden',
      }}
    >
      {/* Zone label */}
      <div style={{ textAlign: 'center', marginBottom: mobile ? 14 : 20 }}>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: mobile ? 'clamp(1.2rem, 6vw, 1.8rem)' : 'clamp(1.4rem, 3.5vw, 2.6rem)',
          background: `linear-gradient(135deg, ${C.richPink}, ${C.roseGold})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Meet Krystal
        </p>
        {!mobile && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 12,
            color: 'rgba(44,30,34,0.5)', letterSpacing: 1, marginTop: 4,
          }}>
            Your personal AI beauty consultant — powered by Gemini
          </p>
        )}
      </div>

      {/* Main panel */}
      <div ref={panelRef} style={{ width: '100%', maxWidth: 600 }}>
        <Glass style={{ padding: mobile ? '18px 18px' : '28px 30px' }}>

          {/* Step indicator */}
          {step < 3 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22 }}>
              {[1, 2].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                    background: step === s
                      ? `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`
                      : step > s ? C.roseGold : 'rgba(183,110,121,0.12)',
                    color: step >= s ? '#fff' : C.roseGold,
                    boxShadow: step === s ? '0 4px 14px rgba(194,24,91,0.4)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 2 && (
                    <div style={{
                      width: 50, height: 1,
                      background: step > s ? C.roseGold : 'rgba(183,110,121,0.2)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 1: Photo Upload ── */}
          {step === 1 && (
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: C.roseGold, marginBottom: 8 }}>
                Step 1 of 2
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>
                Upload Your Selfie
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44,30,34,0.5)', marginBottom: 18, lineHeight: 1.6 }}>
                A clear photo helps Krystal analyze your skin tone & texture for better recommendations.
              </p>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${dragging ? C.richPink : 'rgba(183,110,121,0.3)'}`,
                  borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                  cursor: 'pointer', background: dragging ? 'rgba(194,24,91,0.04)' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.25s', marginBottom: 14,
                }}
              >
                {imgPreview ? (
                  <div>
                    <img src={imgPreview} alt="Selfie preview"
                      style={{ maxHeight: 140, borderRadius: 12, objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.roseGold, marginTop: 10 }}>
                      ✓ Photo ready · Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgba(248,200,220,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 12px', fontSize: 22,
                    }}>📸</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.espresso, fontWeight: 500 }}>
                      Drop your selfie here
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(44,30,34,0.4)', marginTop: 4 }}>
                      or click to browse · JPG, PNG, WEBP
                    </p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files[0])} />
              </div>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(44,30,34,0.35)', textAlign: 'center', marginBottom: 20 }}>
                🔒 Photo is never stored — analyzed privately and discarded.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {BTN(() => setStep(2), 'Continue → Skin Profile')}
              </div>
            </div>
          )}

          {/* ── STEP 2: Skin Profile ── */}
          {step === 2 && (
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: C.roseGold, marginBottom: 8 }}>
                Step 2 of 2
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>
                Your Skin Profile
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44,30,34,0.5)', marginBottom: 18 }}>
                The more you share, the more personalized your routine.
              </p>

              {/* Skin type */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.espresso, marginBottom: 10, fontWeight: 700 }}>
                  Skin Type *
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SKIN_TYPES.map(t => (
                    <button key={t} onClick={() => setSkinType(t)} style={{
                      padding: '7px 16px', borderRadius: 50, border: 'none', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1,
                      textTransform: 'uppercase', transition: 'all 0.2s',
                      background: skinType === t
                        ? `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`
                        : 'rgba(183,110,121,0.1)',
                      color: skinType === t ? '#fff' : C.roseGold,
                      boxShadow: skinType === t ? '0 4px 14px rgba(194,24,91,0.3)' : 'none',
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.espresso, marginBottom: 10, fontWeight: 700 }}>
                  Concerns <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0, color: 'rgba(44,30,34,0.45)' }}>(select all that apply)</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {CONCERNS.map(c => (
                    <button key={c} onClick={() => toggleConcern(c)} style={{
                      padding: '5px 14px', borderRadius: 50, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 400,
                      transition: 'all 0.2s',
                      background: concerns.includes(c) ? 'rgba(248,200,220,0.5)' : 'rgba(255,255,255,0.4)',
                      border: concerns.includes(c) ? `1.5px solid ${C.roseGold}` : '1.5px solid rgba(183,110,121,0.2)',
                      color: concerns.includes(c) ? C.deepRose : 'rgba(44,30,34,0.55)',
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.espresso, marginBottom: 8, fontWeight: 700 }}>
                  Your Goals
                </p>
                <textarea
                  value={goals}
                  onChange={e => setGoals(e.target.value)}
                  rows={2}
                  placeholder="e.g. Dewy glass skin for my wedding, natural everyday makeup look..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 12,
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 300,
                    color: C.espresso, background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(183,110,121,0.25)', outline: 'none',
                    resize: 'none', lineHeight: 1.6, boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Allergies */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.espresso, marginBottom: 8, fontWeight: 700 }}>
                  Ingredients to Avoid
                </p>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="e.g. fragrance, retinol, sulfates, alcohol..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 50,
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 300,
                    color: C.espresso, background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(183,110,121,0.25)', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 16px', borderRadius: 12, background: 'rgba(194,24,91,0.08)',
                  border: '1px solid rgba(194,24,91,0.2)', color: C.richPink,
                  fontFamily: "'Inter', sans-serif", fontSize: 12, marginBottom: 16,
                }}>⚠ {error}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setStep(1)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.roseGold,
                  fontWeight: 600, letterSpacing: 1,
                }}>← Back</button>
                {BTN(handleSubmit, '✨ Get My Krystal Routine', !skinType)}
              </div>
            </div>
          )}

          {/* ── STEP 3: Loading ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(248,200,220,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                  animation: 'float-gentle 2s ease-in-out infinite',
                }}>✨</div>
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%',
                  border: '3px solid rgba(194,24,91,0.2)',
                  animation: 'spin 1.8s linear infinite',
                }} />
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
                color: C.espresso, marginBottom: 8,
              }}>Krystal is analyzing…</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44,30,34,0.5)',
                lineHeight: 1.7, maxWidth: 300, margin: '0 auto 20px',
              }}>
                Studying your skin, cross-referencing our inventory, and crafting your personalized beauty ritual.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: C.richPink,
                    animation: 'bounce-gentle 1s ease-in-out infinite',
                    animationDelay: `${i * 0.18}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Results ── */}
          {step === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{
                  display: 'inline-block', padding: '5px 16px', borderRadius: 50,
                  background: 'rgba(248,200,220,0.4)', border: '1px solid rgba(194,24,91,0.25)',
                  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: 3, textTransform: 'uppercase', color: C.richPink, marginBottom: 12,
                }}>
                  ✦ Your Personalized Report
                </span>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
                  color: C.espresso, marginBottom: 4,
                }}>Krystal's Recommendations</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(44,30,34,0.45)', lineHeight: 1.6,
                }}>
                  Tailored exclusively from Kivara Beauty's in-stock collection.
                </p>
              </div>

              {/* Result card */}
              <div style={{
                background: 'rgba(255,255,255,0.55)', borderRadius: 16,
                border: '1px solid rgba(183,110,121,0.2)',
                padding: '16px 18px', marginBottom: 18,
                maxHeight: 200, overflowY: 'auto',
              }}>
                <Markdown text={result} />
              </div>

              {/* Products */}
              {products.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{
                    fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700,
                    color: C.espresso, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: C.richPink }}>✨</span> Shop Your Routine
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {products.slice(0, 4).map(p => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                  {products.length > 4 && (
                    <Link to="/shop" style={{
                      display: 'block', textAlign: 'center', marginTop: 10,
                      fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.roseGold,
                      textDecoration: 'none', fontWeight: 600, letterSpacing: 1,
                    }}>
                      +{products.length - 4} more in your routine →
                    </Link>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={reset} style={{
                  background: 'none', border: `1.5px solid ${C.roseGold}`, borderRadius: 50,
                  padding: '9px 22px', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: 'uppercase', color: C.roseGold,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(183,110,121,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  ✨ New Consultation
                </button>
                <Link to="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
                  padding: '9px 22px', borderRadius: 50,
                  background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: 'uppercase', color: '#fff',
                  boxShadow: '0 6px 20px rgba(194,24,91,0.3)',
                }}>
                  Full Collection →
                </Link>
              </div>
            </div>
          )}
        </Glass>
      </div>
    </div>
  );
}
