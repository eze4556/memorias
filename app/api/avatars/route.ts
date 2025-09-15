import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export async function GET() {
  try {
    const avatarsRef = doc(db, "settings", "avatars")
    const docSnap = await getDoc(avatarsRef)

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data())
    } else {
      // Valores por defecto si no existen avatares guardados
      const defaultAvatars = {
        ezequiel: "/placeholder.svg?height=60&width=60",
        milagros: "/placeholder.svg?height=60&width=60",
        brune: "/placeholder.svg?height=48&width=48",
        alaska: "/placeholder.svg?height=48&width=48",
        lunita: "/placeholder.svg?height=48&width=48",
      }
      return NextResponse.json(defaultAvatars)
    }
  } catch (error) {
    console.error("Error fetching avatars:", error)
    return NextResponse.json({ error: "Failed to fetch avatars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { avatars } = body

    const avatarsRef = doc(db, "settings", "avatars")
    await setDoc(avatarsRef, avatars)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving avatars:", error)
    return NextResponse.json({ error: "Failed to save avatars" }, { status: 500 })
  }
}
