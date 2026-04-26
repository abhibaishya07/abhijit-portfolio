import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { consultGlowBot } from '../../api/glowbotApi';
import ProductCard from '../../components/storefront/ProductCard';

const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const CONCERNS_LIST = [
  'Acne / Breakouts', 'Dark Spots / Hyperpigmentation', 'Dryness / Flakiness',
  'Oiliness / Shine', 'Fine Lines / Anti-Aging', 'Redness / Irritation',
  'Uneven Skin Tone', 'Dullness / Lack of Glow', 'Dark Circles', 'Large Pores',
];

// Simple Markdown renderer
function RenderMarkdown({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-display font-semibold text-lb-black mt-8 mb-4 pb-2 border-b border-lb-border flex items-center gap-2">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-lb-dark mt-5 mb-2">{line.slice(4)}</h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <li key={key++} className="flex gap-3 items-start mb-3 ml-2">
          <span className="text-lb-rose mt-1 flex-shrink-0">✦</span>
          <span className="text-gray-700 leading-relaxed text-sm">
            {parts.map((p, idx) =>
              idx % 2 === 1
                ? <strong key={idx} className="text-lb-dark font-semibold">{p}</strong>
                : p
            )}
          </span>
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="mb-1" />);
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={key++} className="text-gray-700 text-sm leading-relaxed mb-2">
          {parts.map((p, idx) =>
            idx % 2 === 1
              ? <strong key={idx} className="text-lb-dark font-semibold">{p}</strong>
              : p
          )}
        </p>
      );
    }
  }

  return <div className="prose max-w-none"><ul className="list-none p-0">{elements}</ul></div>;
}

export default function GlowBotPage() {
  const [step, setStep] = useState(1); // 1=photo, 2=profile, 3=loading, 4=result
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [goals, setGoals] = useState('');
  const [result, setResult] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleConcern = (c) =>
    setConcerns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSubmit = async () => {
    setStep(3);
    setError('');
    try {
      let imageBase64 = null;
      let mimeType = null;

      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(imageFile);
        });
        mimeType = imageFile.type;
      }

      const { data } = await consultGlowBot({
        imageBase64,
        mimeType,
        skinType,
        concerns: concerns.join(', '),
        allergies,
        goals,
      });

      setResult(data.recommendation);
      setRecommendedProducts(data.recommendedProducts);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStep(2);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-lb-white via-lb-blush/30 to-lb-white">

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-lb-black py-16 px-6">
          {/* Pink glow orbs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-lb-rose/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lb-mauve/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-lb-rose/20 border border-lb-rose/40 text-lb-gold px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold mb-6">
              ✦ Powered by Gemini AI
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-medium text-white leading-tight mb-4">
              Meet <span className="text-lb-rose italic">Krystal</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
              Your personal AI beauty consultant — upload a selfie, share your skin goals, and get a routine crafted just for you from our curated inventory.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Step Indicator */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-3 mb-10">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step === s ? 'bg-lb-rose text-white shadow-lg shadow-pink-500/40' :
                    step > s ? 'bg-lb-mauve text-white' : 'bg-lb-blush text-lb-mauve'
                  }`}>{s}</div>
                  {s < 2 && <div className={`w-16 h-0.5 transition-all duration-300 ${step > s ? 'bg-lb-rose' : 'bg-lb-border'}`} />}
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 1: Photo Upload ── */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">Step 1 of 2</p>
                <h2 className="font-display text-3xl text-lb-black font-medium">Upload Your Selfie</h2>
                <p className="text-gray-500 text-sm mt-2">A clear, well-lit photo of your face helps Krystal analyze your skin tone & texture.</p>
              </div>

              <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleImageChange(e.dataTransfer.files[0]); }}
                className="relative border-2 border-dashed border-lb-border hover:border-lb-rose bg-lb-gray/50 hover:bg-lb-blush/30 rounded-2xl
                           flex flex-col items-center justify-center p-12 cursor-pointer transition-all duration-300 group min-h-[280px]"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="max-h-56 rounded-xl object-contain shadow-lg" />
                    <p className="text-xs text-lb-mauve mt-4 font-medium">Click to change photo</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-lb-blush flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-9 h-9 text-lb-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    </div>
                    <p className="text-lb-dark font-semibold mb-1">Drop your photo here</p>
                    <p className="text-gray-400 text-xs">or click to browse · JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleImageChange(e.target.files[0])} />
              </div>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Your photo is never stored — it's analyzed privately and discarded.
              </p>

              <div className="flex justify-end mt-8">
                <button onClick={() => setStep(2)} className="btn-primary">
                  Continue — Tell Us About Your Skin →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Skin Profile ── */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">Step 2 of 2</p>
                <h2 className="font-display text-3xl text-lb-black font-medium">Your Skin Profile</h2>
                <p className="text-gray-500 text-sm mt-2">The more you share, the more personalized your routine will be.</p>
              </div>

              <div className="space-y-7">
                {/* Skin Type */}
                <div>
                  <label className="block text-xs tracking-widest uppercase font-semibold text-lb-dark mb-3">Skin Type</label>
                  <div className="flex flex-wrap gap-3">
                    {SKIN_TYPES.map(t => (
                      <button key={t} onClick={() => setSkinType(t)}
                        className={`px-5 py-2 text-xs tracking-wider uppercase font-semibold border-2 transition-all duration-200 rounded-full ${
                          skinType === t
                            ? 'bg-lb-rose border-lb-rose text-white shadow-md shadow-pink-500/30'
                            : 'border-lb-border text-gray-600 hover:border-lb-rose hover:text-lb-rose'
                        }`}>{t}</button>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                <div>
                  <label className="block text-xs tracking-widest uppercase font-semibold text-lb-dark mb-3">Main Concerns <span className="text-gray-400 normal-case">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {CONCERNS_LIST.map(c => (
                      <button key={c} onClick={() => toggleConcern(c)}
                        className={`px-4 py-1.5 text-[11px] tracking-wide font-medium border transition-all duration-200 rounded-full ${
                          concerns.includes(c)
                            ? 'bg-lb-blush border-lb-rose text-lb-mauve'
                            : 'border-lb-border text-gray-500 hover:border-lb-rose/50'
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-xs tracking-widest uppercase font-semibold text-lb-dark mb-2">Allergies / Ingredients to Avoid</label>
                  <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)}
                    placeholder="e.g. fragrance, retinol, alcohol, sulfates..."
                    className="input-field" />
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-xs tracking-widest uppercase font-semibold text-lb-dark mb-2">Your Skincare & Beauty Goals</label>
                  <textarea value={goals} onChange={e => setGoals(e.target.value)} rows={3}
                    placeholder="e.g. I want glowing, hydrated skin for my wedding next month. I prefer a natural makeup look..."
                    className="input-field resize-none" />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  ⚠ {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                <button onClick={handleSubmit}
                  disabled={!skinType}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  ✨ Get My Krystal Routine
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Loading ── */}
          {step === 3 && (
            <div className="animate-fadeIn flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-lb-blush flex items-center justify-center">
                  <span className="text-4xl animate-pulse">✨</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-lb-rose/30 animate-ping" />
              </div>
              <h2 className="font-display text-2xl text-lb-black font-medium mb-3">Krystal is analyzing…</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Studying your skin, cross-referencing our inventory, and crafting your personalized beauty routine.
              </p>
              <div className="flex gap-2 mt-6">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-lb-rose rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Results ── */}
          {step === 4 && (
            <div className="animate-fadeIn">
              {/* Result header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-lb-blush border border-lb-rose/30 text-lb-mauve px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold mb-4">
                  ✦ Your Personalized Report
                </div>
                <h2 className="font-display text-3xl text-lb-black font-medium">Krystal's Recommendations</h2>
                <p className="text-gray-500 text-sm mt-2">Tailored exclusively from Kivara Beauty's in-stock collection — just for you.</p>
              </div>

              {/* Result card */}
              <div className="bg-white border border-lb-border rounded-2xl shadow-lg shadow-pink-100 p-8 mb-8">
                <RenderMarkdown text={result} />
              </div>

              {/* Shoppable Products Grid */}
              {recommendedProducts?.length > 0 && (
                <div className="mb-12">
                  <h3 className="font-display text-2xl text-lb-black font-medium mb-6 flex items-center gap-2">
                    <span className="text-lb-rose">✨</span> Shop Your Routine
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {recommendedProducts.map(p => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-r from-lb-rose to-lb-mauve rounded-2xl p-8 text-white text-center">
                <p className="font-display text-2xl font-medium mb-2">Want to see more?</p>
                <p className="text-white/70 text-sm mb-6">Browse the full Kivara Beauty collection to add anything else to your routine.</p>
                <Link to="/shop" className="inline-block bg-white text-lb-rose font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-lb-blush transition-colors duration-200">
                  Shop All →
                </Link>
              </div>

              {/* Redo */}
              <div className="text-center mt-8">
                <button onClick={() => { setStep(1); setResult(''); setRecommendedProducts([]); setImagePreview(null); setImageFile(null); setConcerns([]); setSkinType(''); }}
                  className="btn-ghost text-lb-mauve">
                  ✨ Start a New Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
