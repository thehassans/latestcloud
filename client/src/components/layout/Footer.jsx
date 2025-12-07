import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Facebook, Twitter, Linkedin, Instagram, Youtube,
  Mail, Phone, MapPin, Heart, ArrowRight, Send
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const footerLinks = {
  services: [
    { label: 'Web Hosting', to: '/hosting' },
    { label: 'VPS Servers', to: '/vps' },
    { label: 'Cloud Servers', to: '/cloud' },
    { label: 'Dedicated Servers', to: '/dedicated' },
    { label: 'Domain Registration', to: '/domains' },
    { label: 'SSL Certificates', to: '/ssl' },
  ],
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Datacenters', to: '/datacenters' },
    { label: 'Careers', to: '/careers' },
    { label: 'Blog', to: '/blog' },
    { label: 'Partners', to: '/partners' },
  ],
  support: [
    { label: 'Help Center', to: '/support' },
    { label: 'Knowledge Base', to: '/kb' },
    { label: 'Submit Ticket', to: '/dashboard/tickets/new' },
    { label: 'System Status', to: '/status' },
    { label: 'Report Abuse', to: '/abuse' },
  ],
  legal: [
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Refund Policy', to: '/refund' },
    { label: 'SLA', to: '/sla' },
    { label: 'Acceptable Use', to: '/acceptable-use' },
  ]
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/magneticclouds', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/magneticclouds', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/magneticclouds', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/magneticclouds', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/magneticclouds', label: 'YouTube' },
]

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-dark-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold font-display">
                Subscribe to Our Newsletter
              </h3>
              <p className="mt-2 text-dark-400">
                Get the latest updates, offers, and news delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-xl">
                MC
              </div>
              <div>
                <span className="font-display font-bold text-2xl">Magnetic</span>
                <span className="font-display font-bold text-2xl text-primary-400 ml-1">Clouds</span>
              </div>
            </Link>
            <p className="mt-4 text-dark-400 max-w-sm">
              Premium web hosting and cloud solutions from Bangladesh. 
              Empowering businesses worldwide with reliable infrastructure.
            </p>
            
            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-3 text-dark-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+880 1XXX-XXXXXX</span>
              </a>
              <a href="mailto:support@magneticclouds.com" className="flex items-center gap-3 text-dark-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>support@magneticclouds.com</span>
              </a>
              <div className="flex items-start gap-3 text-dark-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800 hover:bg-primary-500 text-dark-400 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-dark-700">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-dark-400">
              <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                <span className="text-green-500 font-bold text-sm">SSL</span>
              </div>
              <span className="text-sm">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400">
              <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                <span className="text-primary-400 font-bold text-sm">99.9%</span>
              </div>
              <span className="text-sm">Uptime Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400">
              <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                <span className="text-yellow-500 font-bold text-sm">24/7</span>
              </div>
              <span className="text-sm">Expert Support</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400">
              <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">45</span>
              </div>
              <span className="text-sm">Day Money Back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-dark-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Magnetic Clouds. All rights reserved.
            </p>
            <p className="text-dark-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
