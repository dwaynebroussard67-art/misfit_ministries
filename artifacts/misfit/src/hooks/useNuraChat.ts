import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useNuraChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef<string>(Math.random().toString(36).substring(7));

  const sendMessage = useCallback(
    async (userMessage: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message to history
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Get Nura response
        const response = await axios.post('/api/nura/chat', {
          message: userMessage,
          sessionId: sessionIdRef.current,
          history: messages,
        });

        const { reply, crisis_flag, refer_988 } = response.data;

        // Add Nura response to history
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        // Generate voice if enabled
        if (voiceEnabled) {
          try {
            const voiceResponse = await axios.post(
              '/api/nura/voice',
              { text: reply },
              { responseType: 'arraybuffer' }
            );

            const audioBlob = new Blob([voiceResponse.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
              audioRef.current.src = audioUrl;
              audioRef.current.play().catch(err => console.error('Audio playback error:', err));
            }
          } catch (voiceError) {
            console.error('Voice synthesis error:', voiceError);
            // Fall back to text-only if voice fails
          }
        }

        return { reply, crisis_flag, refer_988 };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, voiceEnabled]
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => !prev);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    voiceEnabled,
    toggleVoice,
    error,
    audioRef,
  };
}
