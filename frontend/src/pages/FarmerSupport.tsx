import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Camera,
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

const BACKEND_URL = "http://localhost:8000/chat";

const FarmerSupport = () => {
  const [activeTab, setActiveTab] = useState<"chatbot" | "disease" | "expert">("chatbot");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: "नमस्कार! मी तुमचा कृषी सहाय्यक आहे. तुम्ही मला पिके, माती, किंवा शेतीशी संबंधित कोणतेही प्रश्न विचारू शकता. तुम्ही मराठीत किंवा इंग्रजीत देखील बोलू शकता.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const [diseaseAlerts] = useState<DiseaseAlert[]>([
    { id: "1", crop: "Rice", disease: "Blast Disease", severity: "Medium", treatment: "Apply Tricyclazole fungicide", probability: 72 },
    { id: "2", crop: "Wheat", disease: "Rust", severity: "Low", treatment: "Monitor and preventive spraying", probability: 34 }
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage("");
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUserMessage.content })
      });

      const data = await response.json();

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.reply || "क्षमस्व, मी तुमचा प्रश्न समजू शकलो नाही.",
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content: "❌ सर्व्हरशी कनेक्ट होण्यात अडचण. कृपया नंतर पुन्हा प्रयत्न करा.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => setIsVoiceRecording(!isVoiceRecording);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="👨‍🌾 Farmer Support Tools" showLogo={false} />

      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={activeTab === "expert" ? "default" : "outline"} onClick={() => setActiveTab("expert")} className="flex items-center space-x-2">
            <Users className="h-4 w-4" /> <span>👨‍🌾 Expert Advisory</span>
          </Button>
          <Button variant={activeTab === "chatbot" ? "default" : "outline"} onClick={() => setActiveTab("chatbot")} className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" /> <span>🤖 Smart Chatbot</span>
          </Button>
          <Button variant={activeTab === "disease" ? "default" : "outline"} onClick={() => setActiveTab("disease")} className="flex items-center space-x-2">
            <Bug className="h-4 w-4" /> <span>🌱 Disease Prediction</span>
          </Button>
        </div>

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
                  Get instant answers in Marathi, English, or Hindi. Ask about crops, diseases, fertilizers, or any farming query.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.type === "bot" && <Brain className="h-4 w-4" />}
                          {message.isVoice && <Mic className="h-4 w-4" />}
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && <div className="text-sm text-muted-foreground italic">Typing...</div>}
                </div>

                {/* Input Section */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="तुमचा प्रश्न मराठीत, इंग्रजीत किंवा हिंदीत लिहा..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button variant="outline" size="icon" onClick={handleVoiceToggle} className={isVoiceRecording ? "bg-red-100 text-red-600" : ""}>
                    {isVoiceRecording ? <div className="flex items-center animate-pulse"><MicIcon className="h-4 w-4" /></div> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {isVoiceRecording && (
                  <Alert className="mt-4">
                    <Mic className="h-4 w-4" />
                    <AlertDescription>
                      🎙️ रेकॉर्डिंग सुरू आहे... आपला प्रश्न मराठीत, इंग्रजीत किंवा हिंदीत बोला
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FarmerSupport;
