"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Search, User, Github, FileText, RefreshCw } from "lucide-react"
import type { SearchHistory } from "@/lib/types"
import { useSearchHistory } from "@/lib/api"

interface HistorySectionProps {
  history?: SearchHistory
}

export function HistorySection({ history }: HistorySectionProps) {
  const { refetch, isLoading } = useSearchHistory()

  const handleRefresh = () => {
    refetch()
  }

  if (!history || !history.recentSearches || history.recentSearches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Search History
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Search History</h3>
          <p className="text-muted-foreground text-center">Your recent searches will appear here</p>
        </CardContent>
      </Card>
    )
  }

  const getSearchIcon = (search: string) => {
    if (search.startsWith("profile:")) return <User className="h-4 w-4" />
    if (search.startsWith("repos:")) return <Github className="h-4 w-4" />
    if (search.startsWith("readme:")) return <FileText className="h-4 w-4" />
    if (search.startsWith("repo-search:")) return <Search className="h-4 w-4" />
    return <Search className="h-4 w-4" />
  }

  const getSearchType = (search: string) => {
    if (search.startsWith("profile:")) return "Profile"
    if (search.startsWith("repos:")) return "Repositories"
    if (search.startsWith("readme:")) return "README"
    if (search.startsWith("repo-search:")) return "Repository Search"
    return "Search"
  }

  const getSearchQuery = (search: string) => {
    const colonIndex = search.indexOf(":")
    return colonIndex !== -1 ? search.substring(colonIndex + 1) : search
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Search History
            <Badge variant="secondary">{history.recentSearches.length}</Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              {getSearchIcon(search)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {getSearchType(search)}
                  </Badge>
                </div>
                <p className="font-medium truncate">{getSearchQuery(search)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
