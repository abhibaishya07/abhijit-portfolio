import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long will it take to receive my order?",
        a: "All orders are typically processed and dispatched within 24-48 hours. Standard delivery takes about 3-5 business days depending on your location. You will receive a tracking link via email as soon as it ships!"
      },
      {
        q: "Can I cancel or change my order?",
        a: "We process orders very quickly! If you need to cancel, please contact our support team immediately. Once an order has been packed or dispatched from our warehouse, it can no longer be canceled or changed."
      },
      {
        q: "What do I do if I receive a damaged or incorrect product?",
        a: "We sincerely apologize for any inconvenience. We have a strict policy: you must record a clear, uncut box-opening (unboxing) video. Please contact us with the video within 7 days of delivery and we will arrange a replacement or refund."
      }
    ]
  },
  {
    category: "Products & Skincare",
    questions: [
      {
        q: "Are the products sold on Kivara authentic?",
        a: "Absolutely. Every single product we sell is 100% authentic and sourced directly from authorized brands or official distributors. We stand by our Quality Guarantee."
      },
      {
        q: "How do I know which products are right for my skin?",
        a: (
          <span>
            To get a personalized skincare or makeup recommendation, check out our exclusive AI consultant,{' '}
            <Link to="/glowbot" className="text-lb-rose font-medium hover:underline">Krystal</Link>! 
            Simply upload a selfie, share your concerns, and it will build a personalized routine for you instantly.
          </span>
        )
      },
      {
        q: "Are your products cruelty-free or vegan?",
        a: "We stock a wide variety of brands. While many of our curations are 100% cruelty-free and vegan, it depends on the specific brand. Please check the individual product description page for specific badges and ingredient lists."
      },
      {
        q: "How should I store my skincare products?",
        a: "Most skincare products are best kept in a cool, dry place away from direct sunlight. Formulations with Vitamin C or certain actively unstable ingredients often benefit from being kept in a skincare fridge."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "Returns are only accepted if you receive a damaged or incorrect item, and you must provide an unboxing video. We do not accept returns for used, open, or unsealed cosmetics due to hygiene protocols."
      },
      {
        q: "When will I receive my refund?",
        a: "Once your damaged/incorrect item return is received and inspected at our facility, refunds are processed back to your original payment method within 5-7 business days."
      }
    ]
  }
];

function Accordion({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <button 
        className="w-full flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`font-semibold transition-colors duration-200 ${isOpen ? 'text-lb-rose' : 'text-lb-dark group-hover:text-lb-rose'}`}>
          {question}
        </span>
        <span className="ml-6 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-lb-blush text-lb-mauve transition-transform duration-300">
          <svg 
            className={`w-3 h-3 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 text-sm leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  let globalIndex = 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-lb-white pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
             <span className="text-xs uppercase tracking-widest text-lb-rose font-bold mb-2 block">Help Center</span>
             <h1 className="font-display text-4xl text-lb-black font-medium">Frequently Asked Questions</h1>
             <p className="text-gray-500 text-sm mt-3">Find answers to common questions about our products, shipping, and returns.</p>
          </div>
           
          <div className="space-y-12">
            {faqs.map((group, groupIdx) => (
              <div key={groupIdx} className="bg-white p-8 md:p-10 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border">
                <h2 className="text-xl font-display font-semibold text-lb-black mb-6 pb-3 border-b border-lb-border flex items-center gap-2">
                  <span className="text-lb-rose">✦</span> {group.category}
                </h2>
                
                <div className="flex flex-col">
                  {group.questions.map((item) => {
                    const currentIndex = globalIndex++;
                    return (
                      <Accordion 
                        key={currentIndex}
                        question={item.q} 
                        answer={item.a} 
                        isOpen={openIndex === currentIndex}
                        onClick={() => toggle(currentIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-lb-rose to-lb-mauve rounded-2xl p-10 text-white text-center mt-12">
            <h3 className="font-display text-2xl font-medium mb-3">Still need help?</h3>
            <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
              Our beauty advisors are here for you. Don't hesitate to reach out if you have any more questions about your routine or your orders.
            </p>
            <a href="mailto:support@kivarabeauty.com" className="inline-block bg-white text-lb-rose font-bold text-xs tracking-widest uppercase px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
              Contact Support
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
