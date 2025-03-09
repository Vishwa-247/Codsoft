import type { Product } from "./types"

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with long battery life and exceptional sound quality.",
    price: 199.99,
    oldPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    featured: true,
    badge: "Sale",
    rating: 4.8,
    stock: 15,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and more with this stylish and functional smart watch.",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    featured: true,
    rating: 4.5,
    stock: 20,
  },
  {
    id: "3",
    name: "Leather Backpack",
    description: "Stylish and durable leather backpack with multiple compartments for all your essentials.",
    price: 89.99,
    oldPrice: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    badge: "Sale",
    rating: 4.7,
    stock: 8,
  },
  {
    id: "4",
    name: "Cotton T-Shirt",
    description: "Soft and comfortable cotton t-shirt available in multiple colors.",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    featured: true,
    rating: 4.3,
    stock: 50,
  },
  {
    id: "5",
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with crystal clear sound and comfortable fit.",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.6,
    stock: 25,
  },
  {
    id: "6",
    name: "Denim Jacket",
    description: "Classic denim jacket that never goes out of style.",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    rating: 4.4,
    stock: 12,
  },
  {
    id: "7",
    name: "Running Shoes",
    description: "Lightweight and supportive running shoes for maximum performance.",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Footwear",
    featured: true,
    rating: 4.9,
    stock: 18,
  },
  {
    id: "8",
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks hot or cold for hours with this insulated water bottle.",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    rating: 4.7,
    stock: 30,
  },
  {
    id: "9",
    name: "Wireless Keyboard",
    description: "Ergonomic wireless keyboard with customizable keys and long battery life.",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.5,
    stock: 22,
  },
  {
    id: "10",
    name: "Sunglasses",
    description: "Stylish sunglasses with UV protection.",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    rating: 4.2,
    stock: 15,
  },
  {
    id: "11",
    name: "Yoga Mat",
    description: "Non-slip yoga mat for comfortable workouts.",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fitness",
    rating: 4.6,
    stock: 25,
  },
  {
    id: "12",
    name: "Coffee Maker",
    description: "Programmable coffee maker for the perfect brew every morning.",
    price: 89.99,
    oldPrice: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home",
    badge: "Sale",
    rating: 4.8,
    stock: 10,
  },
]

interface GetProductsOptions {
  category?: string
  featured?: boolean
  sort?: string
  price?: string
  limit?: number
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = [...products]

  // Filter by category
  if (options.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === options.category)
  }

  // Filter by featured
  if (options.featured) {
    filteredProducts = filteredProducts.filter((product) => product.featured)
  }

  // Filter by price range
  if (options.price) {
    switch (options.price) {
      case "under50":
        filteredProducts = filteredProducts.filter((product) => product.price < 50)
        break
      case "50to100":
        filteredProducts = filteredProducts.filter((product) => product.price >= 50 && product.price <= 100)
        break
      case "100to200":
        filteredProducts = filteredProducts.filter((product) => product.price > 100 && product.price <= 200)
        break
      case "over200":
        filteredProducts = filteredProducts.filter((product) => product.price > 200)
        break
    }
  }

  // Sort products
  if (options.sort) {
    switch (options.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filteredProducts.sort((a, b) => (b.id as any) - (a.id as any))
        break
      case "featured":
        filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }
  }

  // Limit number of products
  if (options.limit) {
    filteredProducts = filteredProducts.slice(0, options.limit)
  }

  return filteredProducts
}

export async function getProduct(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = products.find((p) => p.id === id)
  return product || null
}

export async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return products.filter((p) => p.category === category && p.id !== currentId).slice(0, 4)
}

export async function getCategories(): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const categories = [...new Set(products.map((p) => p.category))]
  return categories
}

