"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoCard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("personal-dashboard-todos");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("personal-dashboard-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedTodo,
      completed: false,
    };

    setTodos([todo, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const topThreeTodos = todos.filter((todo) => !todo.completed).slice(0, 3);

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

                <span className="text-sm">{todo.text}</span>
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

      <p className="mt-4 text-xs text-zinc-500">
        Saved locally in this browser for now.
      </p>
    </DashboardCard>
  );
}