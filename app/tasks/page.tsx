"use client";

import Link from "next/link";
import { Todo, useTodos } from "@/hooks/useTodos";

export default function TasksPage() {
  const {
    newTodo,
    setNewTodo,
    priority,
    setPriority,
    category,
    setCategory,
    dueDate,
    setDueDate,
    addTodo,
    toggleTodo,
    deleteTodo,
    activeTodos,
    completedTodos,
  } = useTodos();

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-4xl font-bold">Tasks</h1>

          <p className="mt-3 text-zinc-400">
            Full task list with priority, category, and due date.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
            <input
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addTodo();
              }}
              placeholder="Add a task..."
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-400"
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as "Low" | "Medium" | "High")
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as
                    | "Work"
                    | "Personal"
                    | "Finance"
                    | "Health"
                    | "Learning"
                    | "Errands"
                )
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Finance</option>
              <option>Health</option>
              <option>Learning</option>
              <option>Errands</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
            />

            <button
              onClick={addTodo}
              className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-white"
            >
              Add
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="mb-4 text-xl font-semibold">
            Active Tasks ({activeTodos.length})
          </h2>

          <div className="flex flex-col gap-3">
            {activeTodos.length === 0 ? (
              <p className="text-sm text-zinc-400">No active tasks.</p>
            ) : (
              activeTodos.map((todo) => (
                <TaskRow
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="mb-4 text-xl font-semibold">
            Completed Tasks ({completedTodos.length})
          </h2>

          <div className="flex flex-col gap-3">
            {completedTodos.length === 0 ? (
              <p className="text-sm text-zinc-400">No completed tasks yet.</p>
            ) : (
              completedTodos.map((todo) => (
                <TaskRow
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function TaskRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4"
        />

        <span
          className={`text-sm ${
            todo.completed ? "text-zinc-500 line-through" : "text-zinc-100"
          }`}
        >
          {todo.text}
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
          {todo.priority}
        </span>

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
          {todo.category}
        </span>

        {todo.dueDate && (
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
            Due {todo.dueDate}
          </span>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="ml-2 text-sm text-zinc-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}