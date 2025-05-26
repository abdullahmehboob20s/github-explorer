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

**Example**

```
GET /user/octocat
```

Returns a GitHub user JSON object.

---

### 📦 `GET /user-repos/:username?page=&limit=`

Fetch public repositories of a user.

**Query Parameters**

- `page` (optional, default: `1`)
- `limit` (optional, default: `5`, max: `100`)

**Example**

```
GET /user-repos/octocat?page=2&limit=10
```

---

### 📄 `GET /repo/readme?owner=&repo=`

Fetch the raw README content of a repository.

**Example**

```
GET /repo/readme?owner=octocat&repo=Hello-World
```

Returns plain text Markdown content.

---

### 🔍 `GET /search/repos?q=&page=&limit=`

Search GitHub repositories by keyword.

**Query Parameters**

- `q` (required): search term
- `page` (optional, default: `1`)
- `limit` (optional, default: `5`, max: `100`)

**Example**

```
GET /search/repos?q=java&page=1&limit=10
```

---

### ⭐ `POST /star/user`

Star a GitHub user (stored in memory).

**Request Body**

```json
{
  "username": "octocat"
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
  "recentSearches": ["octocat", "abdullahmehboob20s"]
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
