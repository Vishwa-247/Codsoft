"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  showQuantity?: boolean
}

export function AddToCartButton({ product, showQuantity = false }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem(product)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className="w-full" variant={showQuantity ? "default" : "secondary"}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}

