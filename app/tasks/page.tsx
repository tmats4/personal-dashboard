"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  Todo,
  TodoCategory,
  TodoPriority,
  useTodos,
} from "@/hooks/useTodos";

type PriorityFilter = "All" | TodoPriority;
type CategoryFilter = "All" | TodoCategory;
type DueFilter = "All" | "Today" | "Overdue" | "No date";

const priorityOptions: PriorityFilter[] = ["All", "High", "Medium", "Low"];
const categoryOptions: CategoryFilter[] = [
  "All",
  "Work",
  "Personal",
  "Finance",
  "Health",
  "Learning",
  "Errands",
];
const dueOptions: DueFilter[] = ["All", "Today", "Overdue", "No date"];

function getTodayDateValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

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

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [dueFilter, setDueFilter] = useState<DueFilter>("All");

  const todayDateValue = getTodayDateValue();
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredActiveTodos = useMemo(
    () =>
      activeTodos.filter((todo) =>
        matchesTaskFilters({
          todo,
          categoryFilter,
          dueFilter,
          normalizedSearchTerm,
          priorityFilter,
          todayDateValue,
        })
      ),
    [
      activeTodos,
      categoryFilter,
      dueFilter,
      normalizedSearchTerm,
      priorityFilter,
      todayDateValue,
    ]
  );

  const filteredCompletedTodos = useMemo(
    () =>
      completedTodos.filter((todo) =>
        matchesTaskFilters({
          todo,
          categoryFilter,
          dueFilter,
          normalizedSearchTerm,
          priorityFilter,
          todayDateValue,
        })
      ),
    [
      completedTodos,
      categoryFilter,
      dueFilter,
      normalizedSearchTerm,
      priorityFilter,
      todayDateValue,
    ]
  );

  const highPriorityActiveCount = activeTodos.filter(
    (todo) => todo.priority === "High"
  ).length;
  const dueTodayActiveCount = activeTodos.filter(
    (todo) => todo.dueDate === todayDateValue
  ).length;
  const hasActiveFilters =
    normalizedSearchTerm ||
    priorityFilter !== "All" ||
    categoryFilter !== "All" ||
    dueFilter !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setDueFilter("All");
  };

  return (
    <>
      <AppHeader />

      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Tasks</h1>

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

          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <TaskStat label="Active" value={activeTodos.length} />
            <TaskStat label="Completed" value={completedTodos.length} />
            <TaskStat label="High Priority" value={highPriorityActiveCount} />
            <TaskStat label="Due Today" value={dueTodayActiveCount} />
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Find Tasks</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Filter your task list without changing saved tasks.
                </p>
              </div>

              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks..."
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-400"
              />

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                {priorityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value as CategoryFilter)
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

              <select
                value={dueFilter}
                onChange={(event) =>
                  setDueFilter(event.target.value as DueFilter)
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                {dueOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-xl font-semibold">
              Active Tasks ({filteredActiveTodos.length})
            </h2>

            <div className="flex flex-col gap-3">
              {filteredActiveTodos.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  {hasActiveFilters
                    ? "No active tasks match the current filters."
                    : "No active tasks."}
                </p>
              ) : (
                filteredActiveTodos.map((todo) => (
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
              Completed Tasks ({filteredCompletedTodos.length})
            </h2>

            <div className="flex flex-col gap-3">
              {filteredCompletedTodos.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  {hasActiveFilters
                    ? "No completed tasks match the current filters."
                    : "No completed tasks yet."}
                </p>
              ) : (
                filteredCompletedTodos.map((todo) => (
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
    </>
  );
}

function matchesTaskFilters({
  todo,
  categoryFilter,
  dueFilter,
  normalizedSearchTerm,
  priorityFilter,
  todayDateValue,
}: {
  todo: Todo;
  categoryFilter: CategoryFilter;
  dueFilter: DueFilter;
  normalizedSearchTerm: string;
  priorityFilter: PriorityFilter;
  todayDateValue: string;
}) {
  const matchesSearch =
    !normalizedSearchTerm ||
    todo.text.toLowerCase().includes(normalizedSearchTerm);
  const matchesPriority =
    priorityFilter === "All" || todo.priority === priorityFilter;
  const matchesCategory =
    categoryFilter === "All" || todo.category === categoryFilter;
  const matchesDue =
    dueFilter === "All" ||
    (dueFilter === "Today" && todo.dueDate === todayDateValue) ||
    (dueFilter === "Overdue" &&
      Boolean(todo.dueDate) &&
      todo.dueDate < todayDateValue) ||
    (dueFilter === "No date" && !todo.dueDate);

  return matchesSearch && matchesPriority && matchesCategory && matchesDue;
}

function TaskStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
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
