'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserFoodHistory, FoodRecord } from '@/lib/services/food-history';
import { useRouter } from 'next/navigation';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<FoodRecord[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadHistory() {
      if (user) {
        try {
          const records = await getUserFoodHistory(user.uid);
          setHistory(records);
        } catch (err) {
          setError('ისტორიის ჩატვირთვისას დაფიქსირდა შეცდომა');
          console.error('ისტორიის ჩატვირთვის შეცდომა:', err);
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadHistory();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">კვების ისტორია</h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {history.length === 0 ? (
          <motion.div
            variants={item}
            className="text-center text-gray-400 py-12"
          >
            ისტორია ცარიელია
          </motion.div>
        ) : (
          <motion.div variants={container} className="space-y-6">
            {history.map((record) => (
              <motion.div
                key={record.id}
                variants={item}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={record.imageUrl}
                        alt="საკვების სურათი"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-gray-300">{record.description}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(record.createdAt).toLocaleString('ka-GE')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">კალორიები</div>
                        <div className="text-xl font-semibold">{record.calories} კკალ</div>
                      </div>
                      
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">ცილები</div>
                        <div className="text-xl font-semibold">{record.protein}გ</div>
                      </div>
                      
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">ნახშირწყლები</div>
                        <div className="text-xl font-semibold">{record.carbs}გ</div>
                      </div>
                      
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">ცხიმები</div>
                        <div className="text-xl font-semibold">{record.fat}გ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 