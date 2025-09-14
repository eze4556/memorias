import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore"

export async function GET() {
  try {
    const memoriesRef = collection(db, "memories")
    const q = query(memoriesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const memories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(memories)
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, author } = body

    const memoryData = {
      title,
      description,
      category,
      author,
      createdAt: new Date(),
      date: new Date().toISOString().split("T")[0],
    }

    const docRef = await addDoc(collection(db, "memories"), memoryData)

    return NextResponse.json({ id: docRef.id, ...memoryData })
  } catch (error) {
    console.error("Error adding memory:", error)
    return NextResponse.json({ error: "Failed to add memory" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Memory ID is required" }, { status: 400 })
    }

    const memoryRef = doc(db, "memories", id)
    await deleteDoc(memoryRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting memory:", error)
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 })
  }
}
