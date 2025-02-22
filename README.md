# CineHub

## 📌 Overview
**CineHub** is a REST API-based **Movie Curation System** that allows users to:
- ✅ Search movies using the **TMDB API**
- ✅ Add movies to a **watchlist, wishlist, or curated lists**
- ✅ Provide **reviews and ratings** for movies
- ✅ Search movies by **genre, actor, or director**
- ✅ Sort movies by **rating or release year**
- ✅ Display **top-rated** movies with detailed reviews

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (using Sequelize ORM)
- **External API:** TMDB API

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/MovieCuration-API.git
cd MovieCuration-API
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file and configure:
```env
PORT=5000
TMDB_API_KEY=your_tmdb_api_key
DATABASE_URL=your_postgres_database_url
```

### 4️⃣ Start the Server
```sh
npm start
```

## 📌 API Endpoints

### 🎬 Movie Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/movies/search` | Search movies using TMDB API |
| `GET` | `/movies/search-by-genre-and-actor` | Search movies by genre and actor |
| `GET` | `/movies/sort` | Sort movies by rating or release year |
| `GET` | `/movies/top5` | Get top 5 movies by rating with detailed reviews |

### 📋 List Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/curated-lists` | Create a curated movie list |
| `PUT` | `/curated-lists/:curatedListId` | Update a curated list |
| `POST` | `/movies/watchlist` | Add a movie to the watchlist |
| `POST` | `/movies/wishlist` | Add a movie to the wishlist |
| `POST` | `/movies/curated-list` | Add a movie to a curated list |

### ⭐ Reviews & Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/movies/:movieId/reviews` | Add a review and rating for a movie |

## 🚀 Future Enhancements
- [ ] Implement user authentication for private lists
- [ ] Add recommendation system based on user preferences
- [ ] Integrate AI-powered movie suggestions
- [ ] 

## 📜 License
This project is licensed under the **MIT License**.

---
Made with ❤️ by Greg

