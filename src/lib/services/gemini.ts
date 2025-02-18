const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface FoodAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
}

export async function analyzeFoodImage(imageUrl: string): Promise<FoodAnalysis> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "ეს არის საკვების სურათი. გთხოვთ გააანალიზოთ და მოგვაწოდოთ შემდეგი ინფორმაცია JSON ფორმატში: კალორიები, ცილები (გრამებში), ნახშირწყლები (გრამებში), ცხიმები (გრამებში) და მოკლე აღწერა ქართულ ენაზე. გთხოვთ დააბრუნოთ მხოლოდ JSON ობიექტი."
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageUrl
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API-სთან დაკავშირების შეცდომა');
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    
    try {
      const analysis = JSON.parse(analysisText);
      return {
        calories: Number(analysis.calories) || 0,
        protein: Number(analysis.protein) || 0,
        carbs: Number(analysis.carbs) || 0,
        fat: Number(analysis.fat) || 0,
        description: analysis.description || 'აღწერა არ არის ხელმისაწვდომი'
      };
    } catch (parseError) {
      console.error('JSON პარსინგის შეცდომა:', parseError);
      throw new Error('მონაცემების დამუშავების შეცდომა');
    }
  } catch (error) {
    console.error('სურათის ანალიზის შეცდომა:', error);
    throw error;
  }
} 