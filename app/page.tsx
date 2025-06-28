"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  ImageUp,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Car,
  Recycle,
  ShoppingCart,
  Minus,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface UserMeasurements {
  bodyShape: string
  chest: number
  waist: number
  hip: number
  gender: string
  height: number
  weight: number
  measurementUnit: string
  heightUnit: string
  weightUnit: string
  chestUnknown: boolean
  waistUnknown: boolean
  hipUnknown: boolean
  heightUnknown: boolean
  weightUnknown: boolean
}

interface SizePrediction {
  topSize: string
  bottomSize: string
}

interface CartItem {
  id: string
  name: string
  price: string
  image: string
  category: string
}

const bodyShapes = [
  {
    id: "pear",
    name: "Pear",
    description: "Hips wider than shoulders",
    svg: (
      
     <svg viewBox="0 0 100 120" className="w-16 h-20">
      <image
        href="https://cdn.prod.website-files.com/5eca30fd2b50b671e2107b06/60efde82ce0dc256c05142f2_Pear%20Body%20Shape%20Title%20Image.webp"
        x="0"
        y="0"
        width="100"
        height="120"
      />
      </svg>
    ),
    },
    {
    id: "apple",
    name: "Apple",
    description: "Broader shoulders and chest",
    svg: (
      <svg viewBox="0 0 100 120" className="w-16 h-20">
      <image
        href="https://cdn.prod.website-files.com/5eca30fd2b50b671e2107b06/60f12ec55285e1aca7b6a437_Apple%20Body%20Shape%20Title%20Image.png"
        x="0"
        y="0"
        width="100"
        height="120"
      />
      </svg>
    ),
    },
    {
    id: "rectangle",
    name: "Rectangle",
    description: "Similar measurements all around",
    svg: (
      <svg viewBox="0 0 100 120" className="w-16 h-20">
      <image
        href="https://cdn.prod.website-files.com/5eca30fd2b50b671e2107b06/60ee8f387785b9eb58eb0ea8_Rectangle%20Body%20Shape%20Title%20Image.webp"
        x="0"
        y="0"
        width="100"
        height="120"
      />
      </svg>
    ),
  },
  {
    id: "hourglass",
    name: "Hourglass",
    description: "Defined waist, balanced proportions",
    svg: (
      <svg viewBox="0 0 100 120" className="w-16 h-20">
      <image
        href="https://cdn.prod.website-files.com/5eca30fd2b50b671e2107b06/60c8c042466bd21ec77b26ab_Hourglass%20Body%20Shape%20Category%20Image.webp"
        x="0"
        y="0"
        width="100"
        height="120"
      />
      </svg>
    ),
  },
  {
    id: "inverted-triangle",
    name: "Inverted Triangle",
    description: "Broad shoulders, narrow hips",
    svg: (
      <svg viewBox="0 0 100 120" className="w-16 h-20">
      <image
        href="https://cdn.prod.website-files.com/5eca30fd2b50b671e2107b06/60efe4a9ce19af708fe6e3dc_Inverted%20Triangle%20Body%20Shape%20Title%20Image.png"
        x="0"
        y="0"
        width="100"
        height="120"
      />
      </svg>
    ),
  },
]

const allProducts = [
  // Female Products
  {
    id: "F101",
    name: "Gufrina Women’s Full Sleeve T-Shirt",
    price: "₹999",
    image: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F98e708dc-d0dd-11ea-b767-8e50a48e64c9.jpg?crop=1600%2C900%2C0%2C0&resize=360",
    category: "female",
  },
  {
    id: "F102",
    name: "Nifty Women's Cotton Mid Rise Jeans",
    price: "₹749",
    image: "https://thumbs.dreamstime.com/b/photo-jeans-girl-side-view-white-background-blonde-horizontal-empty-space-text-247045104.jpg",
    category: "female",
  },
  {
    id: "F103",
    name: "Alvami Women Anarkali Kurti Set",
    price: "₹1499",
    image: "https://www.ifashion.co.uk/wp-content/uploads/2023/04/file-4137-ea22a20615433c9efcbb17eace73a70c.jpg",
    category: "female",
  },

  // Male Products
  {
    id: "M201",
    name: "The Barber Shop Cotton T-Shirt",
    price: "₹499",
    image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,q_auto:best,t_productPageHeroGalleryTransformation_v2,w_auto/India%20LOB/Clothing%20and%20Bags/Men's%20Basic%20Cotton%20T-Shirts/IN_Mens-T-Shirts_02",
    category: "male",
  },
  {
    id: "M202",
    name: "Jockey 9500 Men's Super Trackpants",
    price: "₹699",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyl8l_VnlYfUINQHRpuvQUn_WqscE5CR_v9w&s",
    category: "male",
  },
  {
    id: "M203",
    name: "RAIZAX Men Linen Full Sleeve Shirt",
    price: "₹1099",
    image: "https://www.shutterstock.com/image-photo/portrait-handsome-man-outdoors-260nw-2172504911.jpg",
    category: "male",
  },

]

// Average measurements for "don't know" option
const averageMeasurements = {
  female: { chest: 36, waist: 28, hip: 38, height: 165, weight: 65 },
  male: { chest: 40, waist: 32, hip: 36, height: 175, weight: 75 },
}

export default function VirtualFittingRoom() {
  const [currentStep, setCurrentStep] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [measurements, setMeasurements] = useState<UserMeasurements>({
    bodyShape: "",
    chest: 36,
    waist: 28,
    hip: 38,
    gender: "",
    height: 165,
    weight: 65,
    measurementUnit: "inches",
    heightUnit: "cm",
    weightUnit: "kg",
    chestUnknown: false,
    waistUnknown: false,
    hipUnknown: false,
    heightUnknown: false,
    weightUnknown: false,
  })
  const [sizePrediction, setSizePrediction] = useState<SizePrediction>({ topSize: "", bottomSize: "" })
  const [selectedOutfit, setSelectedOutfit] = useState("")
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  // Convert measurements between units
  const convertMeasurement = (value: number, from: string, to: string) => {
    if (from === to) return value
    if (from === "inches" && to === "cm") return Math.round(value * 2.54)
    if (from === "cm" && to === "inches") return Math.round(value / 2.54)
    if (from === "kg" && to === "lbs") return Math.round(value * 2.205)
    if (from === "lbs" && to === "kg") return Math.round(value / 2.205)
    if (from === "cm" && to === "ft") return Math.round(value / 30.48)
    if (from === "ft" && to === "cm") return Math.round(value * 30.48)
    return value
  }

  // Handle "don't know" toggle
  const handleUnknownToggle = (field: keyof UserMeasurements, isUnknown: boolean) => {
    if (isUnknown && measurements.gender) {
      const avgValues = averageMeasurements[measurements.gender as keyof typeof averageMeasurements]
      const fieldName = field.replace("Unknown", "") as keyof typeof avgValues
      setMeasurements({
        ...measurements,
        [field]: isUnknown,
        [fieldName]: avgValues[fieldName],
      })
    } else {
      setMeasurements({
        ...measurements,
        [field]: isUnknown,
      })
    }
  }

  // Add item to cart
  const addToCart = (product: CartItem) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product])
    }
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  // Calculate size prediction
  useEffect(() => {
    if (measurements.chest && measurements.waist && measurements.hip && measurements.gender) {
      const chest = measurements.chest
      const waist = measurements.waist
      const hip = measurements.hip

      if (measurements.gender === "female") {
        const topSize = chest < 32 ? "XS" : chest < 36 ? "S" : chest < 40 ? "M" : chest < 44 ? "L" : "XL"
        const bottomSize = hip < 34 ? "XS" : hip < 38 ? "S" : hip < 42 ? "M" : hip < 46 ? "L" : "XL"
        setSizePrediction({ topSize, bottomSize })
      } else {
        const topSize = chest < 36 ? "S" : chest < 40 ? "M" : chest < 44 ? "L" : chest < 48 ? "XL" : "XXL"
        const bottomSize = waist < 30 ? "S" : waist < 34 ? "M" : waist < 38 ? "L" : waist < 42 ? "XL" : "XXL"
        setSizePrediction({ topSize, bottomSize })
      }
    }
  }, [measurements])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const availableProducts = allProducts.filter((product) => product.category === measurements.gender)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TB</span>
              </div>
              <h1 className="text-2xl font-bold text-green-800">Try Before You Buy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Step {currentStep + 1} of 4
              </Badge>
              {cart.length > 0 && <Badge className="bg-green-600 text-white">Cart: {cart.length} items</Badge>}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentStep === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-16 text-center"
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-5xl font-bold text-green-800 mb-4">🌿 Try Before You Buy</h2>
            <p className="text-l text-green-600 mb-6 max-w-2xl mx-auto">
              Your AI-Powered Virtual Fitting Room is Here.
              <br />
              Shop smarter, greener, and more confidently — all from your screen.
            </p>
            

            {/* Product Selection for Cart */}
            <div className="max-w-4xl mx-auto mb-8">
              <h3 className="text-xl font-semibold text-green-600 mb-6">Select the items you want to try on!</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {allProducts.slice(0, 6).map((product) => (
                  <Card key={product.id} className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                      <p className="text-green-600 font-bold mb-2">{product.price}</p>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={cart.some((item) => item.id === product.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {cart.some((item) => item.id === product.id) ? "Added" : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              onClick={nextStep}
              size="lg"
              disabled={cart.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            >
              Start Your Virtual Try-On
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            {cart.length === 0 && (
              <p className="text-sm text-red-600 mt-2">Add at least one item to your cart to continue</p>
            )}
          </motion.div>
        </motion.section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-green-800 flex items-center justify-center">
                  Know Your Fit 
                  </CardTitle>
                  <p className="text-green-600">
                    We'll help you find the perfect size for your body. No measuring tape? No problem.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Gender Selection */}
                  <div>
                    <Label className="text-lg font-semibold text-green-700 mb-4 block">Gender</Label>
                    <RadioGroup
                      value={measurements.gender}
                      onValueChange={(value) => setMeasurements({ ...measurements, gender: value })}
                      className="flex space-x-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Body Shape Selection */}
                  <div>
                    <Label className="text-lg font-semibold text-green-700 mb-4 block">Select Your Body Shape</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {bodyShapes.map((shape) => (
                        <motion.div key={shape.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Card
                            className={`cursor-pointer transition-all ${
                              measurements.bodyShape === shape.id
                                ? "ring-2 ring-green-500 bg-green-50"
                                : "hover:bg-green-50"
                            }`}
                            onClick={() => setMeasurements({ ...measurements, bodyShape: shape.id })}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="w-16 h-20 mx-auto mb-2 flex items-center justify-center">{shape.svg}</div>
                              <h3 className="font-semibold text-sm">{shape.name}</h3>
                              <p className="text-xs text-gray-600 mt-1">{shape.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Measurement Unit Selection */}
                  <div className="flex items-center space-x-4">
                    <Label className="text-lg font-semibold text-green-700">Measurement Unit:</Label>
                    <Select
                      value={measurements.measurementUnit}
                      onValueChange={(value) => setMeasurements({ ...measurements, measurementUnit: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inches">Inches</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Body Measurements with Sliders */}
                  <div className="space-y-6">
                    <Label className="text-lg font-semibold text-green-700">Body Measurements</Label>

                    {/* Chest */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chest">Chest ({measurements.measurementUnit})</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={measurements.chestUnknown}
                            onCheckedChange={(checked) => handleUnknownToggle("chestUnknown", checked)}
                          />
                          <Label className="text-sm text-gray-600">Don't know</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "28" : "70"}</span>
                        <Slider
                          value={[measurements.chest]}
                          onValueChange={(value) => setMeasurements({ ...measurements, chest: value[0] })}
                          max={measurements.measurementUnit === "inches" ? 50 : 127}
                          min={measurements.measurementUnit === "inches" ? 28 : 70}
                          step={1}
                          className="flex-1"
                          disabled={measurements.chestUnknown}
                        />
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "50" : "127"}</span>
                        <Badge variant="outline" className="w-16 text-center">
                          {measurements.chest}
                        </Badge>
                      </div>
                    </div>

                    {/* Waist */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="waist">Waist ({measurements.measurementUnit})</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={measurements.waistUnknown}
                            onCheckedChange={(checked) => handleUnknownToggle("waistUnknown", checked)}
                          />
                          <Label className="text-sm text-gray-600">Don't know</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "24" : "60"}</span>
                        <Slider
                          value={[measurements.waist]}
                          onValueChange={(value) => setMeasurements({ ...measurements, waist: value[0] })}
                          max={measurements.measurementUnit === "inches" ? 45 : 114}
                          min={measurements.measurementUnit === "inches" ? 24 : 60}
                          step={1}
                          className="flex-1"
                          disabled={measurements.waistUnknown}
                        />
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "45" : "114"}</span>
                        <Badge variant="outline" className="w-16 text-center">
                          {measurements.waist}
                        </Badge>
                      </div>
                    </div>

                    {/* Hip */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hip">Hip ({measurements.measurementUnit})</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={measurements.hipUnknown}
                            onCheckedChange={(checked) => handleUnknownToggle("hipUnknown", checked)}
                          />
                          <Label className="text-sm text-gray-600">Don't know</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "30" : "76"}</span>
                        <Slider
                          value={[measurements.hip]}
                          onValueChange={(value) => setMeasurements({ ...measurements, hip: value[0] })}
                          max={measurements.measurementUnit === "inches" ? 50 : 127}
                          min={measurements.measurementUnit === "inches" ? 30 : 76}
                          step={1}
                          className="flex-1"
                          disabled={measurements.hipUnknown}
                        />
                        <span className="text-sm w-8">{measurements.measurementUnit === "inches" ? "50" : "127"}</span>
                        <Badge variant="outline" className="w-16 text-center">
                          {measurements.hip}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Height and Weight */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Height */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Height ({measurements.heightUnit})</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={measurements.heightUnknown}
                            onCheckedChange={(checked) => handleUnknownToggle("heightUnknown", checked)}
                          />
                          <Label className="text-sm text-gray-600">Don't know</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Select
                          value={measurements.heightUnit}
                          onValueChange={(value) => setMeasurements({ ...measurements, heightUnit: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm w-8">{measurements.heightUnit === "cm" ? "140" : "4.5"}</span>
                        <Slider
                          value={[measurements.height]}
                          onValueChange={(value) => setMeasurements({ ...measurements, height: value[0] })}
                          max={measurements.heightUnit === "cm" ? 200 : 7}
                          min={measurements.heightUnit === "cm" ? 140 : 4.5}
                          step={measurements.heightUnit === "cm" ? 1 : 0.1}
                          className="flex-1"
                          disabled={measurements.heightUnknown}
                        />
                        <span className="text-sm w-8">{measurements.heightUnit === "cm" ? "200" : "7"}</span>
                        <Badge variant="outline" className="w-16 text-center">
                          {measurements.height}
                        </Badge>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Weight ({measurements.weightUnit})</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={measurements.weightUnknown}
                            onCheckedChange={(checked) => handleUnknownToggle("weightUnknown", checked)}
                          />
                          <Label className="text-sm text-gray-600">Don't know</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Select
                          value={measurements.weightUnit}
                          onValueChange={(value) => setMeasurements({ ...measurements, weightUnit: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm w-8">{measurements.weightUnit === "kg" ? "40" : "88"}</span>
                        <Slider
                          value={[measurements.weight]}
                          onValueChange={(value) => setMeasurements({ ...measurements, weight: value[0] })}
                          max={measurements.weightUnit === "kg" ? 120 : 265}
                          min={measurements.weightUnit === "kg" ? 40 : 88}
                          step={1}
                          className="flex-1"
                          disabled={measurements.weightUnknown}
                        />
                        <span className="text-sm w-8">{measurements.weightUnit === "kg" ? "120" : "265"}</span>
                        <Badge variant="outline" className="w-16 text-center">
                          {measurements.weight}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Size Prediction */}
                  {sizePrediction.topSize && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
                    >
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-green-600" />
                        AI Size Prediction
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <span className="text-sm text-green-600 block mb-1">Recommended Top Size</span>
                          <div className="text-3xl font-bold text-green-800 bg-white rounded-lg py-2 px-4 shadow-sm">
                            {sizePrediction.topSize}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-sm text-green-600 block mb-1">Recommended Bottom Size</span>
                          <div className="text-3xl font-bold text-green-800 bg-white rounded-lg py-2 px-4 shadow-sm">
                            {sizePrediction.bottomSize}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!measurements.gender || !measurements.bodyShape}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Next: Virtual Try-On
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: See It On You */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-green-800 flex items-center justify-center">
                       See It On You
                  </CardTitle>
                  <p className="text-green-600">
                    Choose from your cart items and upload your photo for virtual try-on!
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Cart Items for Try-On */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold text-green-700">Your Cart Items</Label>
                      <Badge className="bg-green-100 text-green-700">{cart.length} items in cart</Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {cart.map((item) => (
                        <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Card
                            className={`cursor-pointer transition-all ${
                              selectedOutfit === item.id ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-green-50"
                            }`}
                            onClick={() => setSelectedOutfit(item.id)}
                          >
                            <CardContent className="p-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                              <h3 className="font-semibold text-green-800">{item.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">Product ID: {item.id}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-green-600">{item.price}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeFromCart(item.id)
                                  }}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    {cart.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No items in cart. Go back to add some items first.</p>
                        <Button variant="outline" onClick={prevStep}>
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Go Back to Add Items
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Photo Upload */}
                  {cart.length > 0 && (
                    <div>
                      <Label className="text-lg font-semibold text-green-700 mb-4 block">Upload Your Photo</Label>
                      <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <ImageUp className="mx-auto h-12 w-12 text-green-400 mb-4" />
                          <p className="text-green-600 mb-2 font-semibold">Click to upload your photo</p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG up to 10MB • Best results with full body photos
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Virtual Try-On Preview */}
                  {uploadedPhoto && selectedOutfit && (
                    (() => {
                      // Only allow virtual try-on preview for product F101
                      if (selectedOutfit !== "F101") {
                        // Show alert and block preview for other products
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 p-6 rounded-xl text-center"
                          >
                            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center justify-center">
                              <ThumbsDown className="mr-2 h-5 w-5" />
                              Virtual try-on is not available for this product yet.
                            </h3>
                          </motion.div>
                        )
                      }

                      // Check if the uploaded file name is "sample-image.png"
                      const inputElem = document.getElementById("photo-upload") as HTMLInputElement | null
                      const file = inputElem?.files?.[0]
                      if (!file || file.name !== "sample-image.png") {
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 p-6 rounded-xl text-center"
                          >
                            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center justify-center">
                              <ThumbsDown className="mr-2 h-5 w-5" />
                              Please upload a clear, full-body image of yourself.
                            </h3>
                          </motion.div>
                        )
                      }
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-green-50 to-green-50 p-6 rounded-xl border border-green-200"
                        >
                          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                            <Zap className="mr-2 h-5 w-5" />
                            Virtual Try-On Preview
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="text-center">
                              <h4 className="font-semibold mb-3 text-green-700">Front Profile</h4>
                              <div className="relative">
                                <img
                                  src={'/front-profile.png'}
                                  className="w-full h-[42rem] object-cover rounded-lg shadow-md"
                                />
                                <div className="absolute inset-0 rounded-lg flex items-center justify-center"></div>
                              </div>
                            </div>
                            <div className="text-center">
                              <h4 className="font-semibold mb-3 text-green-700">Side Profile</h4>
                              <div className="relative">
                                <img
                                  src={'/side-profile.png'}
                                  className="w-full h-[42rem] object-cover rounded-lg shadow-md"
                                />
                                <div className="absolute inset-0 rounded-lg flex items-center justify-center"></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })()
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!uploadedPhoto || !selectedOutfit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      See Sustainability Impact
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Sustainability Impact */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm border-green-200 overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-br from-green-50 to-amber-50 text-green-900">
                  <CardTitle className="text-3xl font-bold flex items-center justify-center">
                     Your Sustainability Impact
                  </CardTitle>
                  <p className="text-green-600 text-lg">
                    By using virtual try-on, you've already made a positive environmental impact!
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Impact Stats with Beautiful Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-bold text-blue-800 mb-2 text-lg">Energy Saved</h3>
                          <p className="text-3xl font-bold text-blue-600 mb-1">~0.4 kWh</p>
                          <p className="text-sm text-blue-600">Average trial room energy per person</p>
                          <div className="mt-3 bg-blue-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ delay: 0.5, duration: 1 }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, rotate: 10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Car className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-bold text-green-800 mb-2 text-lg">CO₂ Prevented</h3>
                          <p className="text-3xl font-bold text-green-600 mb-1">0.3 kg</p>
                          <p className="text-sm text-green-600">By skipping a drive to the mall</p>
                          <div className="mt-3 bg-green-200 rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "60%" }}
                              transition={{ delay: 0.7, duration: 1 }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <Recycle className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-bold text-amber-800 mb-2 text-lg">Waste Reduced</h3>
                          <p className="text-3xl font-bold text-amber-600 mb-1">20%</p>
                          <p className="text-sm text-amber-600">Fewer returns = less textile waste</p>
                          <div className="mt-3 bg-amber-200 rounded-full h-2">
                            <motion.div
                              className="bg-amber-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "80%" }}
                              transition={{ delay: 0.9, duration: 1 }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Beautiful Discount Section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="relative overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-8 rounded-2xl text-white text-center shadow-2xl">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="text-4xl mb-4"
                      >
                        💚
                      </motion.div>
                      <h3 className="text-3xl font-bold mb-4">Get 10% Extra Off!</h3>
                      <p className="text-xl mb-6 text-green-100">Because going green shouldn't cost more!</p>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
                      >
                        <Badge className="bg-white text-green-600 text-xl px-6 py-3 font-bold shadow-lg">
                          Code: ECOFRIEND10
                        </Badge>
                      </motion.div>

                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
                      <div className="absolute bottom-4 left-8 w-4 h-4 bg-white/20 rounded-full"></div>
                      <div className="absolute bottom-8 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
                    </div>
                  </motion.div>

                  {/* Enhanced Feedback Section */}
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                      <Label className="text-xl font-semibold text-gray-800 mb-6 block">
                        🛒 How accurate was your virtual try-on experience?
                      </Label>
                      <div className="flex justify-center space-x-6 mb-6">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            variant={feedback === "up" ? "default" : "outline"}
                            onClick={() => setFeedback("up")}
                            className={`px-8 py-4 text-lg ${
                              feedback === "up"
                                ? "bg-green-600 hover:bg-green-700 shadow-lg"
                                : "hover:bg-green-50 border-green-300"
                            }`}
                          >
                            <ThumbsUp className="mr-3 h-5 w-5" />
                            Yes, very accurate!
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            variant={feedback === "down" ? "default" : "outline"}
                            onClick={() => setFeedback("down")}
                            className={`px-8 py-4 text-lg ${
                              feedback === "down"
                                ? "bg-red-600 hover:bg-red-700 shadow-lg"
                                : "hover:bg-red-50 border-red-300"
                            }`}
                          >
                            <ThumbsDown className="mr-3 h-5 w-5" />
                            Needs improvement
                          </Button>
                        </motion.div>
                      </div>

                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p
                              className={`font-semibold mb-2 ${
                              feedback === "up"
                                ? "text-green-900"
                                : "text-red-900"
                              }`}
                            >
                              {feedback === "up"
                              ? "🙂 Thank you for your feedback!"
                              : "Noted, We'll keep improving."}
                            </p>
                            <p className="text-sm text-gray-600">
                              Your feedback helps us make virtual try-on even better for everyone.
                            </p>
                          </div>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Button
                              size="lg"
                              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                              <ShoppingCart className="mr-3 h-6 w-6" />
                              Complete Purchase
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} size="lg">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(0)} variant="outline" size="lg">
                      Start Over
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-800 font-bold text-lg">TB</span>
            </div>
            <span className="text-2xl font-bold">Try Before You Buy</span>
          </div>
          <p className="text-green-100 text-lg mb-4">
            © 2025 Try Before You Buy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
