'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2">Cal AI</h1>
        <p className="text-gray-400">თქვენი ჯანმრთელობის ასისტენტი</p>
      </motion.div>
      
      <AuthForm />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm text-gray-400"
      >
        <p>დაცულია ყველა უფლება &copy; {new Date().getFullYear()}</p>
      </motion.div>
    </div>
  );
} 