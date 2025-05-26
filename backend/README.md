# 🌐 GitHub Explorer API (Java Backend)

A simple RESTful backend application built with **pure Java (no frameworks)** that interacts with the [GitHub REST API](https://docs.github.com/en/rest) to search users, list repositories, read READMEs, and manage starred users/repos — all using basic HTTP handling.

---

## 🚀 Getting Started

### 📦 Requirements

- Java 11+
- GitHub internet access (no auth required for public endpoints)
- Postman or browser for testing

---

## 🔗 Base URL

```
http://localhost:8000/api
```

---

## 📡 API Endpoints

### ✅ `GET /ping`

Check if the backend server is alive.

**Response**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 👤 `GET /user/:username`

Fetch a GitHub user profile.

**Request**

```
GET /user/octocat
```

**Response**

```json
{
  "login": "abdullahmehboob20s",
  "id": 64467248,
  "node_id": "MDQ6VXNlcjY0NDY3MjQ4",
  "avatar_url": "https://avatars.githubusercontent.com/u/64467248?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/abdullahmehboob20s",
  "html_url": "https://github.com/abdullahmehboob20s",
  "followers_url": "https://api.github.com/users/abdullahmehboob20s/followers",
  "following_url": "https://api.github.com/users/abdullahmehboob20s/following{/other_user}",
  "gists_url": "https://api.github.com/users/abdullahmehboob20s/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/abdullahmehboob20s/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/abdullahmehboob20s/subscriptions",
  "organizations_url": "https://api.github.com/users/abdullahmehboob20s/orgs",
  "repos_url": "https://api.github.com/users/abdullahmehboob20s/repos",
  "events_url": "https://api.github.com/users/abdullahmehboob20s/events{/privacy}",
  "received_events_url": "https://api.github.com/users/abdullahmehboob20s/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "ABDULLAH MEHBOOB",
  "company": "none",
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": "Fullstack React & Node.js Developer ",
  "twitter_username": null,
  "public_repos": 166,
  "public_gists": 6,
  "followers": 27,
  "following": 19,
  "created_at": "2020-04-28T09:20:08Z",
  "updated_at": "2025-05-17T08:51:58Z"
}
```

or

```json
{ "error": "GitHub user not found" }
```

---

## ✅ **GET** `/user-repos/:username?page=&limit=`

Fetch public repositories of a user.

**Query Parameters**

- `page` (optional, default: `1`)
- `limit` (optional, default: `5`, max: `100`)

**Request**

```
GET /user-repos/abdullahmehboob20s?page=1&limit=1
```

**Response**

```json
[
  {
    "id": 460715049,
    "node_id": "R_kgDOG3X0KQ",
    "name": "30-seconds-of-react",
    "full_name": "abdullahmehboob20s/30-seconds-of-react",
    "private": false,
    "owner": {
      "login": "abdullahmehboob20s",
      "id": 64467248,
      "node_id": "MDQ6VXNlcjY0NDY3MjQ4",
      "avatar_url": "https://avatars.githubusercontent.com/u/64467248?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/abdullahmehboob20s",
      "html_url": "https://github.com/abdullahmehboob20s",
      "followers_url": "https://api.github.com/users/abdullahmehboob20s/followers",
      "following_url": "https://api.github.com/users/abdullahmehboob20s/following{/other_user}",
      "gists_url": "https://api.github.com/users/abdullahmehboob20s/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/abdullahmehboob20s/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/abdullahmehboob20s/subscriptions",
      "organizations_url": "https://api.github.com/users/abdullahmehboob20s/orgs",
      "repos_url": "https://api.github.com/users/abdullahmehboob20s/repos",
      "events_url": "https://api.github.com/users/abdullahmehboob20s/events{/privacy}",
      "received_events_url": "https://api.github.com/users/abdullahmehboob20s/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "html_url": "https://github.com/abdullahmehboob20s/30-seconds-of-react",
    "description": "Short React code snippets for all your development needs",
    "fork": true,
    "url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react",
    "forks_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/forks",
    "keys_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/teams",
    "hooks_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/hooks",
    "issue_events_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/issues/events{/number}",
    "events_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/events",
    "assignees_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/assignees{/user}",
    "branches_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/branches{/branch}",
    "tags_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/tags",
    "blobs_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/languages",
    "stargazers_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/stargazers",
    "contributors_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/contributors",
    "subscribers_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/subscribers",
    "subscription_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/subscription",
    "commits_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/contents/{+path}",
    "compare_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/merges",
    "archive_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/downloads",
    "issues_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/issues{/number}",
    "pulls_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/labels{/name}",
    "releases_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/releases{/id}",
    "deployments_url": "https://api.github.com/repos/abdullahmehboob20s/30-seconds-of-react/deployments",
    "created_at": "2022-02-18T04:55:54Z",
    "updated_at": "2023-10-23T17:42:33Z",
    "pushed_at": "2022-02-10T18:37:42Z",
    "git_url": "git://github.com/abdullahmehboob20s/30-seconds-of-react.git",
    "ssh_url": "git@github.com:abdullahmehboob20s/30-seconds-of-react.git",
    "clone_url": "https://github.com/abdullahmehboob20s/30-seconds-of-react.git",
    "svn_url": "https://github.com/abdullahmehboob20s/30-seconds-of-react",
    "homepage": "https://www.30secondsofcode.org/react/p/1",
    "size": 3861,
    "stargazers_count": 1,
    "watchers_count": 1,
    "language": null,
    "has_issues": false,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": {
      "key": "cc-by-4.0",
      "name": "Creative Commons Attribution 4.0 International",
      "spdx_id": "CC-BY-4.0",
      "url": "https://api.github.com/licenses/cc-by-4.0",
      "node_id": "MDc6TGljZW5zZTI1"
    },
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 1,
    "default_branch": "master"
  }
]
```

---

## ✅ GET `/repo/readme?owner=&repo=`

Fetch the raw README content of a repository.

**Request**

```
GET /repo/readme?owner=abdullahmehboob20s&repo=abdullahmehboob20s
```

**Response**

```md
<h1>Hi 👋, I'm Abdullah Mehboob</h1>
<h3>A passionate Frontend Developer from Pakistan</h3>

# Freelancer On [Fiver](https://www.fiverr.com/abdullahmaaz17?public_mode=true) And [Upwork](https://www.upwork.com/freelancers/~0137206d2c20045e44)

<br />
.....
```

---

## ✅ GET `/search/repos?q=&page=&limit=`

Search GitHub repositories by keyword.

**Query Parameters**

- `q` (required): search term
- `page` (optional, default: `1`)
- `limit` (optional, default: `5`, max: `100`)

**Request**

```
GET /search/repos?q=html&page=1&limit=1
```

**Response**

```json
{
  "total_count": 3358588,
  "incomplete_results": false,
  "items": [
    {
      "id": 11969507,
      "node_id": "MDEwOlJlcG9zaXRvcnkxMTk2OTUwNw==",
      "name": "html",
      "full_name": "whatwg/html",
      "private": false,
      "owner": {
        "login": "whatwg",
        "id": 2226336,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjIyMjYzMzY=",
        "avatar_url": "https://avatars.githubusercontent.com/u/2226336?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/whatwg",
        "html_url": "https://github.com/whatwg",
        "followers_url": "https://api.github.com/users/whatwg/followers",
        "following_url": "https://api.github.com/users/whatwg/following{/other_user}",
        "gists_url": "https://api.github.com/users/whatwg/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/whatwg/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/whatwg/subscriptions",
        "organizations_url": "https://api.github.com/users/whatwg/orgs",
        "repos_url": "https://api.github.com/users/whatwg/repos",
        "events_url": "https://api.github.com/users/whatwg/events{/privacy}",
        "received_events_url": "https://api.github.com/users/whatwg/received_events",
        "type": "Organization",
        "user_view_type": "public",
        "site_admin": false
      },
      "html_url": "https://github.com/whatwg/html",
      "description": "HTML Standard",
      "fork": false,
      "url": "https://api.github.com/repos/whatwg/html",
      "forks_url": "https://api.github.com/repos/whatwg/html/forks",
      "keys_url": "https://api.github.com/repos/whatwg/html/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/whatwg/html/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/whatwg/html/teams",
      "hooks_url": "https://api.github.com/repos/whatwg/html/hooks",
      "issue_events_url": "https://api.github.com/repos/whatwg/html/issues/events{/number}",
      "events_url": "https://api.github.com/repos/whatwg/html/events",
      "assignees_url": "https://api.github.com/repos/whatwg/html/assignees{/user}",
      "branches_url": "https://api.github.com/repos/whatwg/html/branches{/branch}",
      "tags_url": "https://api.github.com/repos/whatwg/html/tags",
      "blobs_url": "https://api.github.com/repos/whatwg/html/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/whatwg/html/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/whatwg/html/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/whatwg/html/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/whatwg/html/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/whatwg/html/languages",
      "stargazers_url": "https://api.github.com/repos/whatwg/html/stargazers",
      "contributors_url": "https://api.github.com/repos/whatwg/html/contributors",
      "subscribers_url": "https://api.github.com/repos/whatwg/html/subscribers",
      "subscription_url": "https://api.github.com/repos/whatwg/html/subscription",
      "commits_url": "https://api.github.com/repos/whatwg/html/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/whatwg/html/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/whatwg/html/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/whatwg/html/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/whatwg/html/contents/{+path}",
      "compare_url": "https://api.github.com/repos/whatwg/html/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/whatwg/html/merges",
      "archive_url": "https://api.github.com/repos/whatwg/html/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/whatwg/html/downloads",
      "issues_url": "https://api.github.com/repos/whatwg/html/issues{/number}",
      "pulls_url": "https://api.github.com/repos/whatwg/html/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/whatwg/html/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/whatwg/html/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/whatwg/html/labels{/name}",
      "releases_url": "https://api.github.com/repos/whatwg/html/releases{/id}",
      "deployments_url": "https://api.github.com/repos/whatwg/html/deployments",
      "created_at": "2013-08-08T06:26:07Z",
      "updated_at": "2025-05-26T05:48:42Z",
      "pushed_at": "2025-05-26T05:48:34Z",
      "git_url": "git://github.com/whatwg/html.git",
      "ssh_url": "git@github.com:whatwg/html.git",
      "clone_url": "https://github.com/whatwg/html.git",
      "svn_url": "https://github.com/whatwg/html",
      "homepage": "https://html.spec.whatwg.org/multipage/",
      "size": 767367,
      "stargazers_count": 8551,
      "watchers_count": 8551,
      "language": "HTML",
      "has_issues": true,
      "has_projects": false,
      "has_downloads": true,
      "has_wiki": true,
      "has_pages": false,
      "has_discussions": false,
      "forks_count": 2883,
      "mirror_url": null,
      "archived": false,
      "disabled": false,
      "open_issues_count": 2224,
      "license": {
        "key": "other",
        "name": "Other",
        "spdx_id": "NOASSERTION",
        "url": null,
        "node_id": "MDc6TGljZW5zZTA="
      },
      "allow_forking": true,
      "is_template": false,
      "web_commit_signoff_required": false,
      "topics": [
        "canvas",
        "eventsource",
        "html",
        "html-standard",
        "standard",
        "storage",
        "whatwg",
        "workers"
      ],
      "visibility": "public",
      "forks": 2883,
      "open_issues": 2224,
      "watchers": 8551,
      "default_branch": "main",
      "score": 1.0
    }
  ]
}
```

---

## ✅ POST `/star/user`

Star a GitHub user (stored in memory).

**Request Body**

```json
{
  "username": "abdullahmehboob20s"
}
```

**Response**

```json
{
  "message": "User 'octocat' starred successfully"
}
```

---

### ⭐ `POST /star/repo`

Star a GitHub repository (stored in memory).

**Request Body**

```json
{
  "fullName": "octocat/Hello-World"
}
```

**Response**

```json
{
  "message": "Repository 'octocat/Hello-World' starred successfully"
}
```

---

### ⭐ `GET /stars`

View all starred users and repositories.

**Response**

```json
{
  "users": ["octocat"],
  "repos": ["octocat/Hello-World"]
}
```

---

### 🕘 `GET /history`

View recently searched GitHub usernames.

**Response**

```json
{
  "recentSearches": [
    "repo-search:html",
    "readme:abdullahmehboob20s/abdullahmehboob20s",
    "repos:abdullahmehboob20s",
    "profile:abdullahmehboob20s"
  ]
}
```

---

## 🛠 Built With

- Java (`HttpServer`, `HttpHandler`)
- GitHub REST API
- In-memory storage using `List`, `LinkedList`
- Easily extendable with MongoDB or custom data structures

---

## 📄 License

This project is built for educational purposes and can be reused freely with attribution.
