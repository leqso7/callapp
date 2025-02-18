import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  AuthError,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { motion } from 'framer-motion';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: AuthError) => {
    switch (error.code) {
      case 'auth/operation-not-allowed':
        return 'ავტორიზაციის მეთოდი არ არის ჩართული Firebase კონსოლში';
      case 'auth/email-already-in-use':
        return 'ეს ელ-ფოსტა უკვე გამოყენებულია';
      case 'auth/invalid-email':
        return 'არასწორი ელ-ფოსტის ფორმატი';
      case 'auth/weak-password':
        return 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს';
      case 'auth/user-not-found':
        return 'მომხმარებელი ვერ მოიძებნა';
      case 'auth/wrong-password':
        return 'არასწორი პაროლი';
      default:
        return 'დაფიქსირდა შეცდომა, სცადეთ თავიდან';
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account',
        ...(email ? { login_hint: email } : {}),
        auth_domain: window.location.origin
      });

      console.log('ავტორიზაციის მცდელობა დომენიდან:', window.location.origin);
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        console.log('წარმატებული ავტორიზაცია:', result.user.email);
      }
    } catch (err) {
      console.error('Google ავტორიზაციის შეცდომა:', err);
      const firebaseError = err as AuthError;
      
      switch (firebaseError.code) {
        case 'auth/unauthorized-domain':
          const currentDomain = window.location.origin;
          setError(`გთხოვთ დაამატოთ "${currentDomain}" Firebase კონსოლში`);
          console.log(`გთხოვთ დაამატოთ "${currentDomain}" Firebase Console → Authentication → Settings → Authorized domains`);
          break;
        case 'auth/popup-closed-by-user':
          setError('ავტორიზაციის ფანჯარა დაიხურა');
          break;
        case 'auth/popup-blocked':
          setError('გთხოვთ დაუშვათ პოპაპ ფანჯრები ამ საიტისთვის');
          break;
        case 'auth/cancelled-popup-request':
          setError('მიმდინარეობს ავტორიზაცია, გთხოვთ დაელოდოთ');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('ეს ელ-ფოსტა უკვე დაკავშირებულია სხვა მეთოდთან');
          break;
        case 'auth/network-request-failed':
          setError('ინტერნეტ კავშირის პრობლემა');
          break;
        default:
          setError(`დაფიქსირდა შეცდომა: ${firebaseError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const firebaseError = err as AuthError;
      setError(getErrorMessage(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6"
    >
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'შესვლა' : 'რეგისტრაცია'}
        </h2>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 bg-white text-gray-900 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google-ით {isLogin ? 'შესვლა' : 'რეგისტრაცია'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800/50 text-gray-400">ან</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              placeholder="თქვენი ელ-ფოსტა"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              პაროლი
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              placeholder="თქვენი პაროლი"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              />
            ) : (
              isLogin ? 'შესვლა' : 'რეგისტრაცია'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            disabled={loading}
          >
            {isLogin ? 'არ გაქვთ ანგარიში? დარეგისტრირდით' : 'უკვე გაქვთ ანგარიში? შედით'}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 