'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { projectsAPI, usersAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [projectManagers, setProjectManagers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    projectManagerId: user?.id || '',
    targetLaunchDate: '',
    budget: '',
    status: 'planning',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [clientsRes, pmsRes] = await Promise.all([
          usersAPI.getAll({ role: 'client' }),
          usersAPI.getAll({ role: 'project_manager' }),
        ])
        setClients(clientsRes.data.data.users)
        setProjectManagers(pmsRes.data.data.users)
        
        // Auto-select current user if they're a PM
        if (user?.role === 'project_manager') {
          setFormData(prev => ({ ...prev, projectManagerId: user.id }))
        }
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    fetchUsers()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Project title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Project description is required')
      return
    }
    if (!formData.clientId) {
      setError('Please select a client')
      return
    }
    if (!formData.projectManagerId) {
      setError('Please select a project manager')
      return
    }
    if (!formData.targetLaunchDate) {
      setError('Target launch date is required')
      return
    }

    setIsLoading(true)

    try {
      // Convert date to ISO format
      const targetDate = new Date(formData.targetLaunchDate).toISOString()
      
      const projectData: any = {
        title: formData.title,
        description: formData.description,
        clientId: formData.clientId,
        projectManagerId: formData.projectManagerId,
        targetLaunchDate: targetDate,
        status: formData.status,
      }

      if (formData.budget) {
        projectData.budget = parseFloat(formData.budget)
      }

      const response = await projectsAPI.create(projectData)
      router.push(`/projects/${response.data.data.project._id}`)
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors
        ? err.response.data.errors.map((e: any) => e.message).join(', ')
        : err.response?.data?.message || 'Failed to create project. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">Fill in the details to create a new project</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Website Redesign"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe the project scope, goals, and deliverables..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectManagerId">Project Manager *</Label>
                  <select
                    id="projectManagerId"
                    name="projectManagerId"
                    value={formData.projectManagerId}
                    onChange={handleChange}
                    required
                    disabled={isLoading || user?.role === 'project_manager'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a project manager</option>
                    {projectManagers.map((pm) => (
                      <option key={pm._id} value={pm._id}>
                        {pm.name} ({pm.email})
                      </option>
                    ))}
                  </select>
                  {user?.role === 'project_manager' && (
                    <p className="text-xs text-gray-500">You are automatically assigned as the PM</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetLaunchDate">Target Launch Date *</Label>
                  <Input
                    id="targetLaunchDate"
                    name="targetLaunchDate"
                    type="date"
                    value={formData.targetLaunchDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After creating the project, you can add milestones and tasks from the project detail page.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/projects')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
