import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { getProducts } from "@/lib/products"

export default async function Home() {
  const products = await getProducts({ featured: true, limit: 4 })

  return (
    <main className="flex-1">
      <HeroSection />
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out our latest collection of premium products
            </p>
          </div>
        </div>
        <FeaturedProducts products={products} />
        <div className="flex justify-center mt-10">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            View All Products
          </Link>
        </div>
      </section>
    </main>
  )
}

