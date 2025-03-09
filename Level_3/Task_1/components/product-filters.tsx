"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCallback } from "react"

interface ProductFiltersProps {
  categories: string[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams],
  )

  const selectedCategory = searchParams.get("category") || ""
  const selectedSort = searchParams.get("sort") || ""
  const selectedPrice = searchParams.get("price") || ""

  const handleCategoryChange = (category: string) => {
    router.push(`/products?${createQueryString("category", category)}`)
  }

  const handleSortChange = (sort: string) => {
    router.push(`/products?${createQueryString("sort", sort)}`)
  }

  const handlePriceChange = (price: string) => {
    router.push(`/products?${createQueryString("price", price)}`)
  }

  const handleClearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Filters</h3>
        <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground" onClick={handleClearFilters}>
          Clear filters
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategory === category}
                    onCheckedChange={() => handleCategoryChange(selectedCategory === category ? "" : category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedPrice} onValueChange={handlePriceChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under50" id="under50" />
                <Label htmlFor="under50" className="text-sm font-normal cursor-pointer">
                  Under $50
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50to100" id="50to100" />
                <Label htmlFor="50to100" className="text-sm font-normal cursor-pointer">
                  $50 to $100
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100to200" id="100to200" />
                <Label htmlFor="100to200" className="text-sm font-normal cursor-pointer">
                  $100 to $200
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="over200" id="over200" />
                <Label htmlFor="over200" className="text-sm font-normal cursor-pointer">
                  Over $200
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger>Sort</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedSort} onValueChange={handleSortChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured" id="featured" />
                <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                  Featured
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="text-sm font-normal cursor-pointer">
                  Newest
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="price-asc" />
                <Label htmlFor="price-asc" className="text-sm font-normal cursor-pointer">
                  Price: Low to High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="price-desc" />
                <Label htmlFor="price-desc" className="text-sm font-normal cursor-pointer">
                  Price: High to Low
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

