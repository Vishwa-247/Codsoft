import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}

