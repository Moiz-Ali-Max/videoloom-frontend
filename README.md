# VideoLoom

Break the language barrier on video.

VideoLoom is a SaaS platform that makes video content understandable to anyone, regardless of the language it was made in. Drop in a YouTube link and VideoLoom transcribes it, translates it, dubs it into another language, and lets you ask it questions like you would a person who already watched it. No more scrubbing through a two hour video to find the ten seconds you needed.

## Why VideoLoom

Millions of hours of useful video content exist behind a language wall. A student in Karachi cannot fully follow an English lecture. A creator in Lagos cannot reach an audience in Tokyo without a dubbing studio. A researcher does not have time to watch a three hour interview to find one answer.

VideoLoom exists to remove that wall. It is built for:

- Non native speakers who want full access to video content in their own language
- Students and researchers who need answers from a video, not the whole runtime
- Creators who want to reach new markets without hiring a dubbing team
- Anyone who relies on accurate captions and transcripts

## What it does

- **Transcription**: Turns any YouTube video into an accurate, searchable transcript
- **Translation and dubbing**: Converts video audio into another language, including generated speech
- **Chat with video**: Ask questions about a video's content and get answers grounded in what was actually said
- **Smart clips**: Automatically finds and extracts the most relevant moments from a video
- **Playlists**: Organizes processed videos so you can revisit them later

## Tech stack

This repository is the web client for VideoLoom.

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui and Base UI
- TanStack Query

The API this app talks to lives in a separate service repository.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Setup

```bash
git clone git@github-personal:Moiz-Ali-Max/videoloom-frontend.git
cd videoloom-frontend
npm install
```

Create a `.env.local` file in the project root and set the required environment variables (see `.env.example` if present, or ask a maintainer for the current list).

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the codebase
```

## Project structure

The app follows the Next.js App Router convention, with UI components built on shadcn/ui and Base UI, and server state managed through TanStack Query.

## License

All rights reserved. This is proprietary software; source is shared for reference and collaboration only.
