"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { HomeIcon, KeyIcon, PlayIcon } from '@heroicons/react/24/solid'; // Import PlayIcon for the playground

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="flex items-center mb-2 cursor-pointer" onClick={() => router.push('/')}>
          <HomeIcon className="h-6 w-6 mr-2" />
          Home
        </li>
        <li className="flex items-center mb-2 cursor-pointer" onClick={() => router.push('/dashboards')}>
          <KeyIcon className="h-6 w-6 mr-2" />
          API Keys
        </li>
        <li className="flex items-center mb-2 cursor-pointer" onClick={() => router.push('/playground')}>
          <PlayIcon className="h-6 w-6 mr-2" />
          API Playground
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;