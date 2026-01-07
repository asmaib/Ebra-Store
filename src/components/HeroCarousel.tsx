'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';

export default function HeroCarousel({ slides }: { slides: Product[] }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="px-6 md:px-16 py-4">
      <div className="relative w-full h-[300px] md:h-[500px] bg-[#F3F5F7] overflow-hidden rounded-sm">
        {/* Using API Image */}
        <Image src={slides[current].image} alt="Hero" fill priority className="object-contain p-10 mix-blend-multiply" />
        
        <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-20 text-black">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-20 text-black">
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-black' : 'w-2 bg-gray-400'}`} />
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-8 md:gap-24 max-w-6xl mx-auto mb-10 text-black">
        <h1 className="text-5xl md:text-[72px] font-medium leading-[1.1] tracking-tighter">Simply Unique/<br />Simply Better.</h1>
        <p className="text-[#6C7275] text-lg max-w-sm">
          <span className="font-semibold text-black">Ebra Store</span> is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
        </p>
      </div>
    </section>
  );
}