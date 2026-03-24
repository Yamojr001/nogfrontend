'use client';
import { useState, useEffect } from 'react';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';

// Mock data until API is connected
const mockNews = [
  { id: 1, date: '2026-03-08', category: 'Announcement', title: 'NOGALSS Launches National Digital Cooperative Banking Platform', excerpt: 'NOGALSS unveils its landmark digital platform enabling 500,000+ members across Nigeria to access savings, loans, and empowerment programs from any device.', featured: true },
  { id: 2, date: '2026-02-20', category: 'Event', title: 'Annual General Assembly 2026 Holds in Abuja', excerpt: 'Representatives from all 36 states gathered at the 2026 Annual General Assembly to review progress, approve budgets and elect new leadership.', featured: false },
  { id: 3, date: '2026-02-05', category: 'Partnership', title: 'NOGALSS Signs MOU with International Cooperative Alliance', excerpt: 'A strategic partnership agreement with ICA opens new avenues for international cooperative training and global market access for Nigerian artisans.', featured: false },
  { id: 4, date: '2026-01-28', category: 'Empowerment', title: '2,000 Farmers Benefit from Agricultural Equipment Financing', excerpt: 'Phase 1 of the NOGALSS Agriculture Empowerment Program disbursed equipment loans to 2,000 smallholder farmers across 12 states.', featured: false },
  { id: 5, date: '2026-01-15', category: 'Training', title: 'Digital Skills Program Trains 5,000 Young Artisans', excerpt: 'In partnership with SMEDAN, NOGALSS ran a 3-month digital skills bootcamp benefiting 5,000 young artisans and tradespeople nationwide.', featured: false },
  { id: 6, date: '2025-12-30', category: 'Finance', title: 'NOGALSS Members Receive Annual Savings Dividends', excerpt: 'Over 400,000 members received their annual cooperative savings dividends — totalling ₦2.4 billion — the largest payout in the organisation\'s history.', featured: false },
];

const categories = ['All', 'Announcement', 'Event', 'Partnership', 'Empowerment', 'Training', 'Finance'];

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [news, setNews] = useState(mockNews);

  const featured = mockNews.find(n => n.featured);
  const filtered = mockNews.filter(n => !n.featured && (activeCategory === 'All' || n.category === activeCategory) && (n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase())));

  return (
    <>
      <section style={{ background: 'var(--primary-dark)', padding: '160px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container reveal">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>News & Updates</span>
          <h1 className="display-2" style={{ color: 'white', textAlign: 'center', marginBottom: '24px' }}>News & Announcements</h1>
          <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto', maxWidth: '800px' }}>Stay up to date with the latest from NOGALSS — programs, events, and cooperative news.</p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section style={{ padding: '64px 0 0', background: 'var(--gray-50)' }}>
          <div className="container">
            <div className="reveal" style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: '24px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>📰</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Featured Story</span>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '800' }}>Featured</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} />{featured.date}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '24px', lineHeight: '1.2', fontWeight: '800' }}>{featured.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '32px' }}>{featured.excerpt}</p>
                <button className="btn btn-primary btn-lg">Read Full Story <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {/* Filters */}
          <div className="reveal" style={{ display: 'flex', gap: '20px', marginBottom: '56px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news and articles..." style={{ width: '100%', padding: '16px 20px 16px 56px', border: '1.5px solid var(--border)', borderRadius: '16px', fontSize: '1rem', fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border-color 0.2s', boxShadow: 'var(--shadow-sm)' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', border: '1.5px solid', cursor: 'pointer', background: activeCategory === cat ? 'var(--primary)' : 'white', color: activeCategory === cat ? 'white' : 'var(--text-secondary)', borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)', transition: 'all 0.2s', boxShadow: activeCategory === cat ? 'var(--shadow-md)' : 'none' }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {filtered.map((n, i) => (
              <article key={n.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, background: 'white', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xl)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-soft)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={12} />{n.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />{n.date}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '16px', lineHeight: '1.4', fontFamily: 'var(--font-display)' }}>{n.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', flex: 1, marginBottom: '24px' }}>{n.excerpt}</p>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>Read more <ArrowRight size={14} /></span>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--text-muted)' }} className="reveal">
              <p style={{ fontSize: '1.2rem' }}>No news found matching your search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
