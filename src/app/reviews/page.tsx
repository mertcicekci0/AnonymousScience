'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';

interface Review {
  id: string;
  paperId: string;
  paperTitle: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
  rating?: number;
  comments?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      paperId: 'paper-1',
      paperTitle: 'Quantum Computing in Cryptography',
      status: 'pending',
      deadline: '2024-03-15',
    },
    {
      id: '2',
      paperId: 'paper-2',
      paperTitle: 'Machine Learning for Climate Prediction',
      status: 'in-progress',
      deadline: '2024-03-20',
      rating: 4,
      comments: 'Good methodology but needs more data validation.',
    },
  ]);

  const handleReviewSubmit = (reviewId: string, rating: number, comments: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'completed', rating, comments }
        : review
    ));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Reviews</h1>
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{review.paperTitle}</h2>
                  <p className="text-gray-400">Paper ID: {review.paperId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  review.status === 'pending' 
                    ? 'bg-yellow-900 text-yellow-200' 
                    : review.status === 'in-progress'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-green-900 text-green-200'
                }`}>
                  {review.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-400">Deadline: {review.deadline}</p>
              </div>

              {review.status === 'completed' ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400">Comments: {review.comments}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      onChange={(e) => {
                        const rating = parseInt(e.target.value);
                        if (rating >= 1 && rating <= 5) {
                          handleReviewSubmit(review.id, rating, '');
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Comments
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      rows={4}
                      onChange={(e) => {
                        const comments = e.target.value;
                        if (review.rating) {
                          handleReviewSubmit(review.id, review.rating, comments);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 