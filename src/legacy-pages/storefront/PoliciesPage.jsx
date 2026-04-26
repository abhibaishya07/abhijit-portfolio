import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function PoliciesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-lb-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
             <span className="text-xs uppercase tracking-widest text-lb-rose font-bold mb-2 block">The Fine Print</span>
             <h1 className="font-display text-4xl text-lb-black font-medium">Store Policies</h1>
             <p className="text-gray-500 text-sm mt-3">Everything you need to know about shopping with Kivara Beauty.</p>
          </div>
           
          <div className="space-y-12 bg-white p-8 md:p-12 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border">
            {/* Returns & Refunds */}
            <section id="returns">
               <h2 className="text-xl font-display font-semibold text-lb-dark mb-5 pb-3 border-b border-lb-border flex items-center gap-2">
                 <span className="text-lb-rose">✦</span> Returns & Refunds
               </h2>
               <ul className="space-y-4 text-gray-700 text-sm leading-relaxed ml-2 list-disc pl-4 marker:text-lb-blush">
                 <li><strong className="text-lb-black">Return and refund applications are only valid in the event of a damaged or incorrect product being delivered.</strong></li>
                 <li><strong className="text-lb-black">A clear, continuous box-opening (unboxing) video is strictly required to process any claims.</strong> We cannot accept damage or missing item claims without visual proof of the unboxing.</li>
                 <li>The return window is active for <strong className="text-lb-black">7 days from the date of delivery</strong>. Please initiate your request within this timeframe.</li>
                 <li>Due to stringent hygiene and sanitary protocols, any skincare or cosmetic product that has been opened, unsealed, or used is strictly non-returnable.</li>
                 <li>Once an authorized return is received and inspected at our facility, refunds will be initiated to the original payment method within 5-7 business days.</li>
               </ul>
            </section>
              
            {/* Shipping Policy */}
            <section id="shipping">
               <h2 className="text-xl font-display font-semibold text-lb-dark mb-5 pb-3 border-b border-lb-border flex items-center gap-2">
                 <span className="text-lb-rose">✦</span> Shipping & Delivery
               </h2>
               <ul className="space-y-4 text-gray-700 text-sm leading-relaxed ml-2 list-disc pl-4 marker:text-lb-blush">
                 <li>All standard orders are processed and dispatched from our warehouse within 24 to 48 hours of order confirmation.</li>
                 <li>Standard delivery typically takes 3-5 business days across domestic zones. Delivery to remote areas may take up to 7 business days.</li>
                 <li>We offer free shipping on all orders above our promotional threshold. For smaller orders, a standard flat-rate shipping fee will be calculated at checkout.</li>
                 <li>You will receive tracking information via email the moment your order is dispatched.</li>
               </ul>
            </section>

            {/* Order Cancellation */}
            <section id="cancellation">
               <h2 className="text-xl font-display font-semibold text-lb-dark mb-5 pb-3 border-b border-lb-border flex items-center gap-2">
                 <span className="text-lb-rose">✦</span> Order Cancellation
               </h2>
               <ul className="space-y-4 text-gray-700 text-sm leading-relaxed ml-2 list-disc pl-4 marker:text-lb-blush">
                 <li>Orders can only be canceled if they have not yet been packed or dispatched from our fulfillment center. Once a tracking number is generated, the order is final.</li>
                 <li>To request a cancellation, please reach out to our support team immediately quoting your order ID.</li>
                 <li>If an item becomes unavailable after purchase, we will automatically cancel the missing item and process a full refund for its value immediately.</li>
               </ul>
            </section>

            {/* Quality & Authenticity */}
            <section id="authenticity">
               <h2 className="text-xl font-display font-semibold text-lb-dark mb-5 pb-3 border-b border-lb-border flex items-center gap-2">
                 <span className="text-lb-rose">✦</span> Authenticity Guarantee
               </h2>
               <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  At Kivara Beauty, every single formulation in our inventory is 100% authentic. We partner exclusively with official brands and authorized regional distributors. We take warehousing quality control extremely seriously, utilizing temperature-controlled environments to ensure you receive the best and freshest products for your skin.
               </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
