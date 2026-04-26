import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-lb-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
             <span className="text-xs uppercase tracking-widest text-lb-rose font-bold mb-2 block">Get in Touch</span>
             <h1 className="font-display text-4xl text-lb-black font-medium">Contact Us</h1>
             <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
               We'd love to hear from you. Please reach out to us using the details below.
             </p>
          </div>
           
          <div className="flex justify-center">
            <div className="bg-white p-8 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border text-center flex flex-col items-center max-w-sm w-full">
              <div className="w-12 h-12 bg-lb-blush text-lb-rose rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-lb-black mb-2">Email</h3>
              <a href="mailto:beautykivara@gmail.com" className="text-gray-600 hover:text-lb-rose transition-colors text-sm">
                beautykivara@gmail.com
              </a>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
