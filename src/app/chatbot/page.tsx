"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, MapPin, Mic, MicOff, Bot, User, MessageSquare, Stethoscope } from 'lucide-react'
import { useVoice } from '@/hooks/use-voice'
import { LocationChatbot } from '@/components/search/location-chatbot'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  hasVoiceInput?: boolean
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showNotification, setShowNotification] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Voice functionality - input only
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    speechRecognitionSupported,
  } = useVoice({
    onTranscript: (text) => {
      setInput(text)
      resetTranscript()
    }
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Handle voice input updates
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
      hasVoiceInput: isListening || transcript.length > 0
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    resetTranscript()
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          location: location
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          const locationMessage: Message = {
            id: Date.now().toString(),
            content: `📍 Location shared (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
            isUser: true,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, locationMessage])
        },
        (error) => {
          console.error('Location error:', error)
          alert('Unable to access location. Please check your browser settings.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏥 AI Health Assistant
        </h1>
        <p className="text-gray-600">
          Your personal healthcare companion with voice input support and location services
        </p>
      </div>

      <Tabs defaultValue="general-chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general-chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            General Health Chat
          </TabsTrigger>
          <TabsTrigger value="location-search" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Healthcare Finder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general-chat" className="space-y-4">
          {/* Notification */}
          {showNotification && speechRecognitionSupported && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Voice Input Available</p>
                    <p className="text-sm text-blue-600">Click the microphone button to speak your questions instead of typing.</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotification(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <Card>
            <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Welcome to your AI Health Assistant!</p>
                  <p className="text-sm">Ask me about symptoms, medications, or general health questions.</p>
                  {speechRecognitionSupported && (
                    <p className="text-sm mt-2 text-blue-600">💡 You can use voice input by clicking the microphone button!</p>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {message.hasVoiceInput && (
                          <Mic className="h-3 w-3 text-blue-300" />
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-900">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "🎤 Listening..." : "Type your health question or use voice input..."}
                disabled={isLoading}
                className={`pr-12 ${isListening ? 'border-green-500 bg-green-50' : ''}`}
              />
            </div>
            
            {speechRecognitionSupported && (
              <Button
                type="button"
                onClick={handleVoiceToggle}
                disabled={isLoading}
                className={`${isListening ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              type="button"
              onClick={handleLocationShare}
              disabled={isLoading}
              variant="outline"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="location-search">
          <LocationChatbot />
        </TabsContent>
      </Tabs>
    </div>
  )
}
