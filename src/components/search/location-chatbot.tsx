'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send, Bot, User, MapPin, Loader2, Phone, Clock, Star } from 'lucide-react';
import { ChatbotLocationService } from '@/lib/chatbot-location-service';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  locationResults?: any[];
}

export const LocationChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your healthcare assistant. I can help you find nearby hospitals, clinics, doctors, pharmacies, and emergency services. Just ask me something like 'Find hospitals near me' or 'Show clinics in New York'.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ChatbotLocationService.processLocationQuery(inputText);
      
      if (response && typeof response.message === 'string') {
        let botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: 'bot',
          timestamp: new Date()
        };

        if (Array.isArray(response.results) && response.results.length > 0) {
          botMessage.locationResults = response.results;
        }

        setMessages(prev => [...prev, botMessage]);

        if (Array.isArray(response.results) && response.results.length > 0) {
          toast({
            title: "Found Results",
            description: `Found ${response.results.length} locations for your search`,
          });
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, I couldn't understand the response. Please try again.",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        toast({
          title: "Error",
          description: "Invalid response from the server",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInGoogleMaps = (result: any) => {
    if (result.placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${result.placeId}`, '_blank');
    } else if (result.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${result.coordinates.lat},${result.coordinates.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + result.address)}`, '_blank');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQueries = [
    "Find hospitals near me",
    "Show clinics in downtown",
    "Emergency services nearby",
    "Pharmacies open now",
    "Doctors in my area",
    "Urgent care centers"
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Healthcare Location Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                  } rounded-lg p-3`}>
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location Results */}
              {message.locationResults && message.locationResults.length > 0 && (
                <div className="ml-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Found locations:</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {message.locationResults.slice(0, 6).map((result, index) => (
                      <Card key={index} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">{result.name}</h4>
                              {result.rating && (
                                <div className="flex items-center gap-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                                  <Star className="h-2.5 w-2.5 text-yellow-500 fill-current" />
                                  {result.rating}
                                </div>
                              )}
                            </div>
                            
                            {result.address && (
                              <p className="text-xs text-muted-foreground flex items-start gap-1">
                                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {result.address}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs">
                              {result.isOpen !== undefined && (
                                <span className={`flex items-center gap-1 ${result.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                  <Clock className="h-3 w-3" />
                                  {result.isOpen ? 'Open' : 'Closed'}
                                </span>
                              )}
                              {result.phone && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {result.phone}
                                </span>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openInGoogleMaps(result)}
                              className="w-full text-xs"
                            >
                              Get Directions
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {message.locationResults.length > 6 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Showing first 6 of {message.locationResults.length} results
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Searching for locations...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="p-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(query)}
                  className="text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about nearby healthcare facilities..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputText.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
