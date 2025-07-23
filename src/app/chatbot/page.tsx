
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
                        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
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
    const [location, setLocation] = React.useState<{ lat: number, lon: number} | null>(null);

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
    }


    const handleSendMessage = async (e: React.FormEvent, query?: string) => {
        e.preventDefault();
        const currentQuery = query || input;
        if (!currentQuery.trim() || isLoading) return;

        const newMessages: Message[] = [...messages, { role: "user", content: currentQuery }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await patientChat({ 
                query: currentQuery,
                latitude: location?.lat,
                longitude: location?.lon
            });
            setMessages([...newMessages, { role: "assistant", content: result.response }]);
        } catch (error: any) {
            // This is the special case where the Genkit tool signals it needs location
            if (error.message?.includes('NEEDS_LOCATION')) {
                 setMessages([...newMessages, { role: "assistant", content: "I can help with that. Please share your location so I can find nearby doctors for you." }]);
                 handleLocationRequest();
            } else {
                 console.error("AI Error:", error);
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to get a response from the AI assistant. The API key may be missing or invalid."
                })
                 // Revert to previous state on error
                 setMessages(messages);
            }
        } finally {
            setIsLoading(false);
        }
    }

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
        </div>
    )
}
