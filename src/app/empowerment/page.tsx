'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, ArrowRight, Briefcase, Truck, Zap, GraduationCap, Gavel, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchEmpowermentPrograms, applyToProgram, getCurrentUser } from '@/lib/api';

export default function EmpowermentPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [applying, setApplying] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [programsData, userData] = await Promise.all([
        fetchEmpowermentPrograms(),
        getCurrentUser().catch(() => null)
      ]);
      setPrograms(programsData);
      setUser(userData);
    } catch (err) {
      console.error('Failed to load empowerment data');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (programId: number) => {
    if (!user) {
      window.location.href = '/login?redirect=/empowerment';
      return;
    }

    setApplying(programId);
    setMessage(null);
    try {
      await applyToProgram(programId, { 
        statementOfNeed: 'Standard application via marketplace.',
        supportingDocs: [] 
      });
      setMessage({ type: 'success', text: 'Application submitted successfully! It is now in the approval queue.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to submit application.' });
    } finally {
      setApplying(null);
    }
  };

  const getIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'agriculture': return <Target size={24} color="#1a6e45" />;
      case 'transport': return <Truck size={24} color="#C9962B" />;
      case 'energy': return <Zap size={24} color="#007bff" />;
      case 'training': return <GraduationCap size={24} color="#6f42c1" />;
      case 'legal': return <Gavel size={24} color="#dc3545" />;
      default: return <Briefcase size={24} color="#666" />;
    }
  };

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #061c10 0%, #0D4A2F 60%, #1a6e45 100%)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container px-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(201,150,43,0.2)', color: '#f0c84e' }}>Asset Financing & Grants</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Empowerment Marketplace</h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70">Browse and apply for sector-specific development programs, equipment financing, and skills training initiatives.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          {message && (
            <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading available programs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl">{getIcon(p.category)}</div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">{p.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">{p.description}</p>
                  
                  <div className="space-y-3 mb-6 pt-6 border-t border-gray-50">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Eligibility</span>
                      <span className="font-semibold text-gray-900">{p.eligibilityCriteria}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Max Funding</span>
                      <span className="font-semibold text-primary">₦{Number(p.maxFundingAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApply(p.id)}
                    disabled={applying === p.id}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${applying === p.id ? 'bg-gray-100 text-gray-400' : 'bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20'}`}
                  >
                    {applying === p.id ? 'Processing...' : 'Apply Now'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && programs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No active programs found</h3>
              <p className="text-gray-500">Check back later for new empowerment opportunities.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
