import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Book } from './models/Book';

const app = express();

// تفعيل الـ Middleware بشكل صريح كامل
app.use(cors({
  origin: 'http://localhost:5173', // تحديد بورت الفرونت إند بالظبط لزيادة الأمان
  credentials: true
}));
app.use(express.json());

// الاتصال بقاعدة بيانات المونجو المحلية (MongoDB Local)
const MONGO_URI = 'mongodb://localhost:27017/booktracker';
mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// ----------------------------------------------------
// [Endpoint 1]: إضافة كتاب جديد مع الـ Validation المطلوبة
// ----------------------------------------------------
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, pages, rating } = req.body;

    // 1. التأكد من أن كل الحقول مبعوتة
    if (!title || !author || !isbn || !pages || !rating) {
      res.status(400).json({ message: 'All fields (title, author, isbn, pages, rating) are required.' });
      return;
    }

    // 2. التأكد من أن التقييم بين 1 و 5
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
      return;
    }

    // حفظ الكتاب في الداتا بيز
    const newBook = new Book({ title, author, isbn, pages, rating });
    await newBook.save();
    
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Server Error while saving the book.' });
  }
});
// ----------------------------------------------------
// [Endpoint 2]: جلب الكتب مع الـ Pagination والبحث (الـ 10M records)
// ----------------------------------------------------
app.get('/api/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    // حساب عدد السجلات اللي هنفوتها بناءً على الصفحة الحالية
    const skip = (page - 1) * limit;

    // بناء فلتر البحث (لو المستخدم كتب حاجة، ابحث في الـ title أو الـ author)
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // جلب البيانات وحساب العدد الإجمالي بالتوازي لتوفير الوقت (Optimized Query)
    const [books, total] = await Promise.all([
      Book.find(query).skip(skip).limit(limit).lean().exec(), // ضفنا .lean() هنا عشان الـ Performance يكون طلقة مع الـ 10M
      Book.countDocuments(query)
    ]);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while fetching books.' });
  }
});

// تشغيل السيرفر على بورت 5000
const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));