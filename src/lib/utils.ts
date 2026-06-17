import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getStartOfDay(dateStr: string): Date {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getTodayStr(): string {
  return formatDate(new Date())
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = getStartOfDay(date1)
  const d2 = getStartOfDay(date2)
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

export function isCurrentMonth(dateStr: string): boolean {
  const now = new Date()
  const date = new Date(dateStr)
  return now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth()
}
