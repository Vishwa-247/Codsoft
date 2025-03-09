"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, cartTotal } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const subtotal = cartTotal
  const shipping = 5.99
  const total = subtotal + shipping

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b">
                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto text-muted-foreground"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/40 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <Button variant="outline">Apply</Button>
              </div>
              <Link href="/checkout">
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

