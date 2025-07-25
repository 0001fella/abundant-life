// src/components/Donate.jsx
import React from "react";
import { motion } from "framer-motion";
import { Cross, HandCoins } from "lucide-react";

const Donate = () => {
  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#0A142F] font-sans">
      {/* Hero Section - Simplified */}
      <section className="relative py-20 px-4 sm:px-6 text-center overflow-hidden bg-gradient-to-r from-[#0A142F] to-[#1E293B]">
        <div className="absolute inset-0 opacity-10">
          <div className="pattern-cross pattern-[#D4AF37] pattern-opacity-20 pattern-size-10"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white font-serif"
          >
            Give to <span className="text-[#D4AF37]">Abundant Life</span>
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-xl text-[#D4AF37] mb-8"
          >
            Support our ministry through M-Pesa
          </motion.p>
        </motion.div>
      </section>

      {/* M-PESA Instructions Section - Centered and Prominent */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="inline-block mb-4 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-4 py-1 text-sm font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              M-PESA DONATIONS
            </motion.div>
            <motion.h2
              className="text-3xl font-bold mb-6 font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              How to <span className="text-[#D4AF37]">Give</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0A142F]/5 to-[#1E293B]/5 p-8 rounded-2xl shadow-lg border border-[#0A142F]/10 max-w-3xl mx-auto"
          >
            <h3 className="font-semibold text-[#0A142F] text-2xl mb-6 flex items-center gap-2 justify-center">
              <HandCoins className="text-[#D4AF37]" />
              M-PESA Payment Instructions
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Paybill Number</p>
                  <p className="font-bold text-2xl text-green-700">247247</p>
                </div>
                <div className="hidden sm:block h-10 border-r border-gray-300 mx-4"></div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-bold text-2xl">ABUNDANT LIFE</p>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-[#0A142F] mb-4 text-center">Steps to Donate:</p>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">1</span>
                    <span className="text-lg">Open the M-PESA app or USSD menu on your phone.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">2</span>
                    <span className="text-lg">Select <strong>"Lipa na M-PESA"</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">3</span>
                    <span className="text-lg">Choose <strong>"Pay Bill"</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">4</span>
                    <span className="text-lg">Enter the Paybill number: <strong className="text-green-700">247247</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">5</span>
                    <span className="text-lg">Enter the Account Name: <strong>ABUNDANT LIFE</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">6</span>
                    <span className="text-lg">Enter the amount you wish to donate.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#D4AF37] text-[#0A142F] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">7</span>
                    <span className="text-lg">Enter your M-PESA PIN and confirm the transaction.</span>
                  </li>
                </ol>
              </div>
              <div className="bg-[#D4AF37]/10 p-4 rounded-lg border border-[#D4AF37]/20">
                <p className="text-center text-[#0A142F] font-medium">
                  Thank you for your generous support! May God bless you abundantly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#0A142F] to-[#1E293B]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-[#D4AF37]/10 p-10 rounded-2xl border border-[#D4AF37]/20 inline-block">
              <Cross className="mx-auto mb-4 text-[#D4AF37]" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white font-serif">
                Thank You for Your Generosity
              </h3>
              <p className="text-lg text-[#D4AF37] max-w-xl mx-auto">
                Your support enables us to continue our mission and impact lives for eternity.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-[#0A142F] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-[#D4AF37]">ALCC</span>
              </div>
              <p className="text-[#D4AF37]/80">Abundant Life Celebration Center</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[#D4AF37]/80 mb-2">Nairobi, Kenya</p>
              <p className="text-[#D4AF37]/80">© {new Date().getFullYear()} ALCC Ministries. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Donate;