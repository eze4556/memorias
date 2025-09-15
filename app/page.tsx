"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Camera, Upload, Star, Trash2, X } from "lucide-react"
import Image from "next/image"
import AdminPanel from "@/components/admin-panel"

interface Memory {
  id: string
  title: string
  description: string
  category: string
  date: string
  imageUrl?: string
  author: string
}

export default function MemoriesApp() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    category: "momentos",
    author: "Ezequiel",
  })

  const [avatars, setAvatars] = useState({
    ezequiel: "/placeholder.svg?height=60&width=60",
    milagros: "/placeholder.svg?height=60&width=60",
    brune: "/placeholder.svg?height=48&width=48",
    alaska: "/placeholder.svg?height=48&width=48",
    lunita: "/placeholder.svg?height=48&width=48",
  })

  // Cargar recuerdos desde Firebase al iniciar
  useEffect(() => {
    const loadMemories = async () => {
      try {
        const response = await fetch('/api/memories')
        if (response.ok) {
          const data = await response.json()
          setMemories(data)
        }
      } catch (error) {
        console.error('Error cargando recuerdos:', error)
      } finally {
        setLoading(false)
      }
    }

    // Cargar avatares desde localStorage
    const savedAvatars = localStorage.getItem('family-avatars')
    if (savedAvatars) {
      setAvatars(JSON.parse(savedAvatars))
    }

    loadMemories()
  }, [])

  const handleAddMemoryFromAdmin = (memory: any) => {
    setMemories([memory, ...memories])
  }

  const handleUpdateAvatars = (newAvatars: any) => {
    setAvatars(newAvatars)
    // Guardar avatares en localStorage
    localStorage.setItem('family-avatars', JSON.stringify(newAvatars))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('Enviando recuerdo:', newMemory)
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMemory),
      })

      console.log('Respuesta del servidor:', response.status)
      
      if (response.ok) {
        const savedMemory = await response.json()
        console.log('Recuerdo guardado:', savedMemory)
        setMemories([savedMemory, ...memories])
        setNewMemory({ title: "", description: "", category: "momentos", author: "Ezequiel" })
        setShowForm(false)
        alert('¡Recuerdo guardado exitosamente!')
      } else {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        alert('Error al guardar el recuerdo: ' + (errorData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error guardando recuerdo:', error)
      alert('Error al guardar el recuerdo: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }

  const deleteMemory = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este recuerdo?")) {
      try {
        const response = await fetch(`/api/memories?id=${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setMemories(memories.filter((memory) => memory.id !== id))
        } else {
          alert('Error al eliminar el recuerdo')
        }
      } catch (error) {
        console.error('Error eliminando recuerdo:', error)
        alert('Error al eliminar el recuerdo')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative px-4 py-8 sm:px-6 sm:py-12 text-center">
          <div className="animate-bounce mb-3 sm:mb-4">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-pink-300" fill="currentColor" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 animate-fade-in">Nuestros Recuerdos</h1>
          
          {/* Family Avatars - Optimized for mobile */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 touch-manipulation">
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1 hover:scale-110 transition-transform duration-300 shadow-lg">
                <img
                  src={avatars.ezequiel || "/placeholder.svg"}
                  alt="Ezequiel"
                  className="w-full h-full rounded-full object-cover bg-white/20"
                />
              </div>
              <span className="text-purple-200 text-xs sm:text-sm mt-1 sm:mt-2 group-hover:text-white transition-colors font-medium">Ezequiel</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 p-1 hover:scale-110 transition-transform duration-300 shadow-lg">
                <img
                  src={avatars.milagros || "/placeholder.svg"}
                  alt="Milagros"
                  className="w-full h-full rounded-full object-cover bg-white/20"
                />
              </div>
              <span className="text-purple-200 text-xs sm:text-sm mt-1 sm:mt-2 group-hover:text-white transition-colors font-medium">Milagros</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 p-1 hover:scale-110 transition-transform duration-300 shadow-lg">
                <img
                  src={avatars.brune || "/placeholder.svg"}
                  alt="Brune"
                  className="w-full h-full rounded-full object-cover bg-white/20"
                />
              </div>
              <span className="text-purple-200 text-xs mt-1 group-hover:text-white transition-colors font-medium">Brune</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-1 hover:scale-110 transition-transform duration-300 shadow-lg">
                <img
                  src={avatars.alaska || "/placeholder.svg"}
                  alt="Alaska"
                  className="w-full h-full rounded-full object-cover bg-white/20"
                />
              </div>
              <span className="text-purple-200 text-xs mt-1 group-hover:text-white transition-colors font-medium">Alaska</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1 hover:scale-110 transition-transform duration-300 shadow-lg">
                <img
                  src={avatars.lunita || "/placeholder.svg"}
                  alt="Lunita"
                  className="w-full h-full rounded-full object-cover bg-white/20"
                />
              </div>
              <span className="text-purple-200 text-xs mt-1 group-hover:text-white transition-colors font-medium">Lunita</span>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl text-purple-200 mb-1 sm:mb-2 font-medium">Ezequiel & Milagros</p>
          <p className="text-base sm:text-lg text-purple-300">Con Brune, Alaska y Lunita 🐱</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        {/* Add Memory Button */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Camera className="w-5 h-5 mr-2" />
            Agregar Recuerdo
          </Button>
        </div>

        {/* Add Memory Form */}
        {showForm && (
          <Card className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-md border-purple-300/30 animate-slide-down mx-2 sm:mx-0">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    placeholder="Título del recuerdo"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 h-12 text-base"
                    required
                  />
                  <Input
                    placeholder="Categoría (ej: momentos, comidas, viajes)"
                    value={newMemory.category}
                    onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                    className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 h-12 text-base"
                    required
                  />
                </div>
                <Textarea
                  placeholder="Describe este hermoso momento..."
                  value={newMemory.description}
                  onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                  className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-200 min-h-[100px] text-base"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <select
                    value={newMemory.author}
                    onChange={(e) => setNewMemory({ ...newMemory, author: e.target.value })}
                    className="bg-white/20 border border-purple-300/50 rounded-md px-3 py-3 text-white h-12 text-base flex-1"
                  >
                    <option value="Ezequiel" className="text-black">
                      Ezequiel
                    </option>
                    <option value="Milagros" className="text-black">
                      Milagros
                    </option>
                  </select>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-12 px-6 text-base font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Guardar Recuerdo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
            <p className="text-purple-200">Cargando recuerdos...</p>
          </div>
        )}

        {/* Memories Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {memories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-purple-300 mb-4" />
                <h3 className="text-xl text-white mb-2">¡No hay recuerdos aún!</h3>
                <p className="text-purple-200">Agrega tu primer recuerdo especial</p>
              </div>
            ) : (
              memories.map((memory, index) => {
            return (
              <Card
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="bg-white/10 backdrop-blur-md border-purple-300/30 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:rotate-1 animate-fade-in-up shadow-xl cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-purple-200 text-xs sm:text-sm font-medium">{memory.author}</span>
                    </div>
                  </div>

                  {memory.imageUrl && (
                    <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={memory.imageUrl || "/placeholder.svg"}
                        alt={memory.title}
                        width={300}
                        height={200}
                        className="w-full h-40 sm:h-48 object-contain bg-gray-800/50"
                      />
                    </div>
                  )}

                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 leading-tight">{memory.title}</h3>
                  <p className="text-purple-200 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">{memory.description}</p>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-purple-300 text-purple-200 text-xs px-2 py-1">
                        {memory.date}
                      </Badge>
                      <Badge className="bg-purple-500/50 text-purple-100 text-xs px-2 py-1">{memory.category}</Badge>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 hover:fill-current cursor-pointer transition-all duration-300 hover:scale-125" />
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 p-1"
                        title="Eliminar recuerdo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 py-6 sm:py-8 px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-purple-200 text-base sm:text-lg">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-current animate-pulse" />
            <span className="text-center">Hecho con amor para Ezequiel, Milagros y sus gatitas</span>
            <button
              onClick={() => setShowAdmin(true)}
              className="group transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-pink-400/20"
              title="Panel de Administración"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-current animate-pulse group-hover:text-pink-300 group-hover:scale-125 transition-all duration-300" />
            </button>
          </div>
          <p className="text-purple-300 mt-2 text-sm sm:text-base">Brune 🐱 Alaska 🐱 Lunita 🐱</p>
          <p className="text-purple-400 mt-2 text-xs opacity-70">Toca el corazón para administrar</p>
        </div>
      </div>
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onAddMemory={handleAddMemoryFromAdmin}
          onUpdateAvatars={handleUpdateAvatars}
          avatars={avatars}
        />
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border-purple-300/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMemory.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-purple-200">{selectedMemory.author}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedMemory(null)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {selectedMemory.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    width={600}
                    height={400}
                    className="w-full h-64 sm:h-80 object-contain bg-gray-800/50"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                  <p className="text-purple-200 leading-relaxed text-base">{selectedMemory.description}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="border-purple-300 text-purple-200 px-3 py-1">
                    📅 {selectedMemory.date}
                  </Badge>
                  <Badge className="bg-purple-500/50 text-purple-100 px-3 py-1">
                    🏷️ {selectedMemory.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
