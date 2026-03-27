'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projectsAPI, milestonesAPI, tasksAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { getStatusColor, getPriorityColor, formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, MessageSquare, Plus } from 'lucide-react'
import { CreateMilestoneDialog } from '@/components/milestones/CreateMilestoneDialog'
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog'

export default function ProjectDetailPage() {
  const params = useParams()
  const { user } = useAuthStore()
  const [project, setProject] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, milestonesRes, tasksRes] = await Promise.all([
        projectsAPI.getById(params.id as string),
        milestonesAPI.getByProject(params.id as string),
        tasksAPI.getByProject(params.id as string),
      ])

      setProject(projectRes.data.data.project)
      setMilestones(milestonesRes.data.data.milestones)
      setTasks(tasksRes.data.data.tasks)
    } catch (error) {
      console.error('Error fetching project details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchProjectDetails()
    }
  }, [params.id])

  const handleMilestoneCreated = () => {
    fetchProjectDetails()
  }

  const handleTaskCreated = () => {
    fetchProjectDetails()
  }

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      await milestonesAPI.approve(milestoneId)
      const milestonesRes = await milestonesAPI.getByProject(params.id as string)
      setMilestones(milestonesRes.data.data.milestones)
    } catch (error) {
      console.error('Error approving milestone:', error)
    }
  }

  const handleRejectMilestone = async (milestoneId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      await milestonesAPI.reject(milestoneId, { reason })
      const milestonesRes = await milestonesAPI.getByProject(params.id as string)
      setMilestones(milestonesRes.data.data.milestones)
    } catch (error) {
      console.error('Error rejecting milestone:', error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{project.clientId?.name}</p>
              <p className="text-sm text-gray-500">{project.clientId?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{project.projectManagerId?.name}</p>
              <p className="text-sm text-gray-500">{project.projectManagerId?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Target Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{formatDate(project.targetLaunchDate)}</p>
              <p className="text-sm text-gray-500">{project.totalProgress}% Complete</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="milestones" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            {(user?.role === 'admin' || user?.role === 'project_manager') && (
              <div className="flex gap-2">
                <Button onClick={() => setShowMilestoneDialog(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
                <Button onClick={() => setShowTaskDialog(true)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="milestones" className="space-y-4 mt-6">
            {milestones.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No milestones found for this project
                </CardContent>
              </Card>
            ) : (
              milestones.map((milestone) => (
                <Card key={milestone._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{milestone.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-2">{milestone.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                        {milestone.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Due Date:</span>
                        <span className="font-medium">{formatDate(milestone.dueDate)}</span>
                      </div>

                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Deliverables:</h4>
                          <ul className="space-y-2">
                            {milestone.deliverables.map((del: any, index: number) => (
                              <li key={index} className="text-sm">
                                <a
                                  href={del.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {del.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {user?.role === 'client' && milestone.status === 'review' && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            size="sm"
                            onClick={() => handleApproveMilestone(milestone._id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectMilestone(milestone._id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Request Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No tasks found for this project
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card key={task._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-2">{task.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {task.assignedTo && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Assigned to:</span>
                          <span className="font-medium">{task.assignedTo.name}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Due Date:</span>
                          <span className="font-medium">{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      {task.comments && task.comments.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateMilestoneDialog
          projectId={params.id as string}
          open={showMilestoneDialog}
          onOpenChange={setShowMilestoneDialog}
          onSuccess={handleMilestoneCreated}
        />
        <CreateTaskDialog
          projectId={params.id as string}
          open={showTaskDialog}
          onOpenChange={setShowTaskDialog}
          onSuccess={handleTaskCreated}
        />
      </div>
    </DashboardLayout>
  )
}
