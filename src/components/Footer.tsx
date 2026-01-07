import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import { Product } from '@/types/product';

// Footer fetches its own data to be reused across all pages
async function getFooterData(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products?limit=2');
  if (!res.ok) return [];
  return res.json();
}

export default async function Footer() {
  const footerProducts = await getFooterData();
  const image1 = footerProducts[0]?.image;
  const image2 = footerProducts[1]?.image;

  return (
    <>
      {/* 8. NEWSLETTER SECTION - Now self-contained with API data */}
      <section className="relative w-full bg-[#F3F5F7] py-32 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="absolute left-[-100px] bottom-0 w-[540px] h-[450px] hidden xl:block">
          {image1 && (
            <Image 
              src={image1} 
              alt="Newsletter Decoration" 
              fill 
              className="object-contain mix-blend-multiply p-10" 
            />
          )}
        </div>
        
        <div className="max-w-xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium mb-4 text-black">Join Our Newsletter</h2>
          <p className="text-[#6C7275] mb-8">Sign up for deals, new products and promotions</p>
          <div className="flex items-center border-b border-gray-400 pb-3 max-w-md mx-auto">
            <Mail className="text-gray-400 mr-3" size={20} />
            <input type="email" placeholder="Email address" className="bg-transparent flex-grow outline-none text-sm text-black" />
            <button className="text-gray-400 font-medium text-sm hover:text-black transition">Signup</button>
          </div>
        </div>

        <div className="absolute right-[-80px] bottom-[-20px] w-[500px] h-[450px] hidden xl:block">
          {image2 && (
            <Image 
              src={image2} 
              alt="Newsletter Decoration" 
              fill 
              className="object-contain mix-blend-multiply p-10" 
            />
          )}
        </div>
      </section>

      {/* MAIN FOOTER */}
      <footer className="bg-[#141718] text-white py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-gray-800 pb-10">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold font-sans hover:opacity-80 transition">
                Ebra Store.
              </Link>
              <span className="w-px h-6 bg-gray-600 hidden md:block"></span>
              <p className="text-gray-400 text-sm">Gift & Decoration Store</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-sm text-gray-300">
              <Link href="/home" className="hover:text-white transition">Home</Link>
              <Link href="/" className="hover:text-white transition">Shop</Link>
              <Link href="/" className="hover:text-white transition">Product</Link>
              <Link href="/home" className="hover:text-white transition">Blog</Link>
              <Link href="/home" className="hover:text-white transition">Contact Us</Link>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-xs text-gray-400">
              <p>Copyright © 2026 Ebra Store. All rights reserved</p>
              <div className="flex gap-6">
                <Link href="#" className="font-semibold text-white hover:underline transition">Privacy Policy</Link>
                <Link href="#" className="font-semibold text-white hover:underline transition">Terms of Use</Link>
              </div>
            </div>
            <div className="flex gap-6">
              <Instagram size={20} className="cursor-pointer hover:text-gray-400 transition" />
              <Facebook size={20} className="cursor-pointer hover:text-gray-400 transition" />
              <Youtube size={20} className="cursor-pointer hover:text-gray-400 transition" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}