import { useState } from 'react';
import { useNuraChat } from '../hooks/useNuraChat.js';
import { useNarcanWatch } from '../hooks/useNarcanWatch.js';

export default function NuraChat() {
  const { messages, sendMessage, isLoading, voiceEnabled, toggleVoice, audioRef } = useNuraChat();
  const { triggerHelpNow } = useNarcanWatch();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gold">Talk to Nura</h1>
            <button
              onClick={toggleVoice}
              className={`px-4 py-2 rounded font-bold transition ${
                voiceEnabled
                  ? 'bg-gold text-dark hover:bg-yellow-600'
                  : 'bg-dark-border text-text-secondary hover:bg-dark'
              }`}
            >
              {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
            </button>
          </div>
          <p className="text-text-secondary mb-4">
            A motherly AI companion grounded in Ethiopian Orthodox theology. Here to listen, guide, and point you to Jesus Christ.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="bg-surface rounded-lg p-6 mb-6 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-text-secondary py-12">
              <p className="text-lg mb-4">Hello, friend. I'm Nura.</p>
              <p>What's on your heart today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-dark-border ml-8 text-right'
                      : 'bg-gold bg-opacity-10 mr-8'
                  }`}
                >
                  <p className={msg.role === 'user' ? 'text-text-primary' : 'text-gold'}>
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Tell me what's on your mind..."
            className="flex-1 bg-dark-border text-text-primary px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gold text-dark px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </form>

        {/* Crisis Alert Button */}
        <div className="mt-6 p-4 bg-red bg-opacity-10 border border-red rounded-lg">
          <p className="text-red font-bold mb-2">In Crisis?</p>
          <button
            onClick={() => triggerHelpNow()}
            className="w-full bg-red text-dark px-4 py-2 rounded font-bold hover:bg-red-700 transition"
          >
            🆘 Help Now - Misfit First Responders
          </button>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
}
