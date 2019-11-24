const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');
const checkAuth = require("../middleware/check-auth");
const checkFileType = require("../middleware/check-file-type");

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPost);

router.post("", checkAuth, checkFileType, PostsController.createPost);

router.patch("/:id", checkAuth, checkFileType, PostsController.updatePost);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;