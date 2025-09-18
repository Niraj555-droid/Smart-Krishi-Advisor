const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // load .env

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------
// MongoDB connection
// ----------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/communityDB";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ----------------------
// Mongoose Schema
// ----------------------
const PostSchema = new mongoose.Schema(
  {
    user: {
      name: String,
      avatar: String,
      location: String,
      badges: [String],
    },
    text: String,
    media: [String], // image or video filenames
    likes: { type: Number, default: 0 },
    comments: [
      {
        user: { name: String, avatar: String },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    shares: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

// ----------------------
// Multer setup (uploads/)
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ----------------------
// Routes
// ----------------------

// Get all posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Create post
app.post("/posts", upload.array("media"), async (req, res) => {
  const { text, user } = req.body;

  let parsedUser = user;
  try {
    if (typeof user === "string") parsedUser = JSON.parse(user);
  } catch {
    parsedUser = { name: "Anonymous", avatar: "/placeholder.svg" };
  }

  const mediaFiles = req.files.map((f) => `/uploads/${f.filename}`);

  const post = new Post({
    text,
    media: mediaFiles,
    user: parsedUser,
  });

  await post.save();
  res.json(post);
});

// Like post
app.post("/posts/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.likes += 1;
  await post.save();
  res.json(post);
});

// Comment
app.post("/posts/:id/comment", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.comments.push(req.body);
  await post.save();
  res.json(post);
});

// Share
app.post("/posts/:id/share", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.shares += 1;
  await post.save();
  res.json(post);
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
