import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { FoodAnalysis } from './gemini';

export interface FoodRecord extends FoodAnalysis {
  id: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
}

export async function saveFoodAnalysis(
  userId: string,
  imageUrl: string,
  analysis: FoodAnalysis
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'food-history'), {
      ...analysis,
      imageUrl,
      userId,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('შენახვის შეცდომა:', error);
    throw new Error('ვერ მოხერხდა ანალიზის შენახვა');
  }
}

export async function getUserFoodHistory(userId: string): Promise<FoodRecord[]> {
  try {
    const q = query(
      collection(db, 'food-history'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as FoodRecord[];
  } catch (error) {
    console.error('ისტორიის წამოღების შეცდომა:', error);
    throw new Error('ვერ მოხერხდა ისტორიის წამოღება');
  }
} 