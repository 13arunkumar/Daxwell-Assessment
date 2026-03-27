'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { projectsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Plus, FolderKanban, ArrowRight, CalendarDays, CircleDashed, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { getStatusColor, formatDate } from '@/lib/utils'

export default function ProjectsPage() {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll()
        setProjects(response.data.data.projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const averageProgress = projects.length
    ? Math.round(projects.reduce((sum, project) => sum + (project.totalProgress || 0), 0) / projects.length)
    : 0

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="surface-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="relative">
              <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute left-24 top-16 h-24 w-24 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Projects Command Center
                </div>
                <h1 className="max-w-2xl text-4xl font-bold text-slate-950 sm:text-5xl">
                  Build a project hub your clients actually trust.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Organize milestones, owners, and delivery timelines in a workspace that looks premium from the first click.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(user?.role === 'admin' || user?.role === 'project_manager') && (
                    <Link href="/projects/new">
                      <Button className="h-12 rounded-2xl px-5 text-sm font-semibold shadow-lg shadow-blue-200/80">
                        <Plus className="mr-2 h-4 w-4" />
                        Launch New Project
                      </Button>
                    </Link>
                  )}
                  <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                    Keep launches, reviews, and approvals visible.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)]">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active Board</p>
                <p className="mt-4 font-display text-4xl font-bold">{projects.length}</p>
                <p className="mt-2 text-sm text-slate-300">Projects currently visible in your workspace.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-blue-50/90 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Delivery Pulse</p>
                <p className="mt-4 font-display text-4xl font-bold text-slate-950">{averageProgress}%</p>
                <p className="mt-2 text-sm text-slate-600">Average momentum across your project portfolio.</p>
              </div>
              <div className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/80 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-700/70">Next Step</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">
                  {projects.length ? 'Review delivery cards below.' : 'Create your first flagship project.'}
                </p>
                <p className="mt-2 text-sm text-slate-600">Use the board to manage deadlines, PM ownership, and client visibility.</p>
              </div>
            </div>
          </div>
        </section>

        {projects.length === 0 ? (
          <Card className="surface-panel rounded-[2rem] border-white/70">
            <CardContent className="grid gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-12">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]">
                <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <FolderKanban className="h-7 w-7 text-cyan-200" />
                </div>
                <h3 className="mt-6 text-3xl font-bold">No projects yet</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  Turn this blank board into a client-facing command center with timelines, approvals, and transparent progress.
                </p>
                <div className="mt-8 grid gap-3 text-sm">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CircleDashed className="h-4 w-4 text-cyan-200" />
                    Create a flagship project space
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CircleDashed className="h-4 w-4 text-cyan-200" />
                    Assign a client and project manager
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CircleDashed className="h-4 w-4 text-cyan-200" />
                    Add milestones and delivery tasks next
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700/70">First Impression</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                  Give the board a project worth looking at.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  A polished workspace starts with one strong project setup. Add the title, client, PM, launch date, and then build milestones from there.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {(user?.role === 'admin' || user?.role === 'project_manager') && (
                    <Link href="/projects/new">
                      <Button className="h-12 rounded-2xl px-5 text-sm font-semibold shadow-lg shadow-blue-200/80">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </Link>
                  )}
                  <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                    Project setup takes less than two minutes
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <Link key={project._id} href={`/projects/${project._id}`}>
                <Card className="surface-panel h-full cursor-pointer overflow-hidden rounded-[1.75rem] border-white/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(37,99,235,0.45)]">
                  <CardHeader className="border-b border-slate-100/80 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Project Board</p>
                        <CardTitle className="text-2xl text-slate-950">{project.title}</CardTitle>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 line-clamp-2 text-sm leading-7 text-slate-600">{project.description}</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                        <span className="text-slate-500">Client</span>
                        <span className="font-semibold text-slate-900">{project.clientId?.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                        <span className="text-slate-500">Project Manager</span>
                        <span className="font-semibold text-slate-900">{project.projectManagerId?.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                        <span className="text-slate-500">Target Launch</span>
                        <span className="font-semibold text-slate-900">{formatDate(project.targetLaunchDate)}</span>
                      </div>
                      <div className="mt-2 rounded-[1.5rem] bg-gradient-to-r from-slate-950 to-blue-950 p-5 text-white">
                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <span className="font-semibold">{project.totalProgress}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-white/15">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 transition-all"
                            style={{ width: `${project.totalProgress}%` }}
                          ></div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-300">
                          <span>Open Workspace</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
