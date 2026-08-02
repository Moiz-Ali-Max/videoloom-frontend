import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JobStatusResponse } from "./types/transcription"
import type { DubbingStatusResponse } from "./types/dubbing"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** result.source ("youtube_captions" | "whisper") is a technical label, not a title — never show it as one. */
export function transcriptionTitle(job: Pick<JobStatusResponse, "title" | "source_type">): string {
  if (job.title) return job.title
  if (job.source_type === "youtube") return "YouTube video"
  if (job.source_type === "local_file") return "Uploaded file"
  return "Untitled transcription"
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function dubbingTitle(job: Pick<DubbingStatusResponse, "title" | "target_language">): string {
  if (job.title) return job.title
  return `Dub → ${capitalize(job.target_language)}`
}

export function clipJobTitle(job: { title: string | null }): string {
  return job.title || "Clip batch"
}

const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

/** "3 hours ago", "in 2 days" — falls back to "just now" for anything under a minute. */
export function timeAgo(iso: string): string {
  const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSeconds)

  for (const [unit, secondsInUnit] of TIME_UNITS) {
    if (abs >= secondsInUnit) {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit)
    }
  }
  return "just now"
}
