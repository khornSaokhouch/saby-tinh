'use client';

import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Clock, Send, 
  MessageSquare, User, ArrowRight, Loader2, Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- METADATA (Next.js App Router) ---
// Note: In 'use client' files, metadata should usually be in layout or a separate server wrapper, 
// but for a single file copy-paste, this is fine if you extract it later.
// export const metadata = {
//   title: "Contact Us | Saby-Tinh",
//   description: "Get in touch with our team.",
// };

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen font-sans">
      
      <div className="max-w-6xl mx-auto p-4 space-y-10">
        
        {/* --- 1. HEADER SECTION --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <MessageSquare size={12} /> Support & Sales
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Get in touch with us.
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Have a question or need a custom quote? We are here to help you scale your hardware infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- 2. LEFT COLUMN: CONTACT INFO (Bento Grid) --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Office Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-6 text-indigo-600">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Headquarters</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  Royal University of Phnom Penh,<br />
                  Russian Blvd, Toul Kork,<br />
                  Phnom Penh, Cambodia
                </p>
                <a href="https://maps.google.com" target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">
                  Get Directions <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Communication Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactCard 
                icon={Mail} 
                label="Email Us" 
                value="support@saby.com" 
                href="mailto:support@saby.com" 
                delay={0.1}
              />
              <ContactCard 
                icon={Phone} 
                label="Call Us" 
                value="+855 23 123 456" 
                href="tel:+85523123456" 
                delay={0.2}
              />
            </div>

            {/* Hours Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Clock size={80} />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Business Hours</h3>
                <p className="text-slate-400 text-sm font-medium mb-4">Response time: &lt; 2 hours</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium border-b border-white/10 pb-2">
                    <span className="text-slate-300">Mon - Fri</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-1">
                    <span className="text-slate-300">Weekend</span>
                    <span className="text-indigo-300">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* --- 3. RIGHT COLUMN: CONTACT FORM --- */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-200 shadow-lg h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
                <p className="text-slate-500 text-sm mt-1">Fill out the form below and we will get back to you.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Full Name" placeholder="John Doe" icon={User} required />
                  <InputField label="Email Address" placeholder="john@company.com" type="email" icon={Mail} required />
                </div>
                
                <InputField label="Subject" placeholder="Partnership Inquiry" icon={MessageSquare} />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
                    placeholder="How can we help you today?"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>

        {/* --- 4. MAP SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full h-96 rounded-[40px] overflow-hidden border border-slate-200 shadow-md relative group"
        >
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white text-xs font-bold text-slate-700 flex items-center gap-2">
            <Globe size={14} className="text-indigo-600" /> 
            Locate Us
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7750837894935!2d104.88724121478148!3d11.564756591784672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310931e2474149e9%3A0xc6a81b228f411894!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1638848010834!5m2!1sen!2skh"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="grayscale group-hover:grayscale-0 transition-all duration-700"
            title="Office Location Map"
          ></iframe>
        </motion.div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ContactCard({ icon: Icon, label, value, href, delay }) {
  return (
    <motion.a 
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col p-6 bg-white border border-slate-200 rounded-[32px] hover:border-indigo-300 hover:shadow-lg transition-all group"
    >
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</span>
    </motion.a>
  );
}

function InputField({ label, placeholder, type = "text", icon: Icon, required }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
          />
        )}
        <input 
          type={type} 
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 ${Icon ? 'pl-11 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
}