'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  Banknote,
  GraduationCap,
  Shield,
  Building,
  Globe,
  Smartphone,
  Tractor,
  Wrench,
  Truck,
  Store,
  Lightbulb,
  Home,
  FileCheck,
  Megaphone,
  Users,
  ArrowRight,
} from 'lucide-react';

const coreFunctions = [
  {
    icon: Banknote,
    title: 'Cooperative Savings & Loans',
    description: 'Member-friendly savings schemes and low-interest cooperative loan products',
  },
  {
    icon: Building,
    title: 'Government Programs',
    description: 'Implement government and donor-funded development programs',
  },
  {
    icon: Banknote,
    title: 'Development Fund (CDF)',
    description: 'Manage the National Cooperative Development Fund for member benefit',
  },
  {
    icon: GraduationCap,
    title: 'Training & Education',
    description: 'Skills acquisition, vocational training and cooperative education programs',
  },
  {
    icon: FileCheck,
    title: 'Registration Support',
    description: 'Support cooperative registration and regulatory compliance',
  },
  {
    icon: Shield,
    title: 'Welfare & Protection',
    description: 'Insurance, welfare schemes, and social protection programs',
  },
  {
    icon: Store,
    title: 'Markets & Infrastructure',
    description: 'Create shared markets, logistics, and business infrastructure',
  },
  {
    icon: Megaphone,
    title: 'Policy Advocacy',
    description: 'Advocate for cooperative-friendly policies at all levels',
  },
  {
    icon: Smartphone,
    title: 'Digital Transformation',
    description: 'Drive digital adoption across all cooperatives',
  },
  {
    icon: Users,
    title: 'Gender & Inclusion',
    description: 'Promote gender equity and inclusive programs',
  },
  {
    icon: Globe,
    title: 'Global Connections',
    description: 'Connect members to international opportunities',
  },
];

const financialServices = [
  'Cooperative savings schemes',
  'Member-friendly loan products',
  'Asset financing (tools, equipment, vehicles)',
  'Working capital support',
  'Emergency and welfare funds',
  'Dividend distribution',
];

const empowermentPrograms = [
  {
    icon: Tractor,
    title: 'Agricultural & Agro-processing',
    description: 'Support for farmers and food processors',
  },
  {
    icon: Wrench,
    title: 'Artisan Tools & Equipment',
    description: 'Financing for artisan tools and workshop equipment',
  },
  {
    icon: Truck,
    title: 'Transport & Logistics',
    description: 'Vehicle financing and logistics support',
  },
  {
    icon: Store,
    title: 'SME Development',
    description: 'Micro-enterprise and SME development programs',
  },
  {
    icon: Lightbulb,
    title: 'Renewable Energy',
    description: 'Innovation and renewable energy projects',
  },
  {
    icon: Home,
    title: 'Housing & Welfare',
    description: 'Housing initiatives and welfare programs',
  },
  {
    icon: GraduationCap,
    title: 'Skills Training',
    description: 'Vocational and skills development training',
  },
];

export default function WhatWeDoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">What We Do</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Comprehensive cooperative services that organize, empower, and protect Nigeria&apos;s economy
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
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Functions</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFunctions.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-emerald-700 text-emerald-100 rounded-full text-sm font-semibold mb-4">
                  Financial Services
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Cooperative Financial Services
                </h2>
                <p className="text-emerald-100 text-lg mb-8">
                  All financial services are cooperative-based and governed by internal bylaws
                  and regulatory frameworks for member protection.
                </p>

                <div className="space-y-4">
                  {financialServices.map((service, index) => (
                    <motion.div
                      key={service}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-white font-medium">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
                  alt="Financial services"
                  className="rounded-3xl shadow-2xl"
                />
              </motion.div>
            </div>
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
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                Empowerment
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Empowerment Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Programs designed to move members from survival to structure, from hustle to wealth
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {empowermentPrograms.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                    <program.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-emerald-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to access these services?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join NOGALSS today and unlock a world of cooperative benefits
            </p>
            <Link
              href="/register/member"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Become a Member
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
