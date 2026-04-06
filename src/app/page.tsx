'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  ShieldCheck, ChevronRight, Users, Globe, Building2, Quote, 
  ArrowRight, Landmark, Briefcase, GraduationCap, Network, 
  Eye, Target, Lightbulb, Heart, CheckCircle2, TrendingUp, Presentation,
  Wallet, Shield, Monitor, Globe2, HeartHandshake, BookOpen
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-white">
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#008A6208_1px,transparent_1px),linear-gradient(to_bottom,#008A6208_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] w-full h-full pointer-events-none" />
        {/* Soft Radial Gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,138,98,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[70vh]">
            {/* Hero Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6 lg:space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008A62]/10 text-[#008A62] text-sm font-bold w-fit shadow-sm hover:scale-105 transition-transform cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#008A62]" />
                <span className="tracking-wide">Empowering Nigeria's Cooperative Economy</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-[3.25rem] sm:text-[4rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-slate-900">
                <span className="text-[#008A62]">NOGALSS</span> National <br />
                Apex <span className="text-[#008A62]">Cooperative</span> <br />
                <span className="text-[#008A62]">Society</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-[90%] leading-relaxed font-medium">
                National Umbrella Body for Skilled-Based Professionals, Artisans, NGOs, CSOs, Associations and Literacy-Focused Cooperatives across Nigeria.
              </motion.p>
              
              <motion.p variants={itemVariants} className="text-base text-slate-500 max-w-[90%] leading-relaxed">
                We exist to <span className="font-bold text-[#008A62]">organize, empower, finance, protect, and represent</span> Nigeria's informal and skilled-based economy through cooperative principles and inclusive development.
              </motion.p>

              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 pt-4 max-w-[95%]">
                {[
                  { icon: Globe, label: 'National Coverage' },
                  { icon: ShieldCheck, label: 'Digital Infrastructure' },
                  { icon: Landmark, label: 'Access to Finance' },
                  { icon: Building2, label: 'Government Partnerships' },
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#008A62]/20 hover:shadow-[0_8px_20px_rgba(0,138,98,0.08)] transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#008A62]/10 text-[#008A62] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon size={20} className="stroke-[2.5px]" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm tracking-tight">{feature.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Right Image & Overlays */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0"
            >
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,138,98,0.3)] group z-0 ring-1 ring-slate-900/5">
                <img 
                  src="/images/hero_collective_strength.png" 
                  alt="NOGALSS Collective Strength" 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#008A62]/40 via-transparent to-transparent opacity-60 mix-blend-multiply pointer-events-none" />
              </div>

              {/* Stats Overlay 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] lg:top-[25%] -right-4 lg:-right-8 bg-white p-5 lg:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col items-center min-w-[130px] lg:min-w-[150px] border border-slate-50 z-20 group cursor-default"
              >
                <div className="text-3xl lg:text-4xl font-black text-[#008A62] mb-1 group-hover:scale-110 transition-transform">36+</div>
                <div className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">States<br/>Covered</div>
              </motion.div>

              {/* Stats Overlay 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 lg:-bottom-10 left-[10%] bg-white p-5 lg:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col items-center min-w-[140px] lg:min-w-[160px] border border-slate-50 z-20 group cursor-default"
              >
                <div className="text-3xl lg:text-4xl font-black text-amber-500 mb-1 group-hover:scale-110 transition-transform">100K+</div>
                <div className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Members<br/>Nationwide</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Full-Width CTA Banner Below Hero Layout */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 lg:mt-16 w-full"
          >
            <Link href="/register/member" className="block w-full text-center group">
              <div className="w-full bg-[#008A62] py-6 px-10 rounded-2xl md:rounded-[2rem] text-white shadow-[0_15px_40px_-10px_rgba(0,138,98,0.5)] md:hover:shadow-[0_20px_50px_-10px_rgba(0,138,98,0.6)] hover:bg-[#007A57] transition-all duration-300 md:group-hover:-translate-y-1 active:scale-[0.99] active:translate-y-0">
                <span className="text-lg md:text-xl lg:text-2xl font-medium tracking-wide">
                  Join the cooperative movement shaping Nigeria's economic future
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Vision, Mission, and Core Values Section */}
      <section className="section bg-white pt-10 pb-0 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-stretch">
            
            {/* Left Column: Vision & Mission */}
            <div className="flex flex-col gap-6 lg:gap-8 h-full">
              {/* Vision Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 lg:p-10 rounded-2xl bg-[#E8F8F5] border-l-[4px] border-[#008A62] flex flex-col justify-start gap-4 flex-1 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-[10px] bg-[#008A62] text-white flex items-center justify-center shadow-md">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Our Vision</h3>
                </div>
                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  To be Nigeria's leading apex cooperative institution uniting and empowering skilled-based, artisan, NGO, association, unions, and literacy communities through inclusive development, sustainable economic growth, and social transformation.
                </p>
              </motion.div>

              {/* Mission Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 lg:p-10 rounded-2xl bg-[#FFF9ED] border-l-[4px] border-[#F5A623] flex flex-col justify-start gap-4 flex-1 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-[10px] bg-[#F5A623] text-white flex items-center justify-center shadow-md">
                    <Target size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Our Mission</h3>
                </div>
                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  To empower and unify cooperatives nationwide through structured coordination, financial access, capacity building, digital systems, and strategic partnerships.
                </p>
              </motion.div>
            </div>

            {/* Right Column: Core Values & Commitment */}
            <div className="flex flex-col gap-8 h-full justify-between">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl lg:text-[2rem] font-bold text-slate-900 mb-8 tracking-tight"
                >
                  Our Core Values
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {[
                    { title: 'Cooperation & Inclusiveness', icon: Users, color: 'text-emerald-600', bg: 'bg-[#D1F2EB]', iconSize: 20 },
                    { title: 'Transparency & Accountability', icon: Shield, color: 'text-blue-600', bg: 'bg-[#EBF5FB]', iconSize: 20 },
                    { title: 'Equity & Social Justice', icon: Heart, color: 'text-rose-500', bg: 'bg-[#FDEDEC]', iconSize: 20 },
                    { title: 'Innovation & Sustainability', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-[#FEF5E7]', iconSize: 20 },
                  ].map((val, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col items-start gap-4"
                    >
                      <div className={`${val.bg} ${val.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <val.icon size={val.iconSize} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 leading-snug">{val.title}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Commitment Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative p-6 lg:p-8 rounded-2xl bg-[#0A4226] text-white flex flex-col justify-center items-center text-center shadow-lg w-full"
              >
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00DDA3] opacity-90">OUR COMMITMENT</span>
                  <h3 className="text-lg lg:text-xl font-bold leading-snug">
                    Professionalism & Integrity in everything we do
                  </h3>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* What We Do - Core Functions Section */}
      <section className="section relative bg-gray-50/30 overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-4">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-full bg-[#008A62]/10 text-[#008A62] text-xs font-black uppercase tracking-[0.2em]"
            >
              What We Do
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-black text-slate-900"
            >
              Our <span className="text-[#008A62]">Core Functions</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              We provide comprehensive cooperative services to organize, empower, and protect Nigeria's informal and skilled-based economy.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                title: 'Cooperative Savings & Loans', 
                desc: 'Access member-friendly savings schemes and low-interest cooperative loans', 
                icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50/50', iconBg: 'bg-emerald-500' 
              },
              { 
                title: 'Empowerment Programs', 
                desc: 'Agricultural support, artisan tools financing, transport empowerment', 
                icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50/50', iconBg: 'bg-blue-500' 
              },
              { 
                title: 'Training & Certification', 
                desc: 'Skills acquisition, vocational training, and professional certification', 
                icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50/50', iconBg: 'bg-purple-500' 
              },
              { 
                title: 'Welfare & Insurance', 
                desc: 'Health insurance, welfare schemes, and emergency assistance', 
                icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50/50', iconBg: 'bg-rose-500' 
              },
              { 
                title: 'Digital Cooperative Platform', 
                desc: 'Digital registration, cooperative wallet, and online banking dashboard', 
                icon: Monitor, color: 'text-amber-600', bg: 'bg-amber-50/50', iconBg: 'bg-amber-500' 
              },
              { 
                title: 'International Partnerships', 
                desc: 'Connect to ICA, African federations, and global opportunities', 
                icon: Globe2, color: 'text-teal-600', bg: 'bg-teal-50/50', iconBg: 'bg-teal-500' 
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${item.bg} p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:bg-white hover:border-[#008A62]/20 hover:shadow-[0_20px_50px_rgba(0,138,98,0.08)] group`}
              >
                <div className={`${item.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-[#0A4226] p-10 md:p-16 rounded-[2.5rem] text-white shadow-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Additional Services We Provide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {[
                'Cooperative registration support',
                'Government program implementation',
                'Market access & trade fairs',
                'Gender equity programs',
                'Policy advocacy',
                'Bulk purchasing network',
                'Dividend distribution',
                'Digital ID issuance'
              ].map((service, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90 font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-sm md:text-base leading-snug">{service}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits and Membership Levels Section */}
      <section className="section bg-[#F8FAFC]">
        <div className="container">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Benefits Content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="px-5 py-2 rounded-full bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-[0.2em] w-fit"
                >
                  Member Benefits
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl lg:text-[3.5rem] font-black text-slate-900 leading-[1.1] tracking-tight"
                >
                  Why Join <span className="text-[#008A62]">NOGALSS?</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-lg lg:text-xl text-slate-600 leading-relaxed font-medium max-w-[540px]"
                >
                  As a member, you gain access to a comprehensive ecosystem of financial services, empowerment programs, and growth opportunities.
                </motion.p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                {[
                  { icon: Wallet, label: 'Access to low-interest cooperative loans' },
                  { icon: TrendingUp, label: 'Cooperative dividends and surplus sharing' },
                  { icon: GraduationCap, label: 'Training, certification & skills development' },
                  { icon: Monitor, label: 'Digital ID & cooperative wallet' },
                  { icon: Users, label: 'Youth, women & PWD inclusion programs' },
                  { icon: Briefcase, label: 'Participation in empowerment programs' },
                  { icon: Building2, label: 'Bulk purchasing and shared infrastructure' },
                  { icon: HeartHandshake, label: 'Health insurance & welfare schemes' },
                  { icon: ShieldCheck, label: 'Policy advocacy & national representation' },
                  { icon: Globe, label: 'International partnerships & exchange programs' }
                ].map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#008A62]/10 text-[#008A62] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#008A62] group-hover:text-white transition-all duration-300">
                      <benefit.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-700 text-[15px] leading-tight">{benefit.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="pt-6"
              >
                <Link 
                  href="/register/member" 
                  className="inline-flex items-center gap-3 bg-[#008A62] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_15px_30px_-5px_rgba(0,138,98,0.3)] hover:bg-[#007A57] transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  Start Your Membership
                  <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Membership Cards */}
            <div className="flex flex-col gap-6 w-full ml-auto lg:max-w-[480px]">
              {/* Card 1: Apex */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#008A62] text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-8 relative z-10">Apex / Umbrella Organizations</h3>
                <ul className="space-y-5 relative z-10">
                  {['National associations & unions', 'Sector-based apex bodies', 'NGOs, CSOs & Professional groups', 'Registered cooperatives'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-white font-bold">
                      <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[17px] tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 2: Member Organizations */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#F59E0B] text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-8 relative z-10">Member Organizations</h3>
                <ul className="space-y-5 relative z-10">
                  {['Registered cooperatives', 'Community-based groups', 'Occupational & trade groups'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-white font-bold">
                      <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[17px] tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 3: Individual Financial Members */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#3B82F6] text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-8 relative z-10">Individual Financial Members</h3>
                <ul className="space-y-5 relative z-10">
                  {['Artisans & skilled workers', 'Entrepreneurs'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-white font-bold">
                      <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[17px] tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-black text-slate-900"
            >
              Ready to <span className="text-[#008A62]">Get Started?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Join the cooperative movement that's reshaping Nigeria's economic landscape.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'For Individuals',
                subtitle: 'Artisans & Skilled Workers',
                desc: 'Your pathway from daily income to lasting prosperity.',
                icon: Users,
                color: 'bg-emerald-600',
                btnText: 'Join as Member',
                href: '/register/member'
              },
              {
                title: 'For Organizations',
                subtitle: 'Associations & Cooperatives',
                desc: 'Institutionalize your members\' future with us.',
                icon: Building2,
                color: 'bg-blue-600',
                btnText: 'Register Organization',
                href: '/register/organization'
              },
              {
                title: 'For Partners',
                subtitle: 'Investors & Development Partners',
                desc: 'The structured gateway into Nigeria\'s grassroots economy.',
                icon: HeartHandshake,
                color: 'bg-amber-600',
                btnText: 'Partner With Us',
                href: '/register/partner'
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group h-full"
              >
                <div className={`${card.color} h-full min-h-[400px] rounded-[3rem] p-10 flex flex-col justify-end overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2`}>
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative z-10 text-white space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                      <card.icon size={28} />
                    </div>
                    <div>
                      <p className="text-white/80 font-bold text-xs uppercase tracking-[0.1em] mb-1">{card.title}</p>
                      <h3 className="text-3xl font-black">{card.subtitle}</h3>
                    </div>
                    <p className="text-base text-white/90 leading-relaxed font-medium mb-4">
                      {card.desc}
                    </p>
                    <Link 
                      href={card.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 group/btn w-fit"
                    >
                      {card.btnText}
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 lg:py-32 bg-[#0A4226] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00DDA3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00DDA3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 max-w-4xl text-center space-y-12">
          <Quote className="mx-auto text-[#00DDA3] opacity-50 w-20 h-20 mb-8" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            "Nigeria cannot grow by ignoring the majority of its workforce. The future belongs to those who organize, collaborate, and build systems that endure."
          </h2>
          <div className="pt-8">
            <h4 className="text-2xl font-black text-[#00DDA3] mb-2">Comrade Noah Emmanuel</h4>
            <p className="text-lg text-white/70 font-medium">National President/CEO, NOGALSS National Apex Cooperative Society Limited</p>
          </div>
        </div>
      </section>
    </div>
  );
}

