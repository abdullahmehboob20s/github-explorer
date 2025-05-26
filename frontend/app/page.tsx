"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Github, Star, History, User, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchUsers, useSearchRepos, useStarredItems, useSearchHistory } from "@/lib/api"
import { UserCard } from "@/components/user-card"
import { RepoCard } from "@/components/repo-card"
import { StarredSection } from "@/components/starred-section"
import { HistorySection } from "@/components/history-section"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"users" | "repos">("users")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("search")
  const pageSize = 10

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: searchUsers,
  } = useSearchUsers(searchQuery, {
    enabled: false,
  })

  const {
    data: repoResults,
    isLoading: isSearchingRepos,
    error: repoSearchError,
    refetch: searchRepos,
  } = useSearchRepos(searchQuery, currentPage, {
    enabled: false,
  })

  const { data: starred, error: starredError } = useStarredItems()
  const {
    data: history,
    error: historyError,
    refetch: refetchHistory,
    isLoading: isLoadingHistory,
  } = useSearchHistory({
    enabled: activeTab === "history",
  })

  // Refetch history when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      refetchHistory()
    }
  }, [activeTab, refetchHistory])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setCurrentPage(1) // Reset to first page on new search

    if (searchType === "users") {
      searchUsers()
    } else {
      searchRepos()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    if (searchType === "repos") {
      searchRepos()
    }
  }

  const handleRetry = () => {
    if (searchType === "users") {
      searchUsers()
    } else {
      searchRepos()
    }
  }

  const renderError = (error: Error | null, onRetry?: () => void) => {
    if (!error) return null

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  const renderPagination = () => {
    if (searchType !== "repos" || !repoResults) return null

    const totalPages = Math.ceil(repoResults.total_count / pageSize)
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isSearchingRepos}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const page = startPage + i
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                disabled={isSearchingRepos}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isSearchingRepos}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="text-sm text-muted-foreground ml-4">
          Page {currentPage} of {totalPages} ({repoResults.total_count.toLocaleString()} total results)
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Github className="h-8 w-8" />
            <h1 className="text-3xl font-bold">GitHub Explorer</h1>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Search ${searchType === "users" ? "GitHub users" : "repositories"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={searchType === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("users")}
              >
                <User className="h-4 w-4 mr-2" />
                Users
              </Button>
              <Button
                variant={searchType === "repos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("repos")}
              >
                <Github className="h-4 w-4 mr-2" />
                Repositories
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="starred">
              <Star className="h-4 w-4 mr-2" />
              Starred ({(starred?.users?.length || 0) + (starred?.repos?.length || 0)})
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            {renderError(searchError, handleRetry)}
            {renderError(repoSearchError, handleRetry)}

            {searchType === "users" && searchResults && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <Badge variant="secondary">{searchResults.length} users found</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {searchType === "repos" && repoResults && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Repository Results</h2>
                  <Badge variant="secondary">{repoResults.total_count.toLocaleString()} repositories found</Badge>
                </div>
                <div className="grid gap-4">
                  {repoResults.items?.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
                {renderPagination()}
              </div>
            )}

            {(isSearching || isSearchingRepos) && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              </div>
            )}

            {!searchResults && !repoResults && !isSearching && !isSearchingRepos && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
                  <p className="text-muted-foreground text-center">
                    Search for GitHub users or repositories to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="starred" className="mt-6">
            {renderError(starredError)}
            <StarredSection starred={starred} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {renderError(historyError, () => refetchHistory())}
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              </div>
            ) : (
              <HistorySection history={history} />
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About GitHub Explorer</CardTitle>
                <CardDescription>A modern React frontend for exploring GitHub users and repositories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Created by</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>EB24210106011</strong>, <a href="https://github.com/abdullahmehboob20s" target="_blank" className="uppercase underline">Abdullah Mehboob</a></li>
                    <li><strong>EB24210106068</strong>, <a href="" target="_blank" className="uppercase underline">Muhammad Hamza</a></li>
                    <li><strong>EB24210106117</strong>, <a href="" target="_blank" className="uppercase underline">Suleman</a></li>
                    <li><strong>EB24210106104</strong>, <a href="" target="_blank" className="uppercase underline">Shahzad</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Search GitHub users and repositories with pagination</li>
                    <li>View detailed user profiles and repositories</li>
                    <li>Read repository README files</li>
                    <li>Star your favorite users and repositories</li>
                    <li>Browse your search history with real-time updates</li>
                    <li>Robust error handling and retry mechanisms</li>
                    <li>Responsive design with dark/light mode</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">TanStack Query</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
