"use client";

import { Separator } from "@/components/ui/separator";
import type { TaskType } from "@/types/firestore";
import TaskList from "@/components/ui-elements/task-list";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase";

export default function TodoMain({ uid }: { uid: string }) {
  const [tasks, setTasks] = useState<(TaskType & { id: string })[]>([]);
  const q = query(collection(db, uid, "userInfo", "tasks"));
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks: (TaskType & { id: string })[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as TaskType),
      }));
      setTasks(newTasks);
    });
    return () => unsubscribe();
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="flex flex-1">
      <div className="flex w-1/3 flex-col gap-4 p-2">
        <h2 className="text-xl font-bold">Todo</h2>
        <TaskList uid={uid} tasks={todoTasks} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex w-1/3 flex-col gap-4 p-2">
        <h2 className="text-xl font-bold">Doing</h2>
        <TaskList uid={uid} tasks={doingTasks} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex w-1/3 flex-col gap-4 p-2">
        <h2 className="text-xl font-bold">Done</h2>
        <TaskList uid={uid} tasks={doneTasks} />
      </div>
    </div>
  );
}
