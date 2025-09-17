import React, { useState, useRef } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
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
  ThumbsUp,
  Send
} from 'lucide-react';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    location: string;
    badges: string[];
  };
  content: {
    text: string;
    media?: {
      type: 'image' | 'video';
      url: string;
      caption?: string;
    }[];
  };
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

const Community = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPost, setNewPost] = useState({ text: '', media: [] as File[] });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Sample data - in real app this would come from Supabase
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        name: 'Rajesh Kumar',
        avatar: '/placeholder.svg',
        location: 'Punjab, India',
        badges: ['Best Organic Practice', 'Water Saver']
      },
      content: {
        text: 'Just harvested my organic wheat crop! This season I implemented drip irrigation and crop rotation. The yield increased by 25% compared to last year. Sharing some photos of the golden fields. 🌾',
        media: [
          { type: 'image', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='wheat' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fbbf24;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f59e0b;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23wheat)'/%3E%3Ctext x='300' y='200' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='24' fill='white'%3E🌾 Golden Wheat Fields%3C/text%3E%3C/svg%3E", caption: 'Golden wheat fields ready for harvest' }
        ]
      },
      timestamp: '2 hours ago',
      likes: 45,
      comments: [
        {
          id: '1',
          user: { name: 'Priya Sharma', avatar: '/placeholder.svg' },
          text: 'Amazing results! Can you share more details about your crop rotation schedule?',
          timestamp: '1 hour ago'
        }
      ],
      shares: 12,
      isLiked: false
    },
    {
      id: '2',
      user: {
        name: 'Maria Santos',
        avatar: '/placeholder.svg',
        location: 'Cebu, Philippines',
        badges: ['High Yield Hero', 'Innovation Leader']
      },
      content: {
        text: 'Experimenting with vertical farming techniques for my tomatoes. Here\'s a short video showing the setup and growth progress over 3 weeks. The space efficiency is incredible!',
        media: [
          { type: 'image', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='tomato' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dc2626;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23ef4444;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23tomato)'/%3E%3Ctext x='300' y='180' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='20' fill='white'%3E🍅 Vertical Farming Setup%3C/text%3E%3Ctext x='300' y='220' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='16' fill='white'%3ETomatoes growing vertically%3C/text%3E%3C/svg%3E", caption: 'Vertical tomato farming setup' }
        ]
      },
      timestamp: '5 hours ago',
      likes: 78,
      comments: [
        {
          id: '2',
          user: { name: 'Ahmed Ali', avatar: '/placeholder.svg' },
          text: 'This is fantastic! What was your initial investment for this setup?',
          timestamp: '3 hours ago'
        },
        {
          id: '3',
          user: { name: 'Lisa Chen', avatar: '/placeholder.svg' },
          text: 'I\'d love to try this in my greenhouse. Do you have a tutorial?',
          timestamp: '2 hours ago'
        }
      ],
      shares: 23,
      isLiked: true
    }
  ]);

  const badges = {
    'Best Organic Practice': { icon: Leaf, color: 'bg-green-500' },
    'Water Saver': { icon: Droplets, color: 'bg-blue-500' },
    'High Yield Hero': { icon: TrendingUp, color: 'bg-yellow-500' },
    'Innovation Leader': { icon: Award, color: 'bg-purple-500' },
    'Community Helper': { icon: Users, color: 'bg-orange-500' }
  };

  const handleCreatePost = () => {
    if (!newPost.text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for your post.",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: '/placeholder.svg',
        location: 'Your Location',
        badges: ['Community Helper']
      },
      content: {
        text: newPost.text,
        media: newPost.media.map(file => ({
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          caption: file.name
        }))
      },
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost({ text: '', media: [] });
    setShowCreatePost(false);
    
    toast({
      title: "Success",
      description: "Your post has been shared with the community!"
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setNewPost(prev => ({ ...prev, media: [...prev.media, ...files] }));
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: { name: 'You', avatar: '/placeholder.svg' },
      text: commentText,
      timestamp: 'Just now'
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted!"
    });
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    
    toast({
      title: "Post Shared",
      description: "Post has been shared with your network!"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
            <p className="text-muted-foreground">
              Connect, share, and learn from fellow farmers around the world
            </p>
          </div>

          {/* Create Post Section */}
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
                  placeholder="Share your farming techniques, success stories, or ask for advice..."
                  value={newPost.text}
                  onChange={(e) => setNewPost(prev => ({ ...prev, text: e.target.value }))}
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
                          onClick={() => setNewPost(prev => ({
                            ...prev,
                            media: prev.media.filter((_, i) => i !== index)
                          }))}
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
                    <Button onClick={handleCreatePost}>
                      Share Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Community Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
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
                          const badgeInfo = badges[badgeName as keyof typeof badges];
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
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {post.content.text}
                  </p>
                  
                  {post.content.media && post.content.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.content.media.map((media, index) => (
                        <div key={index} className="rounded-lg overflow-hidden border bg-muted/20">
                          {media.type === 'image' ? (
                            <div className="relative w-full h-64 bg-gradient-to-br from-muted/30 to-muted/60">
                              <img
                                src={media.url}
                                alt={media.caption || 'Post image'}
                                className="w-full h-64 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3EImage not found%3C/text%3E%3C/svg%3E";
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.opacity = '1';
                                }}
                                style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                              />
                            </div>
                          ) : (
                            <div className="relative w-full h-64 bg-muted flex items-center justify-center rounded-lg">
                              <Video className="h-12 w-12 text-muted-foreground" />
                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-lg">
                                <Button size="sm" variant="secondary">
                                  <Video className="h-4 w-4 mr-2" />
                                  Play Video
                                </Button>
                              </div>
                            </div>
                          )}
                          {media.caption && (
                            <p className="text-sm text-muted-foreground mt-2 px-3 pb-2">
                              {media.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`${post.isLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments.length}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post.id)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3">
                      <Separator />
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {comment.user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  {comment.user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {comment.text}
                              </p>
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
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gamification Section */}
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