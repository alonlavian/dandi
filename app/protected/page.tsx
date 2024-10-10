"use client";

import React from 'react';
import { ToastContainer } from 'react-toastify';

const Protected = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <h2 className="text-2xl font-bold mb-4">Access Granted</h2>
      <p>Your API key has been validated successfully!</p>
    </div>
  );
};

export default Protected;