'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { submitContact } from '@/lib/api';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  subject: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  inquiry_type: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: '4th Floor, Jibril Aminu House, Plot 829, Ralph Shodeinde Street, CBD, Abuja FCT',
      color: 'emerald',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '08067659229, 09078077777',
      color: 'blue',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@nogalssapexcoop.org',
      color: 'amber',
    },
    {
      icon: Globe,
      title: 'Website',
      content: 'www.nogalssapexcoop.org',
      color: 'purple',
    },
  ] as const;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || formData.inquiry_type || 'General Inquiry',
        message: formData.message,
      });

      setIsSubmitted(true);
      setFormData(initialForm);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send message. Please try again.';
      setError(Array.isArray(msg) ? msg.join(', ') : String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Get in touch with NOGALSS National Apex Cooperative Society
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                  Get in Touch
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">We&apos;d Love to Hear From You</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Whether you want to become a member, partner with us, or have questions, our team is ready to help.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          info.color === 'emerald'
                            ? 'bg-emerald-100 text-emerald-600'
                            : info.color === 'blue'
                            ? 'bg-blue-100 text-blue-600'
                            : info.color === 'amber'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900">Office Hours</h4>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {isSubmitted ? (
                  <div className="bg-emerald-50 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">Thank you for contacting us. We&apos;ll get back to you soon.</p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                            className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address *
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="08012345678"
                            className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="inquiry_type" className="text-sm font-medium text-gray-700">
                            Inquiry Type
                          </label>
                          <select
                            id="inquiry_type"
                            value={formData.inquiry_type}
                            onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                            className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                          >
                            <option value="">Select type</option>
                            <option value="membership">Membership Inquiry</option>
                            <option value="partnership">Partnership</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Support</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Message subject"
                          className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="How can we help you?"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>

                      {error ? <p className="text-sm text-red-600">{error}</p> : null}

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-11 font-medium inline-flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
