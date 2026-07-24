import { useState } from 'react';
import { Send } from 'lucide-react';

export default function AiCenterPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'system', text: string }>>([
    { sender: 'system', text: 'Welcome to the AI Center. Ask me to run decision optimization queries, generate simulations, or evaluate strategic alternatives.' }
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: prompt },
      { sender: 'system', text: `Analyzing option: "${prompt}" using Monte Carlo simulation. Estimated utility score: 84.5% (±3.2%). Recommend proceeding with phased rollout.` }
    ]);
    setPrompt('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-lg">
      {/* Thread Window */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xl px-4 py-3 rounded-lg text-sm shadow ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-muted text-foreground border border-border rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-border bg-card/50 flex space-x-3">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Evaluate resource allocation alternatives for Q3..."
          className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button 
          onClick={handleSend}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg flex items-center space-x-2 text-sm transition-colors"
        >
          <Send className="h-4 w-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
