'use client'; // Required for countdown, quantity message, and active states

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore'; // Added Cart Store
import { Star, Heart, Minus, Plus, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';

export default function ProductDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showMinMsg, setShowMinMsg] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); 
  const [timeLeft, setTimeLeft] = useState({ mins: 44, secs: 25 });
  
  // Requirement #3: Managing global cart state
  const { addToCart } = useCartStore();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
      if (res.ok) setProduct(await res.json());
      setLoading(false);
    }
    fetchData();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { mins: prev.mins - 1, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [params.id]);

  if (loading) return <div className="p-20 text-center font-sans text-lg">Loading Product...</div>;
  if (!product) notFound();

  // FIX: Accurate clothing check to hide sizes on backpacks/electronics
  const isClothing = product.category.toLowerCase().includes('clothing') && !product.title.toLowerCase().includes('backpack');

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* 1. BREADCRUMBS */}
      <nav className="max-w-[1120px] mx-auto px-6 py-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <Link href="/home" className="hover:text-black transition">Home</Link>
        <ChevronRight size={14} />
        <Link href="/" className="hover:text-black capitalize transition">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-black truncate">{product.title}</span>
      </nav>

      {/* 2. PRODUCT SUMMARY */}
      <main className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 pb-20">
        <div className="relative group">
          <div className="relative aspect-[4/5] bg-[#F3F5F7] rounded-sm overflow-hidden flex items-center justify-center p-12">
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 font-sans">
              <span className="bg-white px-3 py-1 text-xs font-bold uppercase shadow-sm text-black">New</span>
              <span className="bg-[#38CB89] text-white px-3 py-1 text-xs font-bold uppercase">-50%</span>
            </div>
            
            {/* Design arrows always visible */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:bg-gray-50 border border-gray-100 transition">
              <ChevronLeft size={20} className="text-black" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:bg-gray-50 border border-gray-100 transition">
              <ChevronRight size={20} className="text-black" />
            </button>

            <Image src={product.image} alt={product.title} fill className="object-contain mix-blend-multiply p-10" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="relative aspect-square bg-[#F3F5F7] rounded-sm flex items-center justify-center p-4 overflow-hidden group/thumb">
                 <Image src={product.image} alt="Angle" fill className="object-contain mix-blend-multiply opacity-60 group-hover/thumb:opacity-100 transition duration-300" />
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
             <div className="flex text-black">
               {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 5 ? "currentColor" : "none"} />)}
             </div>
             <span className="text-xs font-medium text-gray-500 font-sans tracking-wide">{product.rating.count} Reviews</span>
          </div>

          <h1 className="text-4xl font-medium tracking-tight text-black leading-tight font-sans">{product.title}</h1>
          <p className="text-[#6C7275] text-sm leading-relaxed">{product.description}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold font-sans">${product.price.toFixed(2)}</span>
            <span className="text-lg text-gray-400 line-through font-medium font-sans">${(product.price * 2).toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-100 pt-6">
             <p className="text-xs font-semibold mb-3 text-gray-600 uppercase tracking-widest">Offer expires in:</p>
             <div className="flex gap-4">
                {['02', '12', timeLeft.mins.toString().padStart(2, '0'), timeLeft.secs.toString().padStart(2, '0')].map((num, i) => (
                  <div key={i} className="text-center font-sans">
                    <div className="bg-[#F3F5F7] w-12 h-12 flex items-center justify-center text-xl font-bold rounded-sm mb-1">{num}</div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold">{['Days', 'Hours', 'Mins', 'Secs'][i]}</span>
                  </div>
                ))}
             </div>
          </div>

          {isClothing && (
            <div className="space-y-3 pt-4">
              <p className="text-sm font-semibold text-[#6C7275] uppercase tracking-widest">Available Sizes</p>
              <div className="flex gap-3">
                {['S', 'M', 'L'].map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-sm font-semibold transition font-sans ${selectedSize === size ? 'bg-black text-white border-black' : 'border-black hover:bg-black hover:text-white'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-4">
             <div className="flex items-center gap-4 relative">
                {showMinMsg && <div className="absolute -top-10 left-0 bg-black text-white text-[10px] px-3 py-1.5 rounded-sm animate-bounce shadow-lg z-20 font-sans">Minimum 1 item required</div>}
                <div className="flex items-center bg-[#F3F5F7] rounded-sm px-4 py-3 gap-6 font-sans">
                   <button onClick={() => quantity > 1 ? setQuantity(q => q-1) : setShowMinMsg(true)} className="text-gray-500 hover:text-black transition active:scale-95"><Minus size={18} /></button>
                   <span className="font-bold w-4 text-center">{quantity}</span>
                   <button onClick={() => {setQuantity(q => q+1); setShowMinMsg(false)}} className="text-gray-500 hover:text-black transition active:scale-95"><Plus size={18} /></button>
                </div>
                <button className="flex-grow border border-black rounded-sm py-3 font-semibold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition text-sm font-sans active:scale-95 tracking-wide"><Heart size={20} /> Wishlist</button>
             </div>
             
             {/* Requirement #2: Updated Add to Cart Action with cursor-pointer */}
             <button 
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-black text-white rounded-sm py-4 font-bold hover:opacity-90 transition shadow-lg text-sm uppercase tracking-[0.1em] font-sans active:scale-[0.98] cursor-pointer"
             >
                Add to Cart
             </button>
          </div>

          <div className="pt-6 text-[10px] font-bold text-gray-400 flex gap-8 uppercase tracking-widest font-sans">
             <p>SKU: 200{product.id}</p>
             <p>CATEGORY: {product.category}</p>
          </div>
        </div>
      </main>

      {/* 3. CENTERED TABS */}
      <section className="max-w-[1120px] mx-auto border-t border-gray-100">
         <div className="flex justify-center gap-16 border-b border-gray-100">
            <p className="py-6 text-sm font-semibold uppercase tracking-[0.05em] text-gray-400 cursor-default font-sans">Additional Info</p>
            <p className="py-6 text-sm font-semibold uppercase tracking-[0.05em] text-gray-400 cursor-default font-sans">Questions</p>
            <p className="py-6 text-sm font-semibold uppercase tracking-[0.05em] border-b-2 border-black text-black font-sans">Reviews ({product.rating.count})</p>
         </div>
      </section>

      {/* 4. CENTERED REVIEWS SECTION */}
      <section className="max-w-[1120px] mx-auto px-6 py-12 flex flex-col items-center">
         <div className="w-full max-w-3xl flex flex-col items-center">
           <h2 className="text-2xl font-medium mb-10 text-black self-start font-sans">Customer Reviews</h2>
           
           <div className="w-full mb-16 border border-gray-200 rounded-md p-4 flex flex-col gap-4 bg-white shadow-sm">
             <textarea placeholder="Share your thoughts about this product..." className="w-full text-sm outline-none resize-none h-24 bg-transparent font-sans placeholder:text-gray-400" />
             <div className="flex justify-between items-center border-t border-gray-100 pt-4 font-sans">
                <div className="flex text-gray-300 transition-colors"><Star size={20} className="hover:text-black cursor-pointer" /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /></div>
                <button className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold shadow-md hover:opacity-80 transition active:scale-95 tracking-wide cursor-pointer">Write Review</button>
             </div>
           </div>

           <div className="w-full flex justify-between items-center mb-10 font-sans border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-black">{product.rating.count} Reviews</h3>
              <button className="flex items-center gap-2 font-bold text-sm border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition active:scale-95 cursor-pointer">
                 Newest <ChevronDown size={16} />
              </button>
           </div>

           <div className="w-full space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-6 border-b border-gray-50 pb-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-100">
                    <Image src={`https://i.pravatar.cc/150?u=${params.id}${i}`} alt="User" fill />
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-black font-sans text-base">{i === 1 ? 'Sofia Harvartz' : 'Nicolas Jensen'}</h4>
                     <div className="flex text-black mb-2">
                       {[...Array(5)].map((_, starIdx) => <Star key={starIdx} size={14} fill="currentColor" />)}
                     </div>
                     <p className="text-[#6C7275] text-sm leading-relaxed font-sans">
                       This is an incredible product from the {product.category} collection. The quality exceeds my expectations for the price of ${product.price}.
                     </p>
                  </div>
                </div>
              ))}
           </div>

           <div className="flex justify-center pt-12">
              <button className="px-10 py-3 border border-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition shadow-sm active:scale-95 font-sans tracking-wide cursor-pointer">Load more</button>
           </div>
         </div>
      </section>
    </div>
  );
}