'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { fetchNews } from '@/lib/api';
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react';

type NewsItem = {
  id: number | string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  published_at?: string;
  featured_image?: string;
  is_featured?: boolean;
};

const categories = ['all', 'news', 'announcement', 'event', 'press_release'] as const;

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCategoryColor(category?: string): string {
  const colors: Record<string, string> = {
    news: 'bg-blue-100 text-blue-700',
    announcement: 'bg-amber-100 text-amber-700',
    event: 'bg-purple-100 text-purple-700',
    press_release: 'bg-emerald-100 text-emerald-700',
  };
  return colors[category || ''] || 'bg-gray-100 text-gray-700';
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      setIsLoading(true);
      try {
        const response = await fetchNews(1, 24);
        const items =
          (Array.isArray(response?.data) && response.data) ||
          (Array.isArray(response?.items) && response.items) ||
          (Array.isArray(response) && response) ||
          [];

        if (active) {
          setNews(items as NewsItem[]);
        }
      } catch {
        if (active) {
          setNews([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadNews();
    return () => {
      active = false;
    };
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const title = item.title || '';
      const excerpt = item.excerpt || item.content || '';
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [news, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">News & Announcements</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Stay updated with the latest from NOGALSS
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 pl-10 py-2 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all'
                      ? 'All'
                      : category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-16 text-gray-500">Loading news...</div>
            ) : filteredNews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {item.featured_image ? (
                        <img
                          src={item.featured_image}
                          alt={item.title || 'News image'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Tag className="h-12 w-12 text-emerald-300" />
                        </div>
                      )}
                      {item.is_featured && (
                        <span className="absolute top-4 right-4 bg-amber-500 text-white rounded-full px-2.5 py-1 text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryColor(item.category)}`}
                        >
                          {(item.category || 'general').replace('_', ' ')}
                        </span>
                        {item.published_at && (
                          <span className="flex items-center gap-1 text-gray-500 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatDate(item.published_at)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt || item.content}</p>

                      <button className="flex items-center gap-2 text-emerald-600 font-medium hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No news found</h3>
                <p className="text-gray-500">Check back soon for updates</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
