'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState<'free' | 'express' | 'pickup'>('free');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 15.0 : shippingMethod === 'pickup' ? 21.0 : 0.0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      <div className="max-w-[1120px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-medium text-center mb-10">Cart</h1>

        {/* 1. PROGRESS STEPS */}
        <div className="flex justify-center items-center gap-8 mb-16">
          <div className="flex items-center gap-3 border-b-2 border-black pb-2">
            <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            <span className="font-semibold text-sm">Shopping cart</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 pb-2">
            <span className="bg-gray-200 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            <span className="font-semibold text-sm">Checkout details</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 pb-2">
            <span className="bg-gray-200 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            <span className="font-semibold text-sm">Order complete</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-md">Return to Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* 2. PRODUCT LIST */}
            <div className="lg:col-span-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">
                    <th className="pb-6 w-1/2">Product</th>
                    <th className="pb-6">Quantity</th>
                    <th className="pb-6">Price</th>
                    <th className="pb-6 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-8">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-24 bg-[#F3F5F7] rounded-sm flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-contain p-2 mix-blend-multiply" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 uppercase">Color: Default</p>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1 text-xs font-bold text-gray-400 mt-2 hover:text-black transition"
                            >
                              <X size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center border border-gray-300 rounded-sm w-fit px-3 py-1.5 gap-4">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </td>
                      <td className="py-8 text-sm font-medium">${item.price.toFixed(2)}</td>
                      <td className="py-8 text-right text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 3. COUPON SECTION */}
              <div className="mt-12">
                <h4 className="font-semibold text-sm mb-4">Have a coupon?</h4>
                <p className="text-xs text-gray-400 mb-4">Add your code for an instant cart discount</p>
                <div className="flex gap-4 max-w-sm">
                  <input type="text" placeholder="Coupon Code" className="flex-grow border border-gray-300 rounded-sm px-4 py-2 text-sm outline-none" />
                  <button className="text-sm font-bold border-b border-black pb-1">Apply</button>
                </div>
              </div>
            </div>

            {/* 4. CART SUMMARY */}
            <div className="border border-black rounded-lg p-8 h-fit bg-white shadow-sm">
              <h3 className="text-xl font-medium mb-6">Cart summary</h3>
              
              <div className="space-y-4 mb-8">
                <label className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition ${shippingMethod === 'free' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" checked={shippingMethod === 'free'} onChange={() => setShippingMethod('free')} className="accent-black" />
                    <span className="text-sm font-medium">Free shipping</span>
                  </div>
                  <span className="text-sm">$0.00</span>
                </label>
                <label className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition ${shippingMethod === 'express' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="accent-black" />
                    <span className="text-sm font-medium">Express shipping</span>
                  </div>
                  <span className="text-sm">+$15.00</span>
                </label>
                <label className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition ${shippingMethod === 'pickup' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} className="accent-black" />
                    <span className="text-sm font-medium">Pick Up</span>
                  </div>
                  <span className="text-sm">%21.00</span>
                </label>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-md mt-8 font-bold text-sm hover:opacity-90 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}