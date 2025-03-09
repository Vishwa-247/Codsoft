export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  image: string
  category: string
  featured?: boolean
  badge?: string
  rating?: number
  stock?: number
}

