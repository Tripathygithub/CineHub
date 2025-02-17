const route=require('express').Router();
const {searchMovies,createCuratedList,updateCuratedList, createWatchList,createWishList, createCuratedListItem,searchByGenreAndActor,addReviewsAndRatingsToMovies,sortByRatingOrReleaseYear,getTopFiveMoviesByRatingAndDetailedReview}=require('../controllers/controller');

route.get('/movies/search',searchMovies);
route.post('/curated-lists',createCuratedList);
route.put('/curated-lists/:curatedListId',updateCuratedList);
route.post('/movies/watchlist',createWatchList);
route.post('/movies/wishlist',createWishList);
route.post('/movies/curated-list',createCuratedListItem);
route.get('/movies/search-by-genre-and-actor',searchByGenreAndActor);
route.post('/movies/:movieId/reviews',addReviewsAndRatingsToMovies);
route.get('/movies/sort',sortByRatingOrReleaseYear);
route.get('/movies/top5',getTopFiveMoviesByRatingAndDetailedReview);

module.exports=route;