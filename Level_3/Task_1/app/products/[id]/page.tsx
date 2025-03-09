import Image from "next/image"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProduct, getRelatedProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
              {product.oldPrice && (
                <div className="text-lg text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</div>
              )}
            </div>
            <p className="text-muted-foreground">{product.description}</p>
            <div className="space-y-2">
              <div className="font-medium">Category</div>
              <div>{product.category}</div>
            </div>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}

