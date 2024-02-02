const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const fetchMovies = () => {
  return JSON.parse(fs.readFileSync("./data/videos.json"));
};

const addMovie = (newMovie) => {
    const freshMovieList = fetchMovies();
    // freshMovieList.push(newMovie);
    // fs.writeFileSync("../data/movies.json", JSON.stringify(freshMovieList));
    fs.writeFileSync("./data/movies.json", JSON.stringify([...freshMovieList, newMovie]));
    return newMovie;
  }

router.route("/")
.get((req, res) => {
  try {
    const videoList = fetchMovies();
    // If fetchMovies() succeeds, return the video list
    res.status(200).json(videoList);
  } catch (error) {
    // If there's an error fetching the video list, return an error response
    console.error("Error fetching video list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
.post((req, res) =>{
    const {title , description} = req.body;
    const videoId = uuidv4();
    const image = 'oscar.jpg'
    const videoRes = {
      id: videoId,
      title: title,
      description: description,
      image: image
    }
    const newVideo = generateRandomContent(videoRes);
    res.status(200).json(newVideo)
})



// Function to generate random content for missing keys
function generateRandomContent(videoObj) {
  // Generate random values for missing keys
  const randomChannel = 'Random Channel'; // Example random channel
  const randomViews = Math.floor(Math.random() * 1000000).toLocaleString();
  const randomLikes = Math.floor(Math.random() * 100000).toLocaleString();
  const randomDuration = `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
  const randomTimestamp = Date.now() - Math.floor(Math.random() * 10000000000); // Random timestamp within the last few months
  const defaultComments = generateComments();

  // Combine provided and random values
  return {
    ...videoObj,
    channel: randomChannel,
    views: randomViews,
    likes: randomLikes,
    duration: randomDuration,
    timestamp: randomTimestamp,
    comments: defaultComments
  };
}
const generateComments = () =>{
  const defaultComments = [
    {
      id: uuidv4(),
      name: 'User 1',
      comment: 'Wow, what an incredible video! The cinematography is stunning, and the storytelling is captivating.',
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000)
    },
    {
      id: uuidv4(),
      name: 'User 2',
      comment: 'Absolutely mesmerizing! I was completely drawn into the world of this video from the very beginning.',
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000)
    },
    {
      id: uuidv4(),
      name: 'User 3',
      comment: 'This video is beyond words. It evokes such a range of emotions and leaves a lasting impact.',
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000)
    }
  ];
  return defaultComments;
}

// Example object with provided values
const providedVideo = {
  id: '84e96018-4022-434e-80bf-000ce4cd12b8',
  title: 'BMX Rampage: 2021 Highlights',
  image: 'https://project-2-api.herokuapp.com/images/image0.jpg',
  description: 'On a gusty day in Southern Utah, a group of 25 daring mountain bikers blew the doors off what is possible on two wheels, unleashing some of the biggest moments the sport has ever seen. While mother nature only allowed for one full run before the conditions made it impossible to ride, that was all that was needed for event veteran Kyle Strait, who won the event for the second time -- eight years after his first Red Cow Rampage title'
};

// Generate random content and add default comments
const videoWithRandomContent = generateRandomContent(providedVideo);

// Output the result
console.log(videoWithRandomContent);








module.exports = router;