"use client";

import { useRouter } from 'next/navigation';

export default function SecretRoom() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen bg-white">
      <button 
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        onClick={() => router.back()}
      >
        Back
      </button>
      <div className="absolute bottom-4 right-4 w-2 h-2 bg-black rounded-full" />
    </div>
  );
}