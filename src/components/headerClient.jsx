'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HeaderClient() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setError(null)
    try {
      const res = await fetch("http://localhost:1234/admin/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Error logging out")
      setShowModal(false)

      router.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <>
      <header className="w-full py-6 bg-gray-900 text-center text-2xl font-bold shadow-md">
        <div className="flex justify-between items-center px-6">
          <div>Fictional Company</div>
          <nav className="space-x-4 text-sm">
            <Link href="/" className="hover:underline">
              Login
            </Link>
            <button onClick={() => setShowModal(true)} className="hover:underline">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-96 transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="text-xl font-semibold mb-4">¿Log out?</h2>
            <p className="mb-6">¿Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { setShowModal(false), setError(null) }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes
              </button>

            </div>
            {error && (
              <p className="mt-4 text-center text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
