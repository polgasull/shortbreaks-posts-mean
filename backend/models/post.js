const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  productName: { type: String, required: true },
  fromPrice: { type: Number, required: true },
  externalLink: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Post', postSchema);