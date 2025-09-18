"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Video,
  Award,
  Trophy,
  Droplets,
  Leaf,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Send,
} from "lucide-react";

interface Post {
  _id: string;
  user: {
    name: string;
    avatar: string;
    location: string;
    badges: string[];
  };
  text: string;
  media: string[];
  likes: number;
  comments: {
    user: { name: string; avatar: string };
    text: string;
  }[];
  shares: number;
}

const Community = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ text: "", media: [] as File[] });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );

  // Fetch posts
  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  // Badge icons/colors
  const badges = {
    "Best Organic Practice": { icon: Leaf, color: "bg-green-500" },
    "Water Saver": { icon: Droplets, color: "bg-blue-500" },
    "High Yield Hero": { icon: TrendingUp, color: "bg-yellow-500" },
    "Innovation Leader": { icon: Award, color: "bg-purple-500" },
    "Community Helper": { icon: Users, color: "bg-orange-500" },
  };

  // Create Post
  const handleCreatePost = async () => {
    if (!newPost.text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("text", newPost.text);
    newPost.media.forEach((file) => formData.append("media", file));
    formData.append(
      "user",
      JSON.stringify({
        name: "You",
        avatar: "/placeholder.svg",
        location: "Your Location",
        badges: ["Community Helper"],
      })
    );

    const res = await fetch("http://localhost:8000/posts", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setPosts([data, ...posts]);
    setNewPost({ text: "", media: [] });
    setShowCreatePost(false);

    toast({ title: "Success", description: "Your post has been shared!" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewPost((prev) => ({ ...prev, media: [...prev.media, ...files] }));
    }
  };

  const handleLike = async (postId: string) => {
    const res = await fetch(`http://localhost:8000/posts/${postId}/like`, {
      method: "POST",
    });
    const updated = await res.json();
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handleComment = async (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const res = await fetch(`http://localhost:8000/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { name: "You", avatar: "/placeholder.svg" },
        text: commentText,
      }),
    });

    const updated = await res.json();
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

    toast({
      title: "Comment Added",
      description: "Your comment has been posted!",
    });
  };

  const handleShare = async (postId: string) => {
    const res = await fetch(`http://localhost:8000/posts/${postId}/share`, {
      method: "POST",
    });
    const updated = await res.json();
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

    toast({
      title: "Post Shared",
      description: "Post has been shared with your network!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Community Hub
            </h1>
            <p className="text-muted-foreground">
              Connect, share, and learn from fellow farmers around the world
            </p>
          </div>

          {/* Create Post */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Share Your Story
                </h2>
                {!showCreatePost && (
                  <Button onClick={() => setShowCreatePost(true)}>
                    Create Post
                  </Button>
                )}
              </div>
            </CardHeader>

            {showCreatePost && (
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your farming experience..."
                  value={newPost.text}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="min-h-[100px]"
                />

                {newPost.media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newPost.media.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() =>
                            setNewPost((prev) => ({
                              ...prev,
                              media: prev.media.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreatePost(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>Share Post</Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {post.user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {post.user.location}
                        </div>
                      </div>

                      <div className="flex gap-1 mt-1 flex-wrap">
                        {post.user.badges.map((badgeName) => {
                          const badgeInfo =
                            badges[badgeName as keyof typeof badges];
                          return badgeInfo ? (
                            <Badge
                              key={badgeName}
                              variant="secondary"
                              className={`text-white ${badgeInfo.color}`}
                            >
                              <badgeInfo.icon className="h-3 w-3 mr-1" />
                              {badgeName}
                            </Badge>
                          ) : null;
                        })}
                      </div>

                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Just now
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">{post.text}</p>

                  {post.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.media.map((m, i) =>
                        m.endsWith(".mp4") ? (
                          <video
                            key={i}
                            controls
                            className="rounded-lg w-full h-64 object-cover"
                          >
                            <source src={`http://localhost:8000${m}`} />
                          </video>
                        ) : (
                          <img
                            key={i}
                            src={`http://localhost:8000${m}`}
                            alt="media"
                            className="rounded-lg w-full h-64 object-cover"
                          />
                        )
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {post.likes}
                      </Button>

                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments.length}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post._id)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3">
                      <Separator />
                      {post.comments.map((c, i) => (
                        <div key={i} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={c.user.avatar} />
                            <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="bg-muted rounded-lg p-3">
                              <p className="font-semibold text-sm">
                                {c.user.name}
                              </p>
                              <p className="text-sm text-foreground">{c.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(post._id)}
                        disabled={!commentInputs[post._id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gamification */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Community Badges
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(badges).map(([name, { icon: Icon, color }]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className={`p-2 rounded-full ${color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Earn by sharing your expertise
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
