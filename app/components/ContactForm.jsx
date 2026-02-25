"use client";

import { useState } from "react";
import { FaPaperPlane } from 'react-icons/fa'; 

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call delay
    setTimeout(() => {
        console.log("Form submitted:", formData);
        setStatus("✅ Thank you! Your message has been sent successfully. We'll be in touch soon.");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
    }, 1500);
  };

  const InputField = ({ id, name, type, placeholder, value, onChange, isTextArea = false, required = true }) => {
    const inputClasses = "w-full pt-6 pb-2 px-4 text-gray-900 border border-gray-300 rounded-lg peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300";

    return (
      <div className="relative">
        {isTextArea ? (
          <textarea
            id={id}
            name={name}
            rows="5"
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className={`${inputClasses} resize-none`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className={inputClasses}
          />
        )}
        {/* Floating Label */}
        <label 
          htmlFor={id} 
          className="absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600"
        >
          {placeholder}
        </label>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl h-full"> 
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Send us a Message</h2>
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <InputField
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
            />

            <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email Address (e.g. you@example.com)"
                value={formData.email}
                onChange={handleChange}
            />

            <InputField
                id="message"
                name="message"
                type="text"
                placeholder="Your Message (Minimum 10 characters)"
                value={formData.message}
                onChange={handleChange}
                isTextArea={true}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 font-bold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.01] ${
                    isSubmitting
                        ? "bg-indigo-400 cursor-wait opacity-80" // Changed to cursor-wait for better UX
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending Message...</span>
                    </>
                ) : (
                    <>
                        <FaPaperPlane size={18} />
                        <span>Send Message</span>
                    </>
                )}
            </button>

            {status && (
                <div className={`mt-4 text-center p-3 rounded-lg font-medium text-sm border-2 ${status.startsWith('✅') ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                    {status}
                </div>
            )}
        </form>
    </div>
  );
}