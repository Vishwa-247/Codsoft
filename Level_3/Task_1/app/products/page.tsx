import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { getProducts, getCategories } from "@/lib/products"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    sort?: string
    price?: string
  }
}) {
  const products = await getProducts({
    category: searchParams.category,
    sort: searchParams.sort,
    price: searchParams.price,
  })

  const categories = await getCategories()

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10">
        <ProductFilters categories={categories} />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground mt-2">Browse our collection of premium products</p>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

