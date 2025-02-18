'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { analyzeFoodImage, FoodAnalysis } from '@/lib/services/gemini';
import { saveFoodAnalysis } from '@/lib/services/food-history';
import { useRouter } from 'next/navigation';

export default function CaloriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError('');
        setAnalysis(null);
      } else {
        setError('გთხოვთ აირჩიოთ მხოლოდ სურათის ფაილი');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user) return;

    setLoading(true);
    setError('');

    try {
      const storageRef = ref(storage, `food-images/${user.uid}/${Date.now()}_${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const imageUrl = await getDownloadURL(storageRef);
      
      const result = await analyzeFoodImage(imageUrl);
      setAnalysis(result);
      
      await saveFoodAnalysis(user.uid, imageUrl, result);
      
    } catch (err) {
      setError('სურათის ანალიზისას დაფიქსირდა შეცდომა');
      console.error('ანალიზის შეცდომა:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">კალორიების ანალიზი</h1>
          <button
            onClick={() => router.push('/history')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ისტორია
          </button>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              აირჩიეთ საკვების ფოტო
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="imageInput"
              disabled={loading}
            />
            <label
              htmlFor="imageInput"
              className="block w-full p-4 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-lg cursor-pointer transition-colors text-center"
            >
              {previewUrl ? (
                <div className="relative aspect-video">
                  <img
                    src={previewUrl}
                    alt="არჩეული სურათი"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-gray-400">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  დააჭირეთ სურათის ასატვირთად
                </div>
              )}
            </label>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedImage || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              />
            ) : (
              'სურათის ანალიზი'
            )}
          </button>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">ანალიზის შედეგები</h3>
                <p className="text-gray-300 mb-4">{analysis.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">კალორიები</div>
                    <div className="text-xl font-semibold">{analysis.calories} კკალ</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">ცილები</div>
                    <div className="text-xl font-semibold">{analysis.protein}გ</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">ნახშირწყლები</div>
                    <div className="text-xl font-semibold">{analysis.carbs}გ</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">ცხიმები</div>
                    <div className="text-xl font-semibold">{analysis.fat}გ</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 