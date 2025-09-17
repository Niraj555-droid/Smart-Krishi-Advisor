import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  MessageSquare, 
  Mic, 
  Send, 
  Bug,
  Users,
  Brain,
  AlertTriangle,
  CheckCircle,
  Camera,
  Phone,
  Mail,
  Calendar,
  Leaf,
  MicIcon
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

interface ExpertQuery {
  id: string;
  title: string;
  description: string;
  status: "pending" | "responded" | "resolved";
  expert: string;
  dateSubmitted: string;
  response?: string;
}

interface DiseaseAlert {
  id: string;
  crop: string;
  disease: string;
  severity: "Low" | "Medium" | "High";
  treatment: string;
  probability: number;
}

const FarmerSupport = () => {
  const [activeTab, setActiveTab] = useState<"chatbot" | "disease" | "expert">("expert");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: "नमस्कार! मैं आपका कृषि सहायक हूँ। आप मुझसे फसल, मिट्टी, या कृषि से जुड़े कोई भी सवाल पूछ सकते हैं। आप हिंदी या मराठी में भी बात कर सकते हैं।",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  
  const [diseaseAlerts] = useState<DiseaseAlert[]>([
    {
      id: "1",
      crop: "Rice",
      disease: "Blast Disease",
      severity: "Medium",
      treatment: "Apply Tricyclazole fungicide",
      probability: 72
    },
    {
      id: "2", 
      crop: "Wheat",
      disease: "Rust",
      severity: "Low",
      treatment: "Monitor and preventive spraying",
      probability: 34
    }
  ]);

  const [expertQueries] = useState<ExpertQuery[]>([
    {
      id: "1",
      title: "Soil pH management for cotton",
      description: "My cotton crop is showing yellow leaves. Soil test shows pH 8.2. Need advice on soil treatment.",
      status: "responded",
      expert: "Dr. Pradeep Kumar",
      dateSubmitted: "2024-01-20",
      response: "Apply gypsum @ 500kg/acre and organic matter. Monitor pH after 2 weeks."
    },
    {
      id: "2",
      title: "Pest control in sugarcane",
      description: "White grubs are affecting my sugarcane crop. Looking for organic solutions.",
      status: "pending",
      expert: "Pending Assignment",
      dateSubmitted: "2024-01-22"
    }
  ]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: currentMessage,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, newUserMessage]);
      setCurrentMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot", 
          content: getBotResponse(currentMessage),
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("wheat") || lowerMessage.includes("गेहूं")) {
      return "गेहूं की फसल के लिए: 1) मिट्टी का pH 6.0-7.5 होना चाहिए 2) नाइट्रोजन उर्वरक 3 बार दें 3) सिंचाई 21 दिन के अंतराल पर करें। क्या आपको किसी खास समस्या के बारे में जानना है?";
    }
    if (lowerMessage.includes("rice") || lowerMessage.includes("धान")) {
      return "धान की खेती के लिए सुझाव: 1) पानी की गहराई 2-3 इंच रखें 2) नाइट्रोजन की पहली डोज रोपाई के 15 दिन बाद 3) ब्राउन प्लांट होपर से बचाव के लिए नीम का तेल छिड़कें।";
    }
    if (lowerMessage.includes("pest") || lowerMessage.includes("कीट")) {
      return "कीट प्रबंधन के लिए: 1) पहले जैविक नियंत्रण का प्रयोग करें 2) नीम का तेल और ट्राइकोडर्मा का उपयोग 3) रासायनिक दवा केवल जरूरत पड़ने पर। फोटो भेजें तो बेहतर सुझाव दे सकूंगा।";
    }
    return "आपका सवाल समझ गया। अधिक जानकारी के लिए कृपया अपनी समस्या विस्तार से बताएं या फसल की तस्वीर भेजें। मैं हिंदी, मराठी और अंग्रेजी में जवाब दे सकता हूं।";
  };

  const handleVoiceToggle = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      setTimeout(() => {
        setIsVoiceRecording(false);
        const voiceMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "user",
          content: "मेरी गेहूं की फसल में पत्ते पीले हो रहे हैं",
          timestamp: new Date().toLocaleTimeString(),
          isVoice: true
        };
        setChatMessages(prev => [...prev, voiceMessage]);
        
        setTimeout(() => {
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content: "पत्ते पीले होने के कारण: 1) नाइट्रोजन की कमी 2) अधिक पानी या जल भराव 3) जड़ सड़न रोग। तत्काल यूरिया डालें और जल निकासी की व्यवस्था करें।",
            timestamp: new Date().toLocaleTimeString()
          };
          setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
      }, 3000);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-500";
      case "responded": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="👨‍🌾 Farmer Support Tools" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeTab === "expert" ? "default" : "outline"}
            onClick={() => setActiveTab("expert")}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>👨‍🌾 Expert Advisory</span>
          </Button>
          <Button 
            variant={activeTab === "chatbot" ? "default" : "outline"}
            onClick={() => setActiveTab("chatbot")}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>🤖 Smart Chatbot</span>
          </Button>
          <Button 
            variant={activeTab === "disease" ? "default" : "outline"}
            onClick={() => setActiveTab("disease")}
            className="flex items-center space-x-2"
          >
            <Bug className="h-4 w-4" />
            <span>🌱 Disease Prediction</span>
          </Button>
        </div>

        {/* Expert Advisory */}
        {activeTab === "expert" && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Expert Advisory Panel */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>👨‍🌾 Expert Advisory Panel</span>
                </CardTitle>
                <CardDescription>
                  Connect with agricultural experts for personalized guidance and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Dr. Pradeep Kumar",
                      specialization: "Soil Management",
                      category: "Soil Science",
                      rating: 4.8,
                      experience: "15+ years",
                      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      name: "Dr. Sunita Sharma", 
                      specialization: "Crop Protection",
                      category: "Pest Control",
                      rating: 4.9,
                      experience: "12+ years",
                      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      name: "Eng. Rajesh Patel",
                      specialization: "Irrigation Systems", 
                      category: "Water Management",
                      rating: 4.7,
                      experience: "10+ years",
                      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      name: "Dr. Meera Joshi",
                      specialization: "Market Analysis",
                      category: "Agricultural Economics",
                      rating: 4.6,
                      experience: "8+ years", 
                      photo: "https://images.unsplash.com/photo-1594824481231-858b67dcacf7?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      name: "Prof. Anil Gupta",
                      specialization: "Organic Farming",
                      category: "Sustainable Agriculture",
                      rating: 4.9,
                      experience: "20+ years",
                      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      name: "Dr. Kavita Singh",
                      specialization: "Plant Pathology",
                      category: "Disease Management", 
                      rating: 4.8,
                      experience: "14+ years",
                      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
                    }
                  ].map((expert, index) => (
                    <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="relative mb-4">
                          <img 
                            src={expert.photo}
                            alt={expert.name}
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            ⭐ {expert.rating}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{expert.name}</h3>
                        <p className="text-primary font-medium">{expert.specialization}</p>
                        <Badge variant="secondary" className="mt-1 mb-2">
                          {expert.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-3">{expert.experience} experience</p>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ask Question
                          </Button>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit New Query & Recommended Videos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>💬 Submit New Query</span>
                  </CardTitle>
                  <CardDescription>
                    Get personalized advice from agricultural experts in your language
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Your Question</label>
                    <Textarea
                      placeholder="Describe your farming issue or question in Hindi, English, or Marathi..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>Soil Management</option>
                        <option>Pest Control</option>
                        <option>Irrigation</option>
                        <option>Disease Management</option>
                        <option>Market Trends</option>
                        <option>Organic Farming</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>हिंदी (Hindi)</option>
                        <option>English</option>
                        <option>मराठी (Marathi)</option>
                        <option>ગુજરાતી (Gujarati)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Question
                    </Button>
                    <Button variant="outline">
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Videos */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>📺 Recommended Videos</CardTitle>
                  <CardDescription>Educational content based on your queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Organic Pest Control Methods",
                        channel: "Krishi Vigyan",
                        duration: "12:45",
                        views: "2.3M",
                        thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=150&h=100&fit=crop"
                      },
                      {
                        title: "Soil Testing and pH Management",
                        channel: "Farm Science",
                        duration: "8:30",
                        views: "1.8M",
                        thumbnail: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&h=100&fit=crop"
                      },
                      {
                        title: "Water-Saving Irrigation Techniques",
                        channel: "Smart Farming",
                        duration: "15:20",
                        views: "3.1M",
                        thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=100&fit=crop"
                      }
                    ].map((video, index) => (
                      <div key={index} className="flex space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer">
                        <img 
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-20 h-14 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{video.channel}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <span>{video.duration}</span>
                            <span>•</span>
                            <span>{video.views} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Previous Queries */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>📋 Your Previous Queries</CardTitle>
                <CardDescription>Track the status of your expert consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expertQueries.map((query) => (
                    <div key={query.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{query.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{query.description}</p>
                        </div>
                        <Badge className={`${getStatusColor(query.status)} text-white ml-4`}>
                          {query.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>👨‍🌾 Expert: {query.expert}</span>
                          <span>📅 {query.dateSubmitted}</span>
                        </div>
                      </div>
                      
                      {query.response && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm"><strong>Expert Response:</strong> {query.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Smart Chatbot */}
        {activeTab === "chatbot" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>🤖 Smart Agricultural Assistant</span>
                </CardTitle>
                <CardDescription>
                  Get instant answers in Hindi, Marathi, or English. Ask about crops, diseases, fertilizers, or any farming query.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.type === "bot" && <Brain className="h-4 w-4" />}
                          {message.isVoice && <Mic className="h-4 w-4" />}
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Section */}
                <div className="flex space-x-2">
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Type your question in Hindi, English, or Marathi..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleVoiceToggle}
                      className={isVoiceRecording ? "bg-red-100 text-red-600" : ""}
                    >
                      {isVoiceRecording ? (
                        <div className="flex items-center">
                          <div className="animate-pulse w-2 h-2 bg-red-600 rounded-full mr-1"></div>
                          <MicIcon className="h-4 w-4" />
                        </div>
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {isVoiceRecording && (
                  <Alert className="mt-4">
                    <Mic className="h-4 w-4" />
                    <AlertDescription>
                      🎙️ Recording in progress... Speak your question in Hindi, English, or Marathi
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Text & Voice Chat</h3>
                  <p className="text-sm text-muted-foreground">Ask questions in your preferred language</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Image Analysis</h3>
                  <p className="text-sm text-muted-foreground">Upload crop photos for diagnosis</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Smart recommendations based on your location</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Disease Prediction */}
        {activeTab === "disease" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="h-5 w-5" />
                  <span>🌱 AI Disease Prediction & Early Warning</span>
                </CardTitle>
                <CardDescription>
                  Get early alerts about potential crop diseases and pest risks based on weather and crop conditions
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Current Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Risk Alerts</h3>
                {diseaseAlerts.map((alert) => (
                  <Card key={alert.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{alert.crop} - {alert.disease}</h4>
                        <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                          {alert.severity} Risk
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">Probability: {alert.probability}%</span>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Recommended Treatment:</p>
                            <p className="text-sm text-muted-foreground">{alert.treatment}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Detailed Treatment Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Prevention Tips */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Prevention Guidelines</h3>
                
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Farm Health Check</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Inspect leaves for discoloration</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Check soil moisture levels</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Monitor pest activity</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Verify irrigation system</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Crop Images</CardTitle>
                    <CardDescription>Get AI-powered disease diagnosis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload crop photos
                      </p>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FarmerSupport;
