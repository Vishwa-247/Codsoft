import Link from "next/link"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View Product</span>
      </Link>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            {product.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="font-medium">${product.price.toFixed(2)}</div>
          {product.oldPrice && (
            <div className="text-sm text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</div>
          )}
        </div>
        <div className="mt-4 z-20 relative">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}

