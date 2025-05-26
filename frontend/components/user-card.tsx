"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, GitFork, MapPin, Building, Calendar } from "lucide-react"
import type { GitHubUser } from "@/lib/types"
import { useStarUser, useUserRepos } from "@/lib/api"
import { RepoCard } from "./repo-card"

interface UserCardProps {
  user: GitHubUser
  showRepos?: boolean
}

export function UserCard({ user, showRepos = false }: UserCardProps) {
  const [showUserRepos, setShowUserRepos] = useState(showRepos)
  const starUser = useStarUser()
  const { data: repos, isLoading: isLoadingRepos } = useUserRepos(user.login, {
    enabled: showUserRepos,
  })

  const handleStar = () => {
    starUser.mutate({ username: user.login })
  }

  const toggleRepos = () => {
    setShowUserRepos(!showUserRepos)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.login} />
            <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{user.name || user.login}</h3>
              {user.name && (
                <Badge variant="secondary" className="text-xs">
                  @{user.login}
                </Badge>
              )}
            </div>

            {user.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>}

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {user.company}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {new Date(user.created_at).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{user.followers}</span>
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span className="font-medium">{user.public_repos}</span>
              <span className="text-muted-foreground">repos</span>
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={handleStar} disabled={starUser.isPending}>
            <Star className="h-4 w-4 mr-1" />
            Star
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleRepos} className="flex-1">
            {showUserRepos ? "Hide" : "Show"} Repositories
          </Button>
          <Button size="sm" onClick={() => window.open(user.html_url, "_blank")}>
            View on GitHub
          </Button>
        </div>

        {showUserRepos && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium">Repositories</h4>
            {isLoadingRepos ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : repos && repos.length > 0 ? (
              <div className="space-y-3">
                {repos.slice(0, 3).map((repo) => (
                  <RepoCard key={repo.id} repo={repo} compact />
                ))}
                {repos.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {repos.length - 3} more repositories...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No public repositories</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
