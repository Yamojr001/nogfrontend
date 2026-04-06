'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  User,
  Check,
  ArrowRight,
  Wallet,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Gift,
  Star,
  UserPlus,
} from 'lucide-react';

const membershipCategories = [
  {
    icon: Building2,
    title: 'Apex / Umbrella Organizations',
    color: 'emerald',
    members: [
      'National associations, unions, federations',
      'Sector-based apex bodies',
      'NGOs, CSOs, Professional groups',
      'Registered cooperatives',
    ],
    benefits: [
      'Registration commissions',
      'Leadership dividend pool',
      'Priority access to contracts',
      'Governance appointments',
      'International exposure',
    ],
  },
  {
    icon: Users,
    title: 'Member Organizations',
    color: 'blue',
    members: [
      'Registered cooperatives',
      'Associations and community-based groups',
      'Occupational and trade groups',
    ],
    benefits: [
      'Share of registration fees',
      'Group loan eligibility',
      'CDF grant access',
      'Franchise rights',
      'National visibility',
    ],
  },
  {
    icon: User,
    title: 'Individual Financial Members',
    color: 'amber',
    members: ['Artisans', 'Skilled workers', 'Entrepreneurs', 'Informal sector participants'],
    benefits: [
      'Savings & loan access',
      'Annual dividends',
      'Empowerment assets',
      'Training & certification',
      'Welfare assistance',
    ],
  },
] as const;

const topBenefits = [
  { icon: Wallet, text: 'Access to low-interest cooperative loans' },
  { icon: Gift, text: 'Participation in empowerment programs' },
  { icon: TrendingUp, text: 'Cooperative dividends and surplus sharing' },
  { icon: Award, text: 'Training, certification & skills development' },
  { icon: Shield, text: 'Health insurance & welfare schemes' },
  { icon: Globe, text: 'International partnerships & exchange programs' },
] as const;

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Membership</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Join Nigeria&apos;s largest cooperative network and unlock your economic potential
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Membership Categories
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {membershipCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`rounded-2xl p-8 border-2 ${
                    category.color === 'emerald'
                      ? 'bg-emerald-50 border-emerald-200'
                      : category.color === 'blue'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      category.color === 'emerald'
                        ? 'bg-emerald-600'
                        : category.color === 'blue'
                        ? 'bg-blue-600'
                        : 'bg-amber-600'
                    }`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>

                  <div className="mb-6">
                    <p
                      className={`text-sm font-semibold mb-3 ${
                        category.color === 'emerald'
                          ? 'text-emerald-700'
                          : category.color === 'blue'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      Who can join:
                    </p>
                    <ul className="space-y-2">
                      {category.members.map((member) => (
                        <li key={member} className="flex items-start gap-2">
                          <Check
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              category.color === 'emerald'
                                ? 'text-emerald-600'
                                : category.color === 'blue'
                                ? 'text-blue-600'
                                : 'text-amber-600'
                            }`}
                          />
                          <span className="text-gray-700 text-sm">{member}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p
                      className={`text-sm font-semibold mb-3 ${
                        category.color === 'emerald'
                          ? 'text-emerald-700'
                          : category.color === 'blue'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      Benefits:
                    </p>
                    <ul className="space-y-2">
                      {category.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Member Benefits</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <UserPlus className="h-16 w-16 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join?</h2>
              <p className="text-xl text-emerald-100 mb-8">Start your membership journey today</p>
              <Link
                href="/register/member"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
