'use client'; // Required for functional filtering and cart actions

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore'; // Added Cart Store
import { 
  Filter, Star, ChevronDown, LayoutGrid, Grid, 
  List, Columns4, Heart 
} from 'lucide-react';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activePriceRange, setActivePriceRange] = useState('All Price');
  const [loading, setLoading] = useState(true);
  
  // Use cart store actions
  const { addToCart } = useCartStore();

  // Requirement: Fetch products from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Logic: Functional Price and Category Filtering
  useEffect(() => {
    let result = products;

    if (activeCategory !== 'All Categories') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (activePriceRange !== 'All Price') {
      if (activePriceRange === '$0.00 - 99.99') result = result.filter(p => p.price < 100);
      else if (activePriceRange === '$100.00 - 199.99') result = result.filter(p => p.price >= 100 && p.price < 200);
      else if (activePriceRange === '$200.00 - 299.99') result = result.filter(p => p.price >= 200 && p.price < 300);
      else if (activePriceRange === '$400.00+') result = result.filter(p => p.price >= 400);
    }

    setFilteredProducts(result);
  }, [activeCategory, activePriceRange, products]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) return <div className="p-20 text-center font-medium">Loading Shop...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* 1. HERO SECTION - Multiple spaced images from API */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-[#F3F5F7]">
        <div className="absolute inset-0 flex justify-around items-center px-10 opacity-30 pointer-events-none">
          {products.slice(0, 4).map((p, idx) => (
            <div key={idx} className="relative w-1/5 h-3/4">
              <Image src={p.image} alt="Hero bg" fill className="object-contain mix-blend-multiply" />
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center gap-2 text-sm font-medium mb-4 text-black">
            <Link href="/home" className="text-gray-500 hover:text-black transition">Home</Link>
            <span className="text-gray-400">&gt;</span>
            <span>Shop</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-black mb-4 font-sans">Shop Page</h1>
          <p className="text-lg text-black max-w-lg mx-auto">Explore our premium selection of top-rated products at unbeatable prices.</p>
        </div>
      </section>

      {/* 2. FILTERBAR / TOOLBAR */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-black">
          <Filter size={18} />
          <span>Filter</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-semibold text-black cursor-pointer">
            <span>Sort by</span>
            <ChevronDown size={18} />
          </div>
          <div className="hidden md:flex bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
            <button className="p-2 hover:bg-gray-200 transition border-r border-gray-200 text-black"><LayoutGrid size={20} /></button>
            <button className="p-2 hover:bg-gray-200 transition border-r border-gray-200 text-gray-400"><Grid size={20} /></button>
            <button className="p-2 hover:bg-gray-200 transition border-r border-gray-200 text-gray-400"><Columns4 size={20} /></button>
            <button className="p-2 hover:bg-gray-200 transition text-gray-400"><List size={20} /></button>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block space-y-12">
          <div>
            <h3 className="font-bold mb-6 uppercase text-sm tracking-wider text-black font-sans">Categories</h3>
            <div className="space-y-4 text-sm font-semibold text-gray-500">
              <p onClick={() => setActiveCategory('All Categories')} className={`${activeCategory === 'All Categories' ? 'text-black border-b border-black' : 'hover:text-black'} w-fit cursor-pointer transition`}>All Categories</p>
              {categories.map(cat => (
                <p key={cat} onClick={() => setActiveCategory(cat)} className={`${activeCategory === cat ? 'text-black border-b border-black' : 'hover:text-black'} cursor-pointer capitalize transition w-fit`}>{cat}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-6 uppercase text-sm tracking-wider text-black font-sans">Price</h3>
            <div className="space-y-4">
               {["All Price", "$0.00 - 99.99", "$100.00 - 199.99", "$200.00 - 299.99", "$400.00+"].map((label, i) => (
                 <label key={i} className="flex items-center justify-between text-sm font-semibold text-gray-500 cursor-pointer group">
                   <span>{label}</span>
                   <input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" checked={activePriceRange === label} onChange={() => setActivePriceRange(label)} />
                 </label>
               ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-24">
          {(activeCategory === 'All Categories' ? categories : [activeCategory]).map((category) => {
            const catProducts = filteredProducts.filter(p => p.category === category);
            if (catProducts.length === 0) return null;

            return (
              <div key={category} className="space-y-10">
                <h2 className="text-3xl font-semibold capitalize border-b border-gray-100 pb-6 text-black tracking-tight font-sans">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {catProducts.map((product) => (
                    <div key={product.id} className="group flex flex-col">
                      <div className="relative aspect-[3/4] bg-[#F3F5F7] mb-6 flex items-center justify-center p-8 overflow-hidden rounded-sm">
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 font-sans">
                          <span className="bg-white px-3 py-1 text-[10px] font-bold uppercase shadow-sm text-center text-black">New</span>
                          <span className="bg-[#38CB89] text-white px-3 py-1 text-[10px] font-bold uppercase text-center">-50%</span>
                        </div>
                        <button className="absolute top-4 right-4 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10 cursor-pointer"><Heart size={18} /></button>
                        
                        {/* FIX: Link image to product details */}
                        <Link href={`/product/${product.id}`} className="relative w-full h-full block cursor-pointer">
                          <Image src={product.image} alt={product.title} fill className="object-contain mix-blend-multiply p-12 transition-transform duration-700 group-hover:scale-110" />
                        </Link>

                        {/* FIX: Functional Add to Cart with cursor change */}
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="absolute bottom-6 left-6 right-6 bg-black text-white text-center py-3 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 z-10 shadow-xl font-sans active:scale-95 cursor-pointer"
                        >
                          Add to cart
                        </button>
                      </div>

                      {/* FIX: Link name to product details */}
                      <Link href={`/product/${product.id}`} className="flex flex-col gap-2 px-1 font-sans cursor-pointer">
                        <div className="flex text-black gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <h3 className="font-semibold text-base line-clamp-1 group-hover:text-[#377DFF] transition text-black">{product.title}</h3>
                        <div className="flex items-center gap-3">
                           <p className="font-bold text-lg text-black">${product.price.toFixed(2)}</p>
                           <p className="text-sm text-gray-400 line-through font-medium">${(product.price * 2).toFixed(2)}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}