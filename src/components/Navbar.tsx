'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore'; // Import cart store
import { Search, UserCircle, ShoppingBag, Ticket } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCartStore(); // Access cart items
  
  // Calculate total quantity of all items in cart
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getLinkClass = (path: string) => 
    pathname === path 
      ? "text-black transition font-semibold" 
      : "text-[#6C7275] hover:text-black transition";

  const extraTabClass = "text-[#6C7275] hover:text-black transition";

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="w-full bg-[#F3F5F7] py-2 flex items-center justify-center gap-2 text-sm font-semibold text-black">
        <Ticket size={18} />
        <p>30% off storewide — Limited time!</p>
        <Link href="/" className="text-[#377DFF] border-b border-[#377DFF] flex items-center gap-1 hover:opacity-70 transition">
          Shop Now <span className="text-lg">→</span>
        </Link>
      </div>

      <nav className="max-w-[1440px] mx-auto px-10 md:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-black">
          Ebra Store.
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/home" className={getLinkClass('/home')}>Home</Link>
          <Link href="/" className={getLinkClass('/')}>Shop</Link>
          <Link href="/" className={extraTabClass}>Product</Link>
          <Link href="/home" className={extraTabClass}>Contact Us</Link>
        </div>

        <div className="flex items-center gap-4 text-black">
          <button className="p-1 hover:bg-gray-100 rounded-full transition" aria-label="Search">
            <Search size={24} strokeWidth={1.5} />
          </button>
          
          <button className="p-1 hover:bg-gray-100 rounded-full transition" aria-label="Account">
            <UserCircle size={24} strokeWidth={1.5} />
          </button>

          <Link href="/cart" className="relative p-1 hover:bg-gray-100 rounded-full transition">
            <ShoppingBag size={24} strokeWidth={1.5} />
            {/* Dynamic Counter based on store state */}
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans">
              {totalItems}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}