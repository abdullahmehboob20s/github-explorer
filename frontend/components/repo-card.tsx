"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Eye, Calendar, FileText } from "lucide-react"
import type { GitHubRepo } from "@/lib/types"
import { useStarRepo, useRepoReadme } from "@/lib/api"
import { useState } from "react"

interface RepoCardProps {
  repo: GitHubRepo
  compact?: boolean
}

export function RepoCard({ repo, compact = false }: RepoCardProps) {
  const [showReadme, setShowReadme] = useState(false)
  const starRepo = useStarRepo()
  const { data: readme, isLoading: isLoadingReadme } = useRepoReadme(repo.owner.login, repo.name, {
    enabled: showReadme,
  })

  const handleStar = () => {
    starRepo.mutate({ fullName: repo.full_name })
  }

  const toggleReadme = () => {
    setShowReadme(!showReadme)
  }

  return (
    <Card className="w-full">
      <CardHeader className={compact ? "pb-2" : "pb-4"}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold truncate ${compact ? "text-base" : "text-lg"}`}>{repo.name}</h3>
              {repo.fork && (
                <Badge variant="outline" className="text-xs">
                  Fork
                </Badge>
              )}
              {repo.private && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
            </div>

            {repo.description && (
              <p className={`text-muted-foreground mb-3 ${compact ? "text-xs line-clamp-1" : "text-sm line-clamp-2"}`}>
                {repo.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {repo.language && (
                <Badge variant="outline" className="text-xs">
                  {repo.language}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated {new Date(repo.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {!compact && (
            <Button size="sm" variant="outline" onClick={handleStar} disabled={starRepo.isPending}>
              <Star className="h-4 w-4 mr-1" />
              Star
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0 pb-3" : "pt-0"}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{repo.forks_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{repo.watchers_count}</span>
            </div>
          </div>

          {repo.license && (
            <Badge variant="outline" className="text-xs">
              {repo.license.name}
            </Badge>
          )}
        </div>

        {!compact && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleReadme} className="flex-1">
              <FileText className="h-4 w-4 mr-1" />
              {showReadme ? "Hide" : "Show"} README
            </Button>
            <Button size="sm" onClick={() => window.open(repo.html_url, "_blank")}>
              View on GitHub
            </Button>
          </div>
        )}

        {showReadme && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">README</h4>
            {isLoadingReadme ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : readme ? (
              <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{readme}</pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No README found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
