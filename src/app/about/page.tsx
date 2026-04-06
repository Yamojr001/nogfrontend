'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  Shield,
  Users,
  CheckCircle,
  Award,
  Heart,
  Lightbulb,
} from 'lucide-react';

const LOGO_URL =
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69776e33efde67a960d2f553/207252f44_Nogalslogo.png';

const mandates = [
  'National coordination and supervision of member cooperatives',
  'Cooperative financial inclusion and empowerment',
  'Capacity building and skills development',
  'Government and donor project implementation',
  'Advocacy and policy engagement',
  'Digital transformation of cooperatives',
];

const values = [
  { icon: Users, label: 'Cooperation & Inclusiveness', color: 'emerald' },
  { icon: Shield, label: 'Transparency & Accountability', color: 'blue' },
  { icon: Heart, label: 'Equity & Social Justice', color: 'rose' },
  { icon: Lightbulb, label: 'Innovation & Sustainability', color: 'amber' },
  { icon: Award, label: 'Professionalism & Integrity', color: 'purple' },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About NOGALSS</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Learn about Nigeria&apos;s leading apex cooperative institution
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  NOGALSS National Apex Cooperative Society Limited
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  NOGALSS National Apex Cooperative Society Limited is a duly registered National Apex
                  Cooperative operating under the Nigerian Cooperative Societies Act. We serve as the
                  central coordinating, technical, and implementing body for skilled-based cooperatives,
                  artisans, NGOs, CSOs, associations, and literacy-focused cooperative institutions across
                  Nigeria.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We provide governance coordination, financial systems, capacity development, digital
                  infrastructure, and national representation for our members.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80"
                    alt="Cooperative members"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <img src={LOGO_URL} alt="NOGALSS Logo" className="h-16 mb-2 brightness-0 invert" />
                    <p className="text-white font-medium">Building Nigeria&apos;s cooperative future</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                Our Mandate
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We&apos;re Here To Do</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mandates.map((mandate, index) => (
                <motion.div
                  key={mandate}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700 font-medium">{mandate}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 text-white"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-emerald-50 text-lg leading-relaxed">
                  To be Nigeria&apos;s leading apex cooperative institution uniting and empowering
                  skilled-based, artisan, NGO, association, unions, and literacy communities through
                  inclusive development, sustainable economic growth, and social transformation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-10 text-white"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-amber-50 text-lg leading-relaxed">
                  To empower and unify cooperatives nationwide through structured coordination,
                  financial access, capacity building, digital systems, and strategic partnerships.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-emerald-200 text-lg">The principles that guide everything we do</p>
            </motion.div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-white font-medium text-sm">{value.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic mb-8">
                &quot;This Is Not Another Association. This Is a Movement. NOGALSS Apex Cooperative
                Society Limited is not a ceremonial body. It is a national economic instrument.&quot;
              </blockquote>
              <div>
                <p className="text-emerald-700 font-bold text-lg">Comrade Noah Emmanuel</p>
                <p className="text-gray-500">National President/CEO</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
