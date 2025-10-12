"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AdminUser { id: string; name: string; email: string; role: string }
interface Course { _id: string; title: string; isActive: boolean }
interface Material { _id: string; title: string; description?: string; fileUrl?: string; content?: string; createdAt: string }

export default function CourseCenter() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [mat, setMat] = useState({ title: '', description: '', fileUrl: '', content: '' })
  const [notif, setNotif] = useState({ title: '', content: '' })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', fileUrl: '', content: '', isActive: true })

  useEffect(() => {
    checkAdmin()
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) fetchMaterials(selectedCourse)
  }, [selectedCourse])

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/admin/me')
      if (!res.ok) return router.push('/auth')
      const data = await res.json()
      setAdmin(data.admin)
      setLoading(false)
    } catch {
      router.push('/auth')
    }
  }

  const fetchCourses = async () => {
    const res = await fetch('/api/admin/courses')
    if (res.ok) {
      const data = await res.json()
      setCourses((data.courses || []).map((c: any) => ({ _id: c._id, title: c.title, isActive: c.isActive })))
    }
  }

  const fetchMaterials = async (courseId: string) => {
    const res = await fetch(`/api/admin/courses/${courseId}/materials`)
    if (res.ok) {
      const data = await res.json()
      setMaterials(data.materials || [])
    }
  }

  const createMaterial = async () => {
    if (!selectedCourse || !mat.title.trim()) return alert('Select course and enter title')
    setCreating(true)
    const res = await fetch(`/api/admin/courses/${selectedCourse}/materials`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mat)
    })
    setCreating(false)
    if (res.ok) {
      setMat({ title: '', description: '', fileUrl: '', content: '' })
      fetchMaterials(selectedCourse)
      alert('Material added')
    } else {
      const err = await res.json(); alert(err.error || 'Failed')
    }
  }

  const sendNotification = async () => {
    if (!selectedCourse || !notif.title.trim() || !notif.content.trim()) return alert('Fill all fields')
    setCreating(true)
    const res = await fetch(`/api/admin/courses/${selectedCourse}/notifications`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    })
    setCreating(false)
    if (res.ok) {
      setNotif({ title: '', content: '' })
      alert('Notification sent to enrolled students of this course')
    } else {
      const err = await res.json(); alert(err.error || 'Failed')
    }
  }

  if (loading || !admin) return null

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Center</CardTitle>
            <CardDescription>Share study materials and send notifications to enrolled students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block mb-1">Select Course</Label>
              <select className="w-full border rounded px-3 py-2" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">-- choose course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}{!c.isActive ? ' (inactive)' : ''}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Study Material</CardTitle>
                  <CardDescription>Upload link or add content for this course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={mat.title} onChange={(e) => setMat({ ...mat, title: e.target.value })} placeholder="e.g., Week 1 PDF" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={mat.description} onChange={(e) => setMat({ ...mat, description: e.target.value })} placeholder="Short description" />
                  </div>
                  <div>
                    <Label>File URL</Label>
                    <Input value={mat.fileUrl} onChange={(e) => setMat({ ...mat, fileUrl: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Content (optional)</Label>
                    <Textarea value={mat.content} onChange={(e) => setMat({ ...mat, content: e.target.value })} placeholder="Notes or links" />
                  </div>
                  <Button disabled={creating} onClick={createMaterial}>Add Material</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Send Notification</CardTitle>
                  <CardDescription>Message will go to students enrolled in this course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={notif.title} onChange={(e) => setNotif({ ...notif, title: e.target.value })} placeholder="e.g., New assignment posted" />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea value={notif.content} onChange={(e) => setNotif({ ...notif, content: e.target.value })} placeholder="Details for students" />
                  </div>
                  <Button disabled={creating} onClick={sendNotification}>Send Notification</Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Existing Materials</CardTitle>
                  <CardDescription>Latest materials for this course.</CardDescription>
                </CardHeader>
                <CardContent>
                  {materials.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No materials yet.</div>
                  ) : (
                    <ul className="space-y-3">
                      {materials.map(m => (
                        <li key={m._id} className="text-sm border rounded p-3">
                          {editingId === m._id ? (
                            <div className="space-y-2">
                              <div>
                                <Label>Title</Label>
                                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                              </div>
                              <div>
                                <Label>File URL</Label>
                                <Input value={editForm.fileUrl} onChange={(e) => setEditForm({ ...editForm, fileUrl: e.target.value })} />
                              </div>
                              <div>
                                <Label>Content</Label>
                                <Textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={async () => {
                                  const res = await fetch(`/api/admin/materials/${m._id}`, {
                                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm)
                                  })
                                  if (res.ok) { setEditingId(null); fetchMaterials(selectedCourse) } else { alert('Update failed') }
                                }}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {m.title}
                                </div>
                                {m.description && <div className="text-muted-foreground">{m.description}</div>}
                                {m.fileUrl && <a className="text-blue-600" href={m.fileUrl} target="_blank">Open</a>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => { setEditingId(m._id); setEditForm({ title: m.title||'', description: m.description||'', fileUrl: m.fileUrl||'', content: m.content||'', isActive: (m as any).isActive!==false }) }}>Edit</Button>
                                <Button size="sm" variant={((m as any).isActive!==false) ? 'outline' : 'default'} onClick={async () => {
                                  const next = !((m as any).isActive!==false)
                                  const res = await fetch(`/api/admin/materials/${m._id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ isActive: next })})
                                  if (res.ok) fetchMaterials(selectedCourse)
                                }}>{((m as any).isActive!==false) ? 'Hide' : 'Show'}</Button>
                                <Button size="sm" variant="destructive" onClick={async () => {
                                  if (!confirm('Delete this material?')) return
                                  const res = await fetch(`/api/admin/materials/${m._id}`, { method: 'DELETE' })
                                  if (res.ok) fetchMaterials(selectedCourse)
                                }}>Delete</Button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

