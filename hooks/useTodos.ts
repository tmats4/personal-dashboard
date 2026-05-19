"use client";

import { useEffect, useState } from "react";

export type TodoPriority = "Low" | "Medium" | "High";

export type TodoCategory =
  | "Work"
  | "Personal"
  | "Finance"
  | "Health"
  | "Learning"
  | "Errands";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate: string;
};

const STORAGE_KEY = "personal-dashboard-todos";

type StoredTodo = Partial<Todo>;

function normalizeTodos(rawTodos: unknown): Todo[] {
  if (!Array.isArray(rawTodos)) return [];

  return rawTodos.map((todo): Todo => {
    const storedTodo: StoredTodo =
      todo && typeof todo === "object" ? (todo as StoredTodo) : {};

    return {
      id: storedTodo.id ?? crypto.randomUUID(),
      text: storedTodo.text ?? "",
      completed: storedTodo.completed ?? false,
      priority: storedTodo.priority ?? "Medium",
      category: storedTodo.category ?? "Personal",
      dueDate: storedTodo.dueDate ?? "",
    };
  });
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("Medium");
  const [category, setCategory] = useState<TodoCategory>("Personal");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);

    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Keep localStorage loading client-only without overwriting saved tasks.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTodos(normalizeTodos(parsedTodos));
      } catch {
        setTodos([]);
      }
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hasLoaded]);

  const addTodo = () => {
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedTodo,
      completed: false,
      priority,
      category,
      dueDate,
    };

    setTodos((currentTodos) => [todo, ...currentTodos]);
    setNewTodo("");
    setPriority("Medium");
    setCategory("Personal");
    setDueDate("");
  };

  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const sortedActiveTodos = [...activeTodos].sort((a, b) => {
    const priorityRank = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return priorityRank[b.priority] - priorityRank[a.priority];
  });

  const topThreeTodos = sortedActiveTodos.slice(0, 3);

  return {
    todos,
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
    activeTodos: sortedActiveTodos,
    completedTodos,
    topThreeTodos,
  };
}
