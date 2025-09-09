import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitAiPrompt } from '../../features/qms/qmsSlice';
import { BrainCircuit, Send, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiAssistant = () => {
    const [prompt, setPrompt] = useState('');
    const dispatch = useDispatch();
    const { response, status } = useSelector((state) => state.qms.ai) || {};

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            dispatch(submitAiPrompt(prompt));
            setPrompt('');
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        dispatch(submitAiPrompt(suggestion));
    };
    
    const suggestions = [
        "Summarize all open events.",
        "Show me the high-risk events.",
        "What are the main trends?",
    ];

    return (
        <div className="card flex flex-col h-full">
            <header className="p-4 border-b border-border flex items-center gap-3">
                <span className="p-2 bg-primary-100 rounded-full text-primary-600"><BrainCircuit size={20} /></span>
                <h3 className="font-semibold text-lg text-text-primary">AI Assistant</h3>
            </header>
            
            <div className="flex-grow p-4 overflow-y-auto text-sm space-y-4">
                <div className="bg-primary-50 border border-primary-200 text-text-primary p-3 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary-700"><Lightbulb size={16} /> Try asking me:</h4>
                    <ul className="space-y-1">
                       {suggestions.map(s => (
                           <li key={s}>
                               <button onClick={() => handleSuggestionClick(s)} className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline">
                                   {s}
                               </button>
                           </li>
                       ))}
                    </ul>
                </div>
                {response && (
                    <div className="bg-background p-3 rounded-lg prose prose-sm max-w-none text-text-primary prose-strong:text-text-primary">
                       <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-border">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask about these events..."
                        className="form-input rounded-full pr-10"
                        disabled={status === 'loading'}
                    />
                    <button type="submit" title="Send" className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 disabled:opacity-50" disabled={status === 'loading' || !prompt.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiAssistant;