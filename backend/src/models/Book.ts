import { Schema, model } from 'mongoose';

// 1. تحديد أنواع البيانات باستخدام TypeScript (Interface)
interface IBook {
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
}

// 2. بناء الـ Mongoose Schema وتحديد الـ Validation المطلوب
const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  pages: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // الـ Rating من 1 لـ 5 زي ما طلبوا
}, { timestamps: true });

// 🔥 أهم سطر في التحدي كله (الـ Indexing لـ 10 مليون سجل)
// السطر ده بيخلي الداتا بيز تفهرس اسامي الكتب والمؤلفين عشان البحث يكون فوري وميعملش انهيار للسيرفر
bookSchema.index({ title: 'text', author: 'text' });

export const Book = model<IBook>('Book', bookSchema);