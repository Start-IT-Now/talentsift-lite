import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MdHelpOutline } from 'react-icons/md';
import logo from '../logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-200 backdrop-blur-lg text-black mt-4 pt-2 pb-2">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">
            A trustable AI solution where your data remains safe.
          </p>

          <a
            href="https://www.startitnow.co.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} alt="Start IT Now" className="mx-auto" />
          </a>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-3 text-gray-700">
            <a
              href="https://forms.qntrlusercontent.com/external/publicform/a3d34ee06272ff2f77de1440feeccfecf3fb0cb4855540ae06278496b3e36e13d653f2cd503866811c417fb6bbe559d9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#67E8F9] transition-colors"
            >
              <MdHelpOutline size={18} />
              <span>Help</span>
            </a>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4 text-gray-700 mt-1">
            <MapPin size={18} />
            Kaggadasapura Main Road, C V Raman Nagar, Bengaluru, Karnataka.
          </div>

          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Start IT Now. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
