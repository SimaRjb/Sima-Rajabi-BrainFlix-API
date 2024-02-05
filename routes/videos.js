const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT}`;

const fetchVideos = () => {
  try {
    return JSON.parse(fs.readFileSync("./data/videos.json"));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

const addVideo = (newVideo) => {
  const freshVideoList = fetchVideos();
  if (!freshVideoList) {
    freshVideoList = [];
  }
  freshVideoList.push(newVideo);
  fs.writeFileSync(
    "./data/videos.json",
    JSON.stringify(freshVideoList, null, 2)
  );
};

const WriteVideos = (videoList) => {
  fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
};

const addComment = (videoId, newComment) => {
  try {
    const videoList = fetchVideos();
    const videoMatch = videoList.find((video) => video.id == videoId);
    videoMatch.comments.push(newComment);
    WriteVideos(videoList);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteComment = (videoId, commentId) => {
  try {
    if (videoId) {
      const videoList = fetchVideos();
      const videoMatch = videoList.find((video) => video.id == videoId);

      videoMatch.comments = videoMatch.comments.filter(
        (comment) => comment.id != commentId
      );
      WriteVideos(videoList);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const modifyLike = (videoId, likeAction) => {
  try {
    if (videoId) {
      const videoList = fetchVideos();
      const videoMatch = videoList.find((video) => video.id == videoId);
      console.log("first: ", videoMatch.likes);
      let likesInt = parseInt(videoMatch.likes.replace(/,/g, ''));

      likeAction === "add" ? likesInt++ : likeAction === "remove" ? likesInt-- : null;

      const likesStr = likesInt.toLocaleString();
      console.log("second: ", likesStr);
      videoMatch.likes = likesStr;
      console.log("video match likes: ", videoMatch.likes);
      WriteVideos(videoList);
      return likesStr;
    }
  } catch (error) {
    console.log(error);
  }
};

router
  .route("/")
  .get((req, res) => {
    try {
      const videoList = fetchVideos();
      res.status(200).json(videoList);
    } catch (error) {
      console.error("Error fetching video list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
  .post((req, res) => {
    console.log("post request received");
    let newVideo;
    try {
      console.log(req.body);
      const { title, description } = req.body;
      if (!title || !description) {
        // Respond with a 400 Bad Request status code if required fields are missing
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }
      console.log("base url is: ", BASE_URL);
      const imagePath = `${BASE_URL}/public/images/sample.jpg`;
      const videoId = uuidv4();
      const videoRes = {
        id: videoId,
        title: title,
        description: description,
        image: imagePath,
      };
      newVideo = generateRandomContent(videoRes);
      res.status(200).json(newVideo);
    } catch (error) {
      // Respond with a 500 Internal Server Error status code if an unexpected error occurs
      console.error("Internal server error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
    if (newVideo) {
      addVideo(newVideo);
    } else {
      console.log("new video is null");
    }
  });

router.route("/:id").get((req, res) => {
  try {
    const { id } = req.params;
    const videoMatch = fetchVideos().find((video) => video.id == id);
    if (!videoMatch) {
      return res
        .status(404)
        .json({ message: `No video found with the ID of ${id}` });
    }
    res.status(200).json(videoMatch);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/:id/comments").post((req, res) => {
  try {
    const { id } = req.params;
    const videoMatch = fetchVideos().find((video) => video.id == id);
    if (!videoMatch) {
      return res
        .status(404)
        .json({ message: `No video found with the ID of ${id}` });
    }
    const { name, comment } = req.body;

    const newComment = {
      id: uuidv4(),
      name: name,
      comment: comment,
      likes: 0,
      timestamp: Date.now(),
    };
    addComment(id, newComment);
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/:id/comments/:commentId").delete((req, res) => {
  try {
    const id = req.params.id;
    const commentId = req.params.commentId;
    const videoMatch = fetchVideos().find((video) => video.id == id);
    if (!videoMatch) {
      return res
        .status(404)
        .json({ message: `No video found with the ID of ${id}` });
    }
    const commentMatch = videoMatch.comments.find(
      (comment) => comment.id == commentId
    );
    if (!commentMatch) {
      return res
        .status(404)
        .json({ message: `No comment found with the ID of ${commentId}` });
    }
    deleteComment(id, commentId);
    return res.status(200).json(commentMatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/:id/likes").put((req, res) => {
  try {
    const { id } = req.params;
    const {likeAction} = req.body;
    const videoMatch = fetchVideos().find((video) => video.id == id);
    if (!videoMatch) {
      return res
        .status(404)
        .json({ message: `No video found with the ID of ${id}` });
    }

    const likes = modifyLike(id, likeAction);
    return res.status(200).json({id, likes});
  } catch (error) {
    console.error(error);
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
