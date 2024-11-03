'use client'

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Home, Image as ImageIcon, Shapes, Palette } from "lucide-react"
import Button from "./ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Stage, Layer } from 'react-konva';

// Define the tab items
const tabs = [
  {
    id: "photos",
    label: "おもちの写真",
    icon: <ImageIcon className="w-4 h-4" />,
    items: [
      "/placeholder.svg?height=100&width=100&text=Omochi+1",
      "/placeholder.svg?height=100&width=100&text=Omochi+2",
      "/placeholder.svg?height=100&width=100&text=Omochi+3",
    ]
  },
  {
    id: "objects",
    label: "オブジェクト",
    icon: <Shapes className="w-4 h-4" />,
    items: [
      "/placeholder.svg?height=100&width=100&text=Object+1",
      "/placeholder.svg?height=100&width=100&text=Object+2",
      "/placeholder.svg?height=100&width=100&text=Object+3",
    ]
  },
  {
    id: "backgrounds",
    label: "背景",
    icon: <Palette className="w-4 h-4" />,
    items: [
      "/placeholder.svg?height=600&width=800&text=Background+1",
      "/placeholder.svg?height=600&width=800&text=Background+2",
      "/placeholder.svg?height=600&width=800&text=Background+3",
    ]
  }
]

export default function Component() {
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Top Navigation */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-purple-900">
            <Home className="w-6 h-6" />
          </Button>
          <span className="text-lg text-purple-900">絵本を作る</span>
        </div>

        <nav>
          <ul className="flex gap-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <Button
                  variant="secondary"
                  className={`rounded-full bg-white hover:bg-white/90 text-purple-900 px-4 py-2 relative ${
                    tab === selectedTab ? "font-semibold" : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                  {tab === selectedTab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      layoutId="underline"
                    />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Canvas Area */}
        <main className="flex-grow flex justify-center items-center p-4">
          <div className="w-full max-w-4xl aspect-[4/3] bg-white rounded-lg shadow-sm overflow-hidden">
            {isClient && (
              <Stage width={stageSize.width} height={stageSize.height}>
                <Layer>
                  {/* Canvas content will go here */}
                </Layer>
              </Stage>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-64 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <h2 className="font-semibold mb-4 text-purple-900">{selectedTab.label}</h2>
              <div className="grid grid-cols-2 gap-2">
                {selectedTab.items.map((item, index) => (
                  <button
                    key={index}
                    className="aspect-square rounded border-2 border-purple-100 hover:border-purple-300 transition-colors"
                  >
                    <img
                      src={item}
                      alt={`${selectedTab.label} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}