import { Routes, Route } from 'react-router-dom'

function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mt-2 text-muted-foreground">Welcome to Skillchang</p>
    </div>
  )
}

function GlobalPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Global Skills</h1>
      <p className="mt-2 text-muted-foreground">Browse all available skills</p>
    </div>
  )
}

function ProjectPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Project</h1>
      <p className="mt-2 text-muted-foreground">Project-specific skills</p>
    </div>
  )
}

export function MainContent() {
  return (
    <main className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/global" element={<GlobalPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </main>
  )
}
