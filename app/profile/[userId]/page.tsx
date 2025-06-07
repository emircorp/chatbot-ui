"use client"

import { useEffect, useState } from "react"

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${params.userId}`)
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [params.userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile found</div>

  return (
    <div>
      <h1>{profile.display_name}</h1>
      {/* diğer profil bilgileri */}
    </div>
  )
}
