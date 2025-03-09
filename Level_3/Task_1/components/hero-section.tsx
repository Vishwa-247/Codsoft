import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Quality Products for Every Need
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Shop our curated collection of premium products. From fashion to electronics, we have everything you
                need.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link href="/products?category=featured">
                <Button size="lg" variant="outline">
                  View Featured
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=450&width=600"
                alt="Hero Image"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

