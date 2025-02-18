'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';

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

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto px-4 py-8"
    >
      <motion.header variants={item} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cal AI</h1>
        <p className="text-xl text-gray-300">
          მოგესალმებით, {user.email}
        </p>
      </motion.header>

      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <motion.div
          variants={item}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer"
          onClick={() => router.push('/calories')}
        >
          <h2 className="text-2xl font-semibold mb-4">კალორიების ანალიზი</h2>
          <p className="text-gray-300">
            ატვირთეთ საკვების ფოტო და მიიღეთ დეტალური ინფორმაცია კალორიების შესახებ
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-4">ნაბიჯების თვალყურის დევნება</h2>
          <p className="text-gray-300">
            თვალი ადევნეთ თქვენს ფიზიკურ აქტივობას და დახარჯულ კალორიებს
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-4">პერსონალიზებული გეგმა</h2>
          <p className="text-gray-300">
            მიიღეთ მორგებული კვების და ვარჯიშის გეგმა თქვენი მიზნების მისაღწევად
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
