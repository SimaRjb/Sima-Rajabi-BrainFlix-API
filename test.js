// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');

// // Define storage for the uploaded images
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images'); // Set destination folder for images
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname); // Set filename for uploaded image
//   }
// });

// // Filter to allow only image files
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// // Set up multer
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Your POST route for adding videos
// router.post('/', upload.single('image'), (req, res) => {
//   try {
//     const { title, description } = req.body;
//     if (!title || !description) {
//       // Respond with a 400 Bad Request status code if required fields are missing
//       return res.status(400).json({ error: "Title and description are required" });
//     }

//     const videoId = uuidv4();
//     const imageUrl = req.file ? req.file.path : ''; // Get the path of the uploaded image

//     // Assuming you have a JSON file where you want to store video information
//     let videos = JSON.parse(fs.readFileSync('videos.json', 'utf8'));

//     const newVideo = {
//       id: videoId,
//       title: title,
//       description: description,
//       imageUrl: imageUrl
//     };

//     videos.push(newVideo);

//     fs.writeFileSync('videos.json', JSON.stringify(videos));

//     res.status(201).json({ message: 'Video added successfully', video: newVideo });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
// //////////////////

// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// router.post('/', (req, res) => {
//     try {
//         const { title, description } = req.body;
//         if (!title || !description) {
//             // Respond with a 400 Bad Request status code if required fields are missing
//             return res.status(400).json({ error: "Title and description are required" });
//         }

//         const videoId = uuidv4();
//         const imagePath = path.join(__dirname, '../public/images/sample.jpg'); // Assuming the image is named 'sample.jpg' in public/images folder

//         // Read the image file from the filesystem
//         const image = fs.readFileSync(imagePath, { encoding: 'base64' });

//         const videoRes = {
//             id: videoId,
//             title: title,
//             description: description,
//             image: image
//         };

//         // Write the video response to a JSON file
//         const jsonFilePath = path.join(__dirname, 'videos.json'); // Change this to your desired JSON file path
//         let videos = [];
//         if (fs.existsSync(jsonFilePath)) {
//             videos = JSON.parse(fs.readFileSync(jsonFilePath));
//         }

//         videos.push(videoRes);
//         fs.writeFileSync(jsonFilePath, JSON.stringify(videos, null, 2));

//         res.status(201).json({ message: 'Video added successfully', video: videoRes });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;
