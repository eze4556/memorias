"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, Save, Eye, EyeOff } from "lucide-react"

interface AdminPanelProps {
  onClose: () => void
  onAddMemory: (memory: any) => void
  onUpdateAvatars: (avatars: any) => void
  avatars: any
}

export default function AdminPanel({ onClose, onAddMemory, onUpdateAvatars, avatars }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("memories")

  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    category: "",
    author: "Ezequiel",
    imageUrl: "",
  })

  const [newAvatars, setNewAvatars] = useState(avatars)

  const handleLogin = () => {
    if (password === "milagros2024") {
      setIsAuthenticated(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const handleAddMemory = () => {
    if (newMemory.title && newMemory.description) {
      onAddMemory({
        id: Date.now().toString(),
        ...newMemory,
        date: new Date().toISOString().split("T")[0],
      })
      setNewMemory({
        title: "",
        description: "",
        category: "",
        author: "Ezequiel",
        imageUrl: "",
      })
      alert("Recuerdo agregado exitosamente!")
    }
  }

  const handleSaveAvatars = () => {
    onUpdateAvatars(newAvatars)
    alert("Avatares actualizados exitosamente!")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, person: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setNewAvatars({ ...newAvatars, [person]: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMemoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setNewMemory({ ...newMemory, imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border-purple-300/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-lg">Panel de Admin</CardTitle>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 pr-10 h-12 text-base"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-white/10"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-purple-200" />
                ) : (
                  <Eye className="w-4 h-4 text-purple-200" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 text-base font-medium"
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border-purple-300/30">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-lg sm:text-xl">Panel de Administración</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-4">
            <Button
              onClick={() => setActiveTab("memories")}
              className={`${
                activeTab === "memories" ? "bg-purple-500 text-white" : "bg-white/20 text-purple-200 hover:bg-white/30"
              } text-sm sm:text-base px-3 sm:px-4 py-2`}
            >
              Recuerdos
            </Button>
            <Button
              onClick={() => setActiveTab("avatars")}
              className={`${
                activeTab === "avatars" ? "bg-purple-500 text-white" : "bg-white/20 text-purple-200 hover:bg-white/30"
              } text-sm sm:text-base px-3 sm:px-4 py-2`}
            >
              Avatares
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {activeTab === "memories" && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Agregar Nuevo Recuerdo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  placeholder="Título del recuerdo"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 h-12 text-base"
                />
                <Input
                  placeholder="Categoría"
                  value={newMemory.category}
                  onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                  className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 h-12 text-base"
                />
              </div>
              <Textarea
                placeholder="Descripción del recuerdo"
                value={newMemory.description}
                onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 min-h-[100px] text-base"
                rows={3}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <select
                  value={newMemory.author}
                  onChange={(e) => setNewMemory({ ...newMemory, author: e.target.value })}
                  className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-3 text-white h-12 text-base"
                >
                  <option value="Ezequiel" className="text-black">
                    Ezequiel
                  </option>
                  <option value="Milagros" className="text-black">
                    Milagros
                  </option>
                </select>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Imagen del recuerdo (opcional)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMemoryImageUpload(e)}
                      className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm"
                    />
                    {newMemory.imageUrl && (
                      <img
                        src={newMemory.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleAddMemory}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-12 text-base font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Agregar Recuerdo
              </Button>
            </div>
          )}

          {activeTab === "avatars" && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Actualizar Avatares</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg text-purple-200 font-medium">Personas</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Ezequiel</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "ezequiel")}
                          className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm flex-1"
                        />
                        {newAvatars.ezequiel !== "/placeholder.svg?height=60&width=60" && (
                          <img
                            src={newAvatars.ezequiel || "/placeholder.svg"}
                            alt="Preview"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Milagros</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "milagros")}
                          className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm flex-1"
                        />
                        {newAvatars.milagros !== "/placeholder.svg?height=60&width=60" && (
                          <img
                            src={newAvatars.milagros || "/placeholder.svg"}
                            alt="Preview"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg text-purple-200 font-medium">Gatitas</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Brune</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "brune")}
                          className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm flex-1"
                        />
                        {newAvatars.brune !== "/placeholder.svg?height=48&width=48" && (
                          <img
                            src={newAvatars.brune || "/placeholder.svg"}
                            alt="Preview"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Alaska</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "alaska")}
                          className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm flex-1"
                        />
                        {newAvatars.alaska !== "/placeholder.svg?height=48&width=48" && (
                          <img
                            src={newAvatars.alaska || "/placeholder.svg"}
                            alt="Preview"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Lunita</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "lunita")}
                          className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-2 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-sm flex-1"
                        />
                        {newAvatars.lunita !== "/placeholder.svg?height=48&width=48" && (
                          <img
                            src={newAvatars.lunita || "/placeholder.svg"}
                            alt="Preview"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveAvatars}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-12 text-base font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Actualizar Avatares
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
