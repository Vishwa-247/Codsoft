import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        <div className="bg-muted/40 rounded-lg p-6 text-left">
          <h2 className="font-medium mb-2">Order Details</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A confirmation email has been sent to your email address with all the details of your order.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

