import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-4">
              Kaushal <span className="text-accent">ENTERPRISES</span>
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Transform your business with data-driven digital marketing strategies. We help brands grow their online
              presence and achieve measurable results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-[family-name:var(--font-poppins)] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/80 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold font-[family-name:var(--font-poppins)] mb-4">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-white/80">Digital Marketing</li>
              <li className="text-white/80">Social Media Marketing</li>
              <li className="text-white/80">SEO Optimization</li>
              <li className="text-white/80">Google Ads</li>
              <li className="text-white/80">Branding & Design</li>
              <li className="text-white/80">Lead Generation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-[family-name:var(--font-poppins)] mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-accent mt-1 flex-shrink-0" />
                <span className="text-white/80">03-AL-03A Alambagh Metro Station</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-accent flex-shrink-0" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-accent flex-shrink-0" />
                <span className="text-white/80">hello@KaushalEnterprises.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Kaushal Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
