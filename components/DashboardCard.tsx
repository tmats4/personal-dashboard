import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}