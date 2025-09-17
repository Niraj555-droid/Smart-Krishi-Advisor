import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  Search,
  Video,
  FileText,
  Users,
  Send,
  ExternalLink
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I check market prices for my crops?",
      answer: "Go to Market Analysis page from the dashboard. You can search for your crop, select your region (local mandi, district, state, or international), and view real-time prices. The system also provides price trends and selling recommendations."
    },
    {
      question: "How does the Crop Suitability tool work?",
      answer: "Enter any crop name in the Crop Suitability page. Our AI analyzes your soil type, water availability, weather conditions, and market demand to give you a suitability score (0-100%). You'll get clear recommendations: ✅ Plant this crop, ⚠️ Risky choice, or ❌ Not recommended."
    },
    {
      question: "How can I apply for government schemes?",
      answer: "Visit the Government Schemes page to see all available schemes for your state. Each scheme shows eligibility criteria, required documents, and application deadlines. Click 'Check Eligibility' to see if you qualify, then 'Apply Now' to start the application process."
    },
    {
      question: "Why is my water footprint important?",
      answer: "Water footprint tracking helps you optimize water usage, reduce costs, and improve crop yields. The tool shows how much water each crop uses from different sources (rain, groundwater, irrigation) and suggests conservation techniques to save 20-50% water."
    },
    {
      question: "How accurate are the AI crop recommendations?",
      answer: "Our AI analyzes multiple factors including your soil type, climate data, water availability, and current market conditions. Recommendations are based on successful farming patterns in similar conditions. However, always consult your local agricultural officer for final decisions."
    },
    {
      question: "Can I use this app offline?",
      answer: "Yes, the app works offline for basic features. However, real-time data like market prices, weather forecasts, and scheme updates require internet connection. We recommend syncing data when you have connectivity."
    },
    {
      question: "How do I update my farm information?",
      answer: "Go to Profile & Settings page, click 'Edit Profile', update your farm details (size, soil type, crops, location), and save changes. This ensures all recommendations are personalized to your current farming situation."
    },
    {
      question: "What if I'm not satisfied with a recommendation?",
      answer: "Our recommendations are advisory only. Always use your farming experience and consult local experts. You can also contact our support team to provide feedback, which helps improve the system for all farmers."
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call our agricultural experts",
      contact: "1800-123-FARM (3276)",
      availability: "Mon-Sat, 9 AM - 6 PM",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Quick help via WhatsApp",
      contact: "+91-98765-43210",
      availability: "24/7 automated, expert reply in 2-4 hours",
      action: "Chat Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed queries and feedback",
      contact: "support@digitalagri.gov.in",
      availability: "Response within 24 hours",
      action: "Send Email"
    }
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step guides for all features",
      count: "25+ videos",
      action: "Watch Now"
    },
    {
      icon: FileText,
      title: "User Manual",
      description: "Complete guide to using the platform",
      count: "PDF Download",
      action: "Download"
    },
    {
      icon: Users,
      title: "Farmer Community",
      description: "Connect with other farmers",
      count: "10,000+ members",
      action: "Join Forum"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Help & Support" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help topics, features, or issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactMethods.map((method, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span>{method.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="font-semibold text-foreground">{method.contact}</div>
                  <div className="text-xs text-muted-foreground">{method.availability}</div>
                </div>
                <Button size="sm" className="w-full">
                  {method.action}
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No FAQs found matching your search.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or contact our support team.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <resource.icon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground">{resource.count}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <Button size="sm" variant="secondary" className="w-full">
                  {resource.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Send us a Message</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  placeholder="What's this about?"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
                <Button type="submit" className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;