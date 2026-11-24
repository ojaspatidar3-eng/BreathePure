import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AqiReading, ChatMessage, RecommendationItem } from '../services/types';
import { api } from '../services/api';
import { RecommendationCard } from '../components/RecommendationCard';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Cpu,
  Trash2,
  Filter
} from 'lucide-react';

interface AssistantPageProps {
  profile: UserProfile;
  aqiReading: AqiReading | null;
  onOpenProfile: () => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({
  profile,
  aqiReading,
  onOpenProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am BreathePure, your intelligent environmental companion. I have reviewed your profile for ${profile.city} (household of ${profile.household_size}, commuting via ${profile.primary_transportation.split('(')[0]}). Outdoor AQI is currently registered at ${aqiReading ? `${aqiReading.aqi} (${aqiReading.category})` : 'telemetry baseline'}. How can I help you safeguard your family and reduce daily emissions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState<string>('deterministic_demo');
  const [modelName, setModelName] = useState<string>('Deterministic Demo Engine');
  const [filterType, setFilterType] = useState<'all' | 'exposure' | 'emission'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'How do I protect my asthmatic senior and infant during winter smog?',
    'What is the best way to ventilate our apartment today?',
    'How can I reduce emissions during my daily commute?',
    'Are ionic or ozone air purifiers safe for children?',
    'What are sustainable alternatives to burning garden waste?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setLoading(true);

    try {
      const response = await api.sendChat({
        message: textToSend,
        profile: profile,
        aqi_data: aqiReading,
        conversation_history: messages.slice(-4),
      });

      setAiMode(response.ai_mode);
      setModelName(response.model_name);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured_recommendations: response.structured_recommendations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'I encountered an issue connecting to the AI service. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. Injected profile: ${profile.city} (${profile.household_size} members). How can I guide you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="py-4 space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Telemetry & Injected Context Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <span>Context Injected: {profile.city}</span>
              {aqiReading && (
                <span
                  className="text-[10px] px-2 py-0.2 rounded text-white font-bold"
                  style={{ backgroundColor: aqiReading.category_color }}
                >
                  AQI {aqiReading.aqi} ({aqiReading.category})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Household: {profile.household_size} p | Transit: {profile.primary_transportation.split('(')[0]} | Fuel: {profile.cooking_fuel.split('/')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{modelName}</span>
          </span>
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                    isUser
                      ? 'bg-slate-800'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble Content */}
                <div className={`space-y-3 flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-xs text-left'
                        : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`block text-[10px] mt-1.5 opacity-70 ${
                        isUser ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Render Structured Recommendation Cards if present */}
                  {msg.structured_recommendations && msg.structured_recommendations.length > 0 && (
                    <div className="space-y-2 pt-2 text-left">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Validated Environmental Recommendations ({msg.structured_recommendations.length}):
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {msg.structured_recommendations.map((rec, rIdx) => (
                          <RecommendationCard key={rIdx} item={rec} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-500 ml-2 font-medium">
                    Applying context injection & safety checking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap custom-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Composer Bar */}
        <div className="p-3 md:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask BreathePure about smog precautions, clean commuting, or indoor air..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex-shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Safety Notice Footer */}
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Non-medical advisory. BreathePure provides environmental exposure prevention guidance. Consult a licensed physician for clinical respiratory emergencies.
          </p>
        </div>
      </div>
    </div>
  );
};
