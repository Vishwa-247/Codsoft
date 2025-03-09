"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"

const steps = ["Shipping", "Payment", "Confirmation"]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("credit")

  const router = useRouter()
  const { items, cartTotal, clearCart } = useCart()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleCompleteOrder = () => {
    // In a real app, you would process the payment here
    clearCart()
    router.push("/checkout/success")
  }

  const shipping = 5.99
  const total = cartTotal + shipping

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <span className="text-sm mt-1">{step}</span>
            </div>
          ))}
        </div>

        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Payment Information</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>

            {paymentMethod === "credit" && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expDate">Expiration Date</Label>
                    <Input
                      id="expDate"
                      name="expDate"
                      placeholder="MM/YY"
                      value={formData.expDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Shipping Address</h3>
              <p>
                {formData.firstName} {formData.lastName}
                <br />
                {formData.address}
                <br />
                {formData.city}, {formData.state} {formData.zipCode}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Payment Method</h3>
              <p>{paymentMethod === "credit" ? "Credit Card" : "PayPal"}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNextStep}>Continue</Button>
          ) : (
            <Button onClick={handleCompleteOrder}>Complete Order</Button>
          )}
        </div>
      </div>
    </div>
  )
}

