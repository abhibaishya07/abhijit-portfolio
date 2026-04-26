import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitReview } from '../../api/productApi';

export default function WriteReviewModal({ product, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a star rating');
    if (!reviewText.trim()) return toast.error('Please write a review');

    setSubmitting(true);
    try {
      await submitReview(product.id, { rating, reviewText });
      toast.success('Your review has been published!');
      onReviewSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lb-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white max-w-lg w-full p-8 relative shadow-2xl animate-scaleIn border border-lb-border">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-lb-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">Write a Review</p>
          <h2 className="font-display text-2xl font-medium line-clamp-1">{product.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating Selection */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-semibold text-lb-black uppercase tracking-widest">Rate this product</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg 
                    className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating) ? 'text-lb-rose' : 'text-gray-200'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && <span className="text-xs text-lb-rose font-medium mt-1">{['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-lb-black uppercase tracking-widest">Your Review</label>
            <textarea
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you love about it? How did it feel on your skin?"
              rows="4"
              className="w-full border border-gray-300 p-4 focus:outline-none focus:border-lb-rose focus:ring-1 focus:ring-lb-rose transition-colors resize-none placeholder-gray-400 text-sm"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
