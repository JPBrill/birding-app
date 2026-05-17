'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-aira-300 hover:text-white text-sm font-medium transition-colors group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      Back
    </button>
  );
}
