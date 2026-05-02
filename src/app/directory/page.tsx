'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Check, Copy, Hash, Search, Sparkles } from 'lucide-react';
import { fetchPublicDirectory, type PublicDirectoryItem } from '@/lib/api';

export default function DirectoryPage() {
  const [items, setItems] = useState<PublicDirectoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | PublicDirectoryItem['kind']>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopyCode(id: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1500);
    } catch (err) {
      console.error('Failed to copy directory code', err);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadDirectory() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPublicDirectory();
        if (mounted) setItems(data);
      } catch (err) {
        console.error('Failed to load public directory', err);
        if (mounted) setError('We could not load the directory right now. Please try again shortly.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDirectory();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesKind = kindFilter === 'all' ? true : item.kind === kindFilter;
      const matchesName = !query ? true : item.name.toLowerCase().includes(query);
      return matchesKind && matchesName;
    });
  }, [items, searchTerm, kindFilter]);

  const filterOptions: Array<{ label: string; value: 'all' | PublicDirectoryItem['kind'] }> = [
    { label: 'All', value: 'all' },
    { label: 'Organisations', value: 'Organisation' },
    { label: 'Sub-Organisations', value: 'Sub-Organisation' },
    { label: 'Units', value: 'Unit' },
  ];

  const stats = [
    { label: 'Visible records', value: items.length },
    { label: 'Matches found', value: filteredItems.length },
  ];

  return (
    <div className="min-h-screen bg-[#f7fbf9] text-slate-900">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#043c2d_0%,#0a6c4d_55%,#0f8a62_100%)] pt-28 pb-16">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
              <Sparkles size={16} /> Public directory
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Search all organisations, sub-organisations and units in one place.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Guests can browse the directory by name and view the registration code for each entry without needing to sign in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-10 grid gap-4 md:grid-cols-2"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-white/75">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_80px_rgba(2,44,34,0.08)] sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Directory search</h2>
                <p className="mt-1 text-sm text-slate-500">Type a name to filter the complete directory.</p>
              </div>
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0f8a62] focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = kindFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKindFilter(option.value)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      active
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              <p className="mt-4 text-sm font-medium text-slate-500">Loading directory...</p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
              <p className="font-semibold">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Building2 className="mx-auto text-slate-300" size={48} />
              <h3 className="mt-4 text-xl font-bold text-slate-900">No matches found</h3>
              <p className="mt-2 text-sm text-slate-500">Try a different organisation name.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2) }}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(2,44,34,0.05)] transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(2,44,34,0.1)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Public Directory Entry</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Hash size={14} />
                    <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">Code</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="inline-flex rounded-xl bg-slate-50 px-3 py-2 font-mono text-sm font-bold tracking-wide text-slate-800">
                      {item.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.id, item.code)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                      aria-label={`Copy code for ${item.name}`}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === item.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-[2rem] bg-slate-900 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Need more help?</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Reach out if you cannot find an entry.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  The directory is updated from the public hierarchy records. If a code is missing, contact support for verification.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Contact support
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
