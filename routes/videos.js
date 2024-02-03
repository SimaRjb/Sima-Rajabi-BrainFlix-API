const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fetchVideos = () => {
  try {
    return JSON.parse(fs.readFileSync("./data/videos.json"));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

// const addMovie = (newMovie) => {
//   const freshMovieList = fetchMovies();
//   // freshMovieList.push(newMovie);
//   // fs.writeFileSync("../data/movies.json", JSON.stringify(freshMovieList));
//   fs.writeFileSync(
//     "./data/movies.json",
//     JSON.stringify([...freshMovieList, newMovie])
//   );
//   return newMovie;
// };

const addVideo = (newVideo) =>{
  const freshVideoList = fetchVideos();
  freshVideoList.push(newVideo)
  fs.writeFileSync("./data/videos.json", JSON.stringify(freshVideoList));
}


router
  .route("/")
  .get((req, res) => {
    try {
      const videoList = fetchVideos();
      // If fetchMovies() succeeds, return the video list
      res.status(200).json(videoList);
    } catch (error) {
      // If there's an error fetching the video list, return an error response
      console.error("Error fetching video list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })

  .post((req, res) => {
    let newVideo;
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        // Respond with a 400 Bad Request status code if required fields are missing
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }

      const videoId = uuidv4();
      const image = "oscar.jpg";
      const videoRes = {
        id: videoId,
        title: title,
        description: description,
        image: image,
      };
      newVideo = generateRandomContent(videoRes);
      res.status(200).json(newVideo);
    } catch (error) {
      // Respond with a 500 Internal Server Error status code if an unexpected error occurs
      console.error("Internal server error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
    addVideo(newVideo);
  });


  // router.route("/:id")
  // .get((req, res) => {
  //   const { id } = req.params;
  //   const videoMatch = fetchVideos().find((video) => video.id == id);
  //   if(!videoMatch){
  //     return res.status(404).json({message: `No video found with the ID of ${id}`});
  //   } 
  //   res.status(200).json(videoMatch);
  // })

  router.route("/:id")
  .get((req, res) => {
    try {
      const { id } = req.params;
      const videoMatch = fetchVideos().find((video) => video.id == id);
      if (!videoMatch) {
        return res.status(404).json({ message: `No video found with the ID of ${id}` });
      }
      res.status(200).json(videoMatch);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


// Function to generate random content for missing keys
function generateRandomContent(videoObj) {
  // Generate random values for missing keys
  const randomChannel = "Random Channel"; // Example random channel
  const randomViews = Math.floor(Math.random() * 1000000).toLocaleString();
  const randomLikes = Math.floor(Math.random() * 100000).toLocaleString();
  const randomDuration = `${Math.floor(Math.random() * 10)}:${Math.floor(
    Math.random() * 60
  )
    .toString()
    .padStart(2, "0")}`;
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
    comments: defaultComments,
  };
}
const generateComments = () => {
  const defaultComments = [
    {
      id: uuidv4(),
      name: "User 1",
      comment:
        "Wow, what an incredible video! The cinematography is stunning, and the storytelling is captivating.",
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000),
    },
    {
      id: uuidv4(),
      name: "User 2",
      comment:
        "Absolutely mesmerizing! I was completely drawn into the world of this video from the very beginning.",
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000),
    },
    {
      id: uuidv4(),
      name: "User 3",
      comment:
        "This video is beyond words. It evokes such a range of emotions and leaves a lasting impact.",
      likes: 0,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000000),
    },
  ];
  return defaultComments;
};


module.exports = router;
