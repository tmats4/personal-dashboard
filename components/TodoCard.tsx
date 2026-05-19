"use client";

import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import { useTodos } from "@/hooks/useTodos";

export default function TodoCard() {
  const {
    newTodo,
    setNewTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    topThreeTodos,
  } = useTodos();

  return (
    <DashboardCard title="Top 3 To-Dos">
      <div className="flex gap-2">
        <input
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTodo();
          }}
          placeholder="Add a task..."
          className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-400"
        />

        <button
          onClick={addTodo}
          className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-white"
        >
          Add
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {topThreeTodos.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No active tasks. Add your first one above.
          </p>
        ) : (
          topThreeTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4"
                />

                <div>
                  <span className="text-sm">{todo.text}</span>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>{todo.priority}</span>
                    <span>/</span>
                    <span>{todo.category}</span>
                    {todo.dueDate && (
                      <>
                        <span>/</span>
                        <span>Due {todo.dueDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </label>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm text-zinc-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Saved locally in this browser for now.
        </p>

        <Link href="/tasks" className="text-sm text-zinc-400 hover:text-zinc-100">
          View all -&gt;
        </Link>
      </div>
    </DashboardCard>
  );
}
