import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Search, 
  Layers, 
  Hash, 
  User, 
  FileText, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    rating: '5'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/books?page=${page}&limit=10&search=${search}`);
      const data = await response.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
      setTotalBooks(data.totalBooks || 0);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { title, author, isbn, pages, rating } = formData;
    if (!title || !author || !isbn || !pages || !rating) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          isbn,
          pages: Number(pages),
          rating: Number(rating)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormError(errorData.message || 'Failed to save book record.');
        return;
      }

      setFormSuccess('Book record cataloged successfully!');
      setFormData({ title: '', author: '', isbn: '', pages: '', rating: '5' });
      setPage(1);
      fetchBooks();
    } catch (error) {
      setFormError('Server connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 !text-slate-900 font-sans antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-300 pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              {/* 🚀 الـ !text-slate-900 والـ font-black هيجبروا الخط يظهر صريح وحاد جداً */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight !text-slate-900 m-0">
                HugeScale Book Tracker
              </h1>
            </div>
            <p className="text-sm font-bold !text-slate-700 m-0">
              Enterprise catalog engine optimized for up to 10M records.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border-2 border-slate-300 shadow-sm w-fit shrink-0">
            <Layers className="w-5 h-5 text-slate-800" />
            <div className="text-xs font-extrabold !text-slate-800 uppercase tracking-wider">
              Total Index: <span className="text-blue-700 font-black text-sm ml-1">{totalBooks}</span>
            </div>
          </div>
        </header>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <section className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black !text-slate-900 tracking-tight flex items-center gap-2 m-0">
                <PlusCircle className="w-5 h-5 text-slate-900" />
                Catalog New Entry
              </h2>
              <p className="text-xs font-bold !text-slate-600 mt-1 m-0">Ensure metadata validation standards are met.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black !text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-slate-700" /> Book Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm !text-slate-900 font-bold placeholder:text-slate-400 transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Designing Data-Intensive Applications"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black !text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <User className="w-4 h-4 text-slate-700" /> Author / Publisher
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm !text-slate-900 font-bold placeholder:text-slate-400 transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Martin Kleppmann"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black !text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Hash className="w-4 h-4 text-slate-700" /> ISBN Identifier
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black !text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="e.g., 978-1449373320"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black !text-slate-800 uppercase tracking-wide">Volume Pages</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm !text-slate-900 font-black placeholder:text-slate-400 transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    placeholder="612"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black !text-slate-800 uppercase tracking-wide">Metric Rating</label>
                  <select
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm !text-slate-900 font-black transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none cursor-pointer"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} ★ Score</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Notifications */}
              {formError && (
                <div className="flex items-start gap-2.5 text-xs font-bold text-red-800 bg-red-50 border-2 border-red-300 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="flex items-start gap-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-black text-white text-sm font-black py-3 px-4 rounded-xl shadow-md transition-all duration-150 hover:shadow-lg cursor-pointer active:scale-[0.98] mt-2 tracking-wide uppercase"
              >
                Commit Entry to Cluster
              </button>
            </form>
          </section>

          {/* Right Column: Data Table View */}
          <div className="lg:col-span-2 space-y-4 w-full">
            
            {/* Search Filter Strip */}
            <div className="bg-white p-3 rounded-xl border-2 border-slate-300 flex items-center gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query by title or cataloged author..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border-2 border-slate-300 rounded-lg !text-slate-900 font-bold placeholder:text-slate-500 transition-all focus:bg-white focus:border-slate-950 focus:outline-none"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            {/* Advanced Table Structure */}
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-300 text-xs font-black uppercase tracking-wider !text-slate-900">
                      <th className="py-4 px-5">Title Spectrum</th>
                      <th className="py-4 px-5">Author</th>
                      <th className="py-4 px-5 font-mono">ISBN</th>
                      <th className="py-4 px-5 text-center">Pages</th>
                      <th className="py-4 px-5 text-right pr-6">Rating Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center font-bold">
                          <div className="flex items-center justify-center gap-2.5">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                            <span className="!text-slate-900 text-xs tracking-wider font-mono font-black">Executing High-Speed Scan...</span>
                          </div>
                        </td>
                      </tr>
                    ) : books.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center !text-slate-800 text-xs font-black font-mono">
                          Null response. No records match target query params.
                        </td>
                      </tr>
                    ) : (
                      books.map((book) => (
                        <tr key={book._id} className="hover:bg-slate-100/70 transition-colors group">
                          <td className="py-4 px-5 font-black !text-slate-950 group-hover:text-black max-w-xs truncate">
                            {book.title}
                          </td>
                          <td className="py-4 px-5 !text-slate-800 text-xs font-extrabold">
                            {book.author}
                          </td>
                          <td className="py-4 px-5 text-xs font-mono font-bold !text-slate-700">
                            {book.isbn}
                          </td>
                          <td className="py-4 px-5 text-center !text-slate-900 font-mono font-black text-xs">
                            {book.pages}
                          </td>
                          <td className="py-4 px-5 text-right pr-6">
                            <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-bold !text-slate-900">
                              <span className="flex items-center text-amber-500 gap-0.5">
                                {Array.from({ length: book.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                ))}
                              </span>
                              <span className="text-[11px] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded !text-slate-900 font-black">
                                {book.rating}.0
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Foot-bar */}
              {totalPages > 1 && (
                <div className="bg-slate-100 border-t-2 border-slate-300 px-5 py-4 flex items-center justify-between gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="flex items-center gap-1.5 bg-white border-2 border-slate-300 rounded-xl py-2 px-4 text-xs font-bold !text-slate-900 hover:bg-slate-200 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs !text-slate-800 font-mono font-bold">
                    PAGE <span className="!text-slate-950 font-black text-sm">{page}</span> OF {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="flex items-center gap-1.5 bg-white border-2 border-slate-300 rounded-xl py-2 px-4 text-xs font-bold !text-slate-900 hover:bg-slate-200 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;