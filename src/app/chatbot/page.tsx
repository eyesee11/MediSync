"use client";

<<<<<<< HEAD
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useVoice } from "@/hooks/use-voice"
import { patientChat } from "@/ai/flows/patient-chat-flow"
import { Bot, Send, User, Loader2, MapPin, Mic, MicOff } from "lucide-react"
=======
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { patientChat } from "@/ai/flows/patient-chat-flow";
import {
  Bot,
  Send,
  User,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
>>>>>>> 13e8d22587b7fc549904a8197431572185af792c

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Simple component to render markdown-style links
const MarkdownMessage = ({ content }: { content: string }) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = content.split(linkRegex);

  return (
    <p className="text-sm whitespace-pre-wrap">
      {parts.map((part, i) => {
        // Every 3rd part is the link text, and every 4th is the URL
        if (i % 3 === 1) {
          const text = part;
          const href = parts[i + 1];
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {text}
            </a>
          );
        }
        if (i % 3 === 2) {
          // This is the URL part, which we've already used, so skip it
          return null;
        }
        // This is a regular text part
        return part;
      })}
    </p>
  );
};

export default function ChatbotPage() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [speechEnabled, setSpeechEnabled] = React.useState(true);
  const [location, setLocation] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);

<<<<<<< HEAD
    // Voice functionality - only for input
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        speechRecognitionSupported,
    } = useVoice({
        onTranscript: (finalTranscript) => {
            setInput(finalTranscript);
            resetTranscript();
        },
    });

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Show voice input notification on first visit
    React.useEffect(() => {
        const hasSeenVoiceNotification = localStorage.getItem('medisync-voice-notification');
        if (!hasSeenVoiceNotification && speechRecognitionSupported) {
            toast({
                title: "Voice Input Available!",
                description: "🎤 Click the microphone button to speak your questions instead of typing",
                duration: 5000,
            });
            localStorage.setItem('medisync-voice-notification', 'true');
        }
    }, [speechRecognitionSupported, toast]);

    const handleLocationRequest = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                     toast({
                        title: "Location Acquired",
                        description: "Your location has been shared with the AI for this session.",
                    })
                },
                () => {
                    toast({
                        variant: "destructive",
                        title: "Location Access Denied",
                        description: "Please enable location permissions to find nearby providers.",
                    })
                }
            );
        }
=======
  // Speech recognition setup
  const [recognition, setRecognition] =
    React.useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] =
    React.useState<SpeechSynthesis | null>(null);

  React.useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Speech Recognition Error",
          description: "Could not capture your voice. Please try again.",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
>>>>>>> 13e8d22587b7fc549904a8197431572185af792c
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

<<<<<<< HEAD
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="mb-4">
                 <h1 className="text-3xl font-bold tracking-tight">AI Health Assistant</h1>
                 <p className="text-muted-foreground">
                    Ask general health questions. This AI cannot provide medical advice.
                    {speechRecognitionSupported && (
                        <span className="block text-sm text-green-600 mt-1">
                            🎤 Voice input available - speak your questions instead of typing
                        </span>
                    )}
                </p>
            </div>
           
            <Card className="flex-1 flex flex-col">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bot /> AI Assistant
                        </CardTitle>
                        <CardDescription>
                            Type your questions or use voice input • Text responses only
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleLocationRequest}>
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Location</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                               {message.role === 'assistant' && (
                                     <Avatar>
                                        <AvatarFallback>
                                            <Bot />
                                        </AvatarFallback>
                                     </Avatar>
                                )}
                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {message.role === 'assistant' ? (
                                        <MarkdownMessage content={message.content} />
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                     <Avatar>
                                        <AvatarFallback><User /></AvatarFallback>
                                     </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                                <div className="flex items-start gap-3">
                                     <Avatar>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                     </Avatar>
                                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder={isListening ? "🎤 Listening..." : "Type your question here..."}
                            className={`flex-1 ${isListening ? 'border-green-500 bg-green-50' : ''}`}
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        {speechRecognitionSupported && (
                            <Button 
                                type="button"
                                size="icon" 
                                variant={isListening ? "default" : "outline"}
                                onClick={handleVoiceToggle}
                                disabled={isLoading}
                                title={isListening ? "Stop listening" : "Start voice input"}
                                className={isListening ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                {isListening ? (
                                    <MicOff className="h-4 w-4" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {isListening ? "Stop listening" : "Start voice input"}
                                </span>
                            </Button>
                        )}
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
=======
    return () => {
      // Cleanup
      if (recognition) {
        recognition.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support voice input.",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (speechSynthesis && speechEnabled) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setSpeechEnabled(!speechEnabled);
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          toast({
            title: "Location Acquired",
            description:
              "Your location has been shared with the AI for this session.",
          });
        },
        () => {
          toast({
            variant: "destructive",
            title: "Location Access Denied",
            description:
              "Please enable location permissions to find nearby providers.",
          });
        }
      );
    }
  };

  const handleSendMessage = async (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const currentQuery = query || input;
    if (!currentQuery.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: currentQuery },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await patientChat({
        query: currentQuery,
        latitude: location?.lat,
        longitude: location?.lon,
      });
      setMessages([
        ...newMessages,
        { role: "assistant", content: result.response },
      ]);

      // Speak the AI response if speech is enabled
      if (speechEnabled && !isSpeaking) {
        speakText(result.response);
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I apologize, but I'm experiencing technical difficulties right now. Please try asking your question again, or consider consulting with a healthcare professional directly for immediate assistance.",
        },
      ]);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to get a response from the AI assistant. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground">
            Ask general health questions. This AI cannot provide medical advice.
          </p>
>>>>>>> 13e8d22587b7fc549904a8197431572185af792c
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot /> AI Assistant
            </CardTitle>
            <CardDescription>
              This is a preview, conversations are not saved.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeech}
              className={speechEnabled ? "text-green-600" : "text-red-600"}
            >
              {speechEnabled ? (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Voice On
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Voice Off
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLocationRequest}>
              <MapPin className="mr-2 h-4 w-4" />
              Share Location
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <MarkdownMessage content={message.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={handleSendMessage}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your question here or use voice input..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isListening ? "Stop listening" : "Start voice input"}
              </span>
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
