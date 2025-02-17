const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const sequelize = require('../models/index.js').sequelize;

const axios=require('axios');
const watchList = require('../models/watchList.js');
const wishList = require('../models/wishList.js');
const curatedListItem = require('../models/curatedListItem.js')(sequelize, Sequelize.DataTypes);
require('dotenv').config();
const curatedList=require('../models/curatedList.js')(sequelize, Sequelize.DataTypes);
const movie=require('../models/movie.js')(sequelize, Sequelize.DataTypes);
const watchlist=require('../models/watchList.js')(sequelize, Sequelize.DataTypes);
const wishlist=require('../models/wishList.js')(sequelize, Sequelize.DataTypes);
const review=require('../models/review.js')(sequelize, Sequelize.DataTypes);
async function getActors(movieId){
    try{
    let actors=[];
    const response=await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}`);
    for(let i=0;i<response.data.cast.length;i++){
    if(response.data.cast[i].known_for_department==="Acting"){
         actors.push(response.data.cast[i].name);
    }
}
    actors=actors.slice(0,5).map(actor => `${actor}`).join(',');
    return actors;
}catch(error){
    console.log(error);
}
}
const searchMovies=async (req,res)=>{
    let query=req.query.query;
    if (!process.env.API_KEY) {
        return res.status(500).json({ error: 'API key is missing' });
    }
    try{
    const response=await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.API_KEY}`);
    const movies=[];
    if(response.data.length===0)
         res.status(404).json({error:"No Movie found"});
    const movieList=response.data.results;
    for(let i=0;i<movieList.length;i++){
        movies.push({
            title:movieList[i].title,
            tmdbId:movieList[i].id,
            genre:movieList[i].genre_ids.map(ele => `${ele}`).join(','),
            actors:await getActors(movieList[i].id),
            releaseYear:movieList[i].release_date.slice(0,4),
            rating:movieList[i].vote_average,
            description:movieList[i].overview

        });
    }
    res.status(200).json({movies:movies});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
};

const createCuratedList= async(req,res)=>{
    try{
      const newCuratedList=req.body;
      const response=await curatedList.create(newCuratedList);
      res.status(200).json({'message':'curated list added successfully',response});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
};

const updateCuratedList=async(req,res)=>{
    try{
      const curatedListId=parseInt(req.params.curatedListId);
      const newList=req.body;
      const response=await curatedList.update(
        {    
            name:newList.name,
            description:newList.description
        },
        {
            where:{id:curatedListId},
        },
    );
    const updateList=await curatedList.findByPk(curatedListId);
    res.status(200).json({'message': 'Curated list updated successfully',updateList});

    }catch(error){
        res.status(500).json({error: error.message});
    }
};

async function movieExistsInDB(movieId){
   const response=await movie.findOne({where:{tmdbId:movieId}});
   if(response)
     return true;
   else
     return false; 
}
async function fetchMovieAndCastDetails(tmdbId){
    try{
      const movieDetails=await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.API_KEY}`);
      const actors=await getActors(movieDetails.data.id);
      const response=await movie.create({
         title: movieDetails.data.original_title,
         tmdbId:movieDetails.data.id,
         genre:movieDetails.data.genres.map(ele => ele.name).join(','),
         actors:actors,
         releaseYear:movieDetails.data.release_date.slice(0,4),
         rating:movieDetails.data.vote_average,
         description:movieDetails.data.overview
      });
    }catch(error){
        console.log(error);
    }
}
const createWatchList=async(req,res)=>{
    try{
      const movieId=req.body;
      if(!await movieExistsInDB(movieId.Id)){
         await fetchMovieAndCastDetails(movieId.Id);
      }
      const movieData=await movie.findOne({where:{tmdbId:movieId.Id}})
      const response=await watchlist.create({movieId:movieData.id});
      res.status(200).json({message: 'Movie added to watchList successfully',response});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
};

const createWishList=async(req,res)=>{
    try{
        const movieId=req.body;
        if(!await movieExistsInDB(movieId.Id)){
           await fetchMovieAndCastDetails(movieId.Id);
        }
        const movieData=await movie.findOne({where:{tmdbId:movieId.Id}})
        const response=await wishlist.create({movieId:movieData.id});
        res.status(200).json({message: 'Movie added to wishList successfully',response});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
};

const createCuratedListItem=async(req,res)=>{
    try{
     const newCuratedListItem=req.body;
     if(!await movieExistsInDB(newCuratedListItem.movieId)){
        await fetchMovieAndCastDetails(newCuratedListItem.movieId);
     } 
    if(!await curatedList.findOne({where:{id:newCuratedListItem.curatedListId}}))
        return res.json({message:"curated list is not created"});
    const movieData=await movie.findOne({where:{tmdbId:newCuratedListItem.movieId}});
    const response=await curatedListItem.create(
        {
            curatedListId:newCuratedListItem.curatedListId,
            movieId:movieData.id 
        }
    );
    res.status(200).json({message: 'Movie added to curated list successfully',response});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
};

const searchByGenreAndActor=async(req,res)=>{
    try{
     const genre=req.query.genre;
     const actor=req.query.actor;
     const response=await movie.findAll({
        where:{
            genre:{
                [Op.like]: `%${genre}%`
            },
            actors:{
                [Op.like]: `%${actor}%`
            }
        }
     });
     res.status(200).json({movies:response});

    }catch(error){
        return res.status(500).json({error:error.message});
    }
};

const addReviewsAndRatingsToMovies=async(req,res)=>{
    let movieId=parseFloat(req.params.movieId);
    let newReview=req.body;
    try{
        let response=await review.create({
            movieId:movieId,
            rating:newReview.rating,
            reviewText:newReview.reviewText
        });
    res.status(200).json({message: 'Review added successfully',response});    

    }catch(error){
        res.status(500).json({error:error.message});
    }
};

const sortByRatingOrReleaseYear=async(req,res)=>{
    const list=req.query.list;
    const sortBy=req.query.sortBy;
    const order=req.query.order;
    try{
        
        

    }catch(error){
        res.status(500).json({error:error.message});
    }
};

const getTopFiveMoviesByRatingAndDetailedReview=async(req,res)=>{
    try{
    let allReviews=await review.findAll({
        order:[['rating','DESC']]
    });
    let result=[];
    for(let i=0;i<allReviews.length;i++){
        result.push(
            {
                title:(await movie.findOne({where:{id:allReviews[i].movieId}})).title,
                rating:allReviews[i].rating,
                review:{
                    text:allReviews[i].reviewText,
                    wordCount:allReviews[i].reviewText.trim().split(/\s+/).length,
                }
            }
        )
    }
    res.status(200).json({movies:result});

    }catch(error){
        return res.status(500).json({error:error.message});
    }
};



module.exports={searchMovies,createCuratedList,updateCuratedList,createWatchList,createWishList,createCuratedListItem,searchByGenreAndActor,addReviewsAndRatingsToMovies,sortByRatingOrReleaseYear,getTopFiveMoviesByRatingAndDetailedReview,sortByRatingOrReleaseYear};