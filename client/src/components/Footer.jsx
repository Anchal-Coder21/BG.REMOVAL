import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8 px-4">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Logo */}
        <img src={assets.logo} alt="GreatStack Logo" className="h-10" />

        {/* Copyright */}
        <p className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} GreatStack.dev | All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook">
            <img width={24} src={assets.facebook_icon} alt="Facebook" />
          </a>
          <a href="#" aria-label="Twitter">
            <img width={24} src={assets.twitter_icon} alt="Twitter" />
          </a>
          <a href="#" aria-label="Google Plus">
            <img width={24} src={assets.google_plus_icon} alt="Google Plus" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
