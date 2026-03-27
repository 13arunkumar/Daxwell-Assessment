'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projectsAPI, tasksAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { CheckSquare, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getStatusColor, getPriorityColor, formatDate } from '@/lib/utils'

export default function TasksPage() {
  const { user } = useAuthStore()
  const [allTasks, setAllTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await projectsAPI.getAll()
        const projectsList = projectsRes.data.data.projects

        setProjects(projectsList)

        // Fetch tasks for all projects
        const tasksPromises = projectsList.map((project: any) =>
          tasksAPI.getByProject(project._id).catch(() => ({ data: { data: { tasks: [] } } }))
        )

        const tasksResults = await Promise.all(tasksPromises)
        const tasks = tasksResults.flatMap((res) => res.data.data.tasks)

        setAllTasks(tasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getFilteredTasks = (filter: string) => {
    switch (filter) {
      case 'my-tasks':
        return allTasks.filter((task) => task.assignedTo?._id === user?.id)
      case 'in-progress':
        return allTasks.filter((task) => task.status === 'in_progress')
      case 'review':
        return allTasks.filter((task) => task.status === 'review')
      case 'completed':
        return allTasks.filter((task) => task.status === 'done')
      default:
        return allTasks
    }
  }

  const filteredTasks = getFilteredTasks(activeTab)

  const TaskCard = ({ task }: { task: any }) => (
    <Link href={`/projects/${task.projectId?._id || task.projectId}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              {task.projectId?.title && (
                <p className="text-xs text-gray-400 mt-2">
                  Project: {typeof task.projectId === 'object' ? task.projectId.title : 'Unknown'}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end ml-4">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                {task.status?.replace('_', ' ')}
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
            {task.milestone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Milestone:</span>
                <span className="font-medium">{task.milestone.title}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-2 text-gray-600">Manage and track all your tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                In Progress
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allTasks.filter((t) => t.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allTasks.filter((t) => t.status === 'done').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500 text-center">
                    {activeTab === 'my-tasks' 
                      ? 'You have no tasks assigned to you'
                      : 'No tasks match the selected filter'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
