'use client'; // Required for cart functionality

import Link from 'next/link';
import Image from 'next/image';
import HeroCarousel from '@/components/HeroCarousel';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore'; // Import the cart store
import { ArrowRight, Star, Heart, Truck, Wallet, Lock, Headset } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCartStore(); // Use cart hook

  useEffect(() => {
    async function getData() {
      const res = await fetch('https://fakestoreapi.com/products?limit=15');
      if (res.ok) setProducts(await res.json());
    }
    getData();
  }, []);

  if (products.length === 0) return <div className="p-20 text-center">Loading...</div>;

  const heroProducts = products.slice(0, 3);
  const categoryProducts = [products[3], products[7], products[11]];
  const arrivalProducts = products.slice(4, 9);
  const articleProducts = products.slice(12, 15);

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <HeroCarousel slides={heroProducts} />

      {/* 3. CATEGORY GRID */}
      <section className="px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1440px] mx-auto">
        <div className="relative bg-[#F3F5F7] p-12 h-[664px] flex flex-col group overflow-hidden rounded-sm">
          <div className="z-10">
            <h2 className="text-4xl font-medium mb-2 capitalize text-black">{categoryProducts[0]?.category}</h2>
            <Link href="/" className="text-sm font-medium border-b border-black pb-1 hover:opacity-60 transition inline-flex items-center gap-1 text-black">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-grow relative mt-10">
            <Image src={categoryProducts[0]?.image} alt="Category" fill className="object-contain mix-blend-multiply group-hover:scale-105 transition duration-700" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {categoryProducts.slice(1).map((cat, idx) => (
            <div key={idx} className="relative bg-[#F3F5F7] p-12 h-[320px] flex group overflow-hidden rounded-sm">
              <div className="z-10 w-1/2 flex flex-col justify-end">
                <h2 className="text-4xl font-medium mb-2 capitalize text-black">{cat?.category}</h2>
                <Link href="/" className="text-sm font-medium border-b border-black pb-1 w-fit hover:opacity-60 transition inline-flex items-center gap-1 text-black">Shop Now <ArrowRight size={16} /></Link>
              </div>
              <div className="w-1/2 relative">
                <Image src={cat?.image} alt="Category" fill className="object-contain object-right-bottom mix-blend-multiply group-hover:scale-105 transition duration-700" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="px-6 md:px-16 py-16 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <h2 className="text-4xl font-medium tracking-tight text-black">New Arrivals</h2>
          <Link href="/" className="text-sm font-medium border-b border-black pb-1 inline-flex items-center gap-1 hover:opacity-60 transition text-black">More Products <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {arrivalProducts.map((product) => (
            <div key={product.id} className="group flex flex-col h-full">
              <div className="relative aspect-[3/4] bg-[#F3F5F7] mb-4 flex items-center justify-center p-4 overflow-hidden rounded-sm">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 font-sans text-black">
                  <span className="bg-white px-3 py-1 text-[10px] md:text-xs font-bold uppercase shadow-sm text-center">New</span>
                  <span className="bg-[#38CB89] text-white px-3 py-1 text-[10px] md:text-xs font-bold uppercase text-center">-50%</span>
                </div>
                <button className="absolute top-4 right-4 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer"><Heart size={18} /></button>
                {/* Redirect on Image Click */}
                <Link href={`/product/${product.id}`} className="relative w-full h-full block">
                   <Image src={product.image} alt={product.title} fill className="object-contain mix-blend-multiply p-6 group-hover:scale-110 transition duration-500" />
                </Link>
                {/* Add to Cart logic with cursor-pointer fix */}
                <button 
                   onClick={() => addToCart(product, 1)}
                   className="absolute bottom-4 left-4 right-4 bg-black text-white py-2 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 z-10 active:scale-95 cursor-pointer"
                >
                   Add to cart
                </button>
              </div>
              <div className="flex flex-col gap-1.5 px-1 font-sans">
                <div className="flex text-black gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                {/* Redirect on Name Click */}
                <Link href={`/product/${product.id}`} className="hover:text-[#377DFF] transition">
                  <h3 className="font-semibold text-sm line-clamp-1 text-black">{product.title}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-black">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 line-through font-medium">${(product.price * 2).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16"><div className="h-[2px] bg-black w-full mb-16"></div></div>

      {/* 5. VALUES SECTION */}
      <section className="px-6 md:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1440px] mx-auto">
        {[
          { icon: Truck, title: "Free Shipping", desc: "Order above $200" },
          { icon: Wallet, title: "Money-back", desc: "30 days guarantee" },
          { icon: Lock, title: "Secure Payments", desc: "Secured by Stripe" },
          { icon: Headset, title: "24/7 Support", desc: "Phone and Email support" }
        ].map((v, i) => (
          <div key={i} className="bg-[#F3F5F7] p-10 flex flex-col gap-4 rounded-sm text-black">
            <v.icon size={48} strokeWidth={1} />
            <h3 className="text-xl font-medium">{v.title}</h3>
            <p className="text-[#6C7275] text-sm">{v.desc}</p>
          </div>
        ))}
      </section>

      {/* 6. PROMOTION BANNER */}
      <section className="flex flex-col md:flex-row w-full overflow-hidden bg-[#F3F5F7]">
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[530px]">
          <Image src={products[9].image} alt="Sale" fill className="object-contain p-10 mix-blend-multiply" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-24 py-20 text-black">
          <span className="text-[#377DFF] font-bold text-sm uppercase mb-4 font-sans">Limited Offer</span>
          <h2 className="text-4xl md:text-[54px] font-medium leading-[1.1] tracking-tighter mb-6 uppercase">{products[9].category} Special!</h2>
          <p className="text-lg text-[#141718] mb-8 max-w-md">Upgrade your style with our premium selection of top-rated products at unbeatable prices.</p>
          <Link href="/" className="text-sm font-medium border-b border-black pb-1 w-fit flex items-center gap-1 hover:opacity-60 transition text-black">Shop Now <ArrowRight size={16} /></Link>
        </div>
      </section> 

      {/* 7. ARTICLES SECTION */}
      <section className="px-6 md:px-16 py-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10 text-black">
          <h2 className="text-4xl font-medium tracking-tight">Articles</h2>
          <Link href="/home" className="text-sm font-medium border-b border-black pb-1 inline-flex items-center gap-1 hover:opacity-60 transition">More Articles <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articleProducts.map((art) => (
            <div key={art.id} className="group cursor-pointer">
              <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-sm bg-[#F3F5F7]">
                <Image src={art.image} alt="Article" fill className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition duration-700" />
              </div>
              <h3 className="text-xl font-medium mb-3 group-hover:text-[#377DFF] transition line-clamp-2 text-black">Discover {art.title}</h3>
              <Link href="/home" className="text-sm font-medium border-b border-black pb-1 inline-flex items-center gap-1 hover:opacity-60 transition text-black">Read Story <ArrowRight size={16} /></Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}