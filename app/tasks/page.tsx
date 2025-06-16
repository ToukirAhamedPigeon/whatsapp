"use client"
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Trash } from 'lucide-react'
import React from 'react'

const TaskPage = () => {
    const  tasks = useQuery(api.tasks.getTasks)
    const deleteTask = useMutation(api.tasks.deleteTask)
  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-5xl">
        All Tasks are here in real-time
      </h1>
      {tasks?.map((task)=> (
        <div key={task._id} className='flex gap-2'>
            <span>{task.text}</span>
            <Button variant="default" className="bg-red-500 hover:bg-red-400 text-slate-100 cursor-pointer" onClick={async () => {
                await deleteTask({id:task._id})
            }}><Trash/> Delete Task</Button>
        </div>
      ))}
    </div>
  )
}

export default TaskPage
