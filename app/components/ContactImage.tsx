"use client";

import React from 'react';

interface ContactImageProps {
  showContactImage: boolean;
  closeContactImage: () => void;
}

const ContactImage: React.FC<ContactImageProps> = ({ showContactImage, closeContactImage }) => {
  if (!showContactImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button 
          onClick={closeContactImage}
          className="absolute -top-10 -right-10 text-white hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-white p-4 rounded-lg">
          <img
            src="/images/contact_us.jpg" // Ensure this path is correct
            alt="What if I told you... you can contact us"
            width={500}
            height={300}
            className="cursor-pointer"
            onError={(e) => {
              console.error("Error loading image:", e);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactImage;