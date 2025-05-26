"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User, Github } from "lucide-react"
import type { StarredItems } from "@/lib/types"

interface StarredSectionProps {
  starred?: StarredItems
}

export function StarredSection({ starred }: StarredSectionProps) {
  if (!starred) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Stars Yet</h3>
          <p className="text-muted-foreground text-center">Star some users and repositories to see them here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Starred Users */}
      {starred.users && starred.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Starred Users
              <Badge variant="secondary">{starred.users.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {starred.users.map((username) => (
                <div
                  key={username}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{username}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Starred Repositories */}
      {starred.repos && starred.repos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Starred Repositories
              <Badge variant="secondary">{starred.repos.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {starred.repos.map((repoName) => (
                <div
                  key={repoName}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{repoName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!starred.users || starred.users.length === 0) && (!starred.repos || starred.repos.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stars Yet</h3>
            <p className="text-muted-foreground text-center">Star some users and repositories to see them here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
