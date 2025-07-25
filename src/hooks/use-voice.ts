import { useState, useRef, useCallback, useEffect } from 'react';

// Type definitions for Web Speech API
// Remove custom SpeechRecognition interfaces to avoid type conflicts with the browser's built-in types.

interface UseVoiceProps {
  onTranscript?: (transcript: string) => void;
  language?: string;
}

interface UseVoiceReturn {
  // Speech Recognition
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  
  // Speech Synthesis
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  
  // Browser support
  speechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
}

export const useVoice = ({ onTranscript, language = 'en-US' }: UseVoiceProps = {}): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  const speechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const speechSynthesisSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window;

  // Initialize speech recognition
  useEffect(() => {
    if (!speechRecognitionSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };
  // (Removed duplicate and incorrect redeclaration of recognitionRef)
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript, speechRecognitionSupported]);

  const startListening = useCallback(() => {
    if (!speechRecognitionSupported || !recognitionRef.current) return;
    
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [speechRecognitionSupported]);

  const stopListening = useCallback(() => {
    if (!speechRecognitionSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [speechRecognitionSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechSynthesisSupported || !text.trim()) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speechSynthesisSupported]);

  const stopSpeaking = useCallback(() => {
    if (!speechSynthesisSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [speechSynthesisSupported]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSpeaking,
    speak,
    stopSpeaking,
    speechRecognitionSupported,
    speechSynthesisSupported,
  };
};

// Type declarations for browsers that might not have these types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
