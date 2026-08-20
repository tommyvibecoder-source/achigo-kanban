import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAiPrompt, AiPromptTarget } from '../../services/aiPromptGenerator';
import {
  Bot,
  Copy,
  Check,
  X,
  Sparkles,
  Terminal,
  Cpu
} from 'lucide-react';

export const AiPromptModal: React.FC = () => {
  const {
    aiPromptModalIdea,
    setAiPromptModalIdea,
    activeProject,
    teamMembers,
  } = useApp();

  const [target, setTarget] = useState<AiPromptTarget>('antigravity');
  const [copied, setCopied] = useState(false);

  if (!aiPromptModalIdea || !activeProject) return null;

  const promptText = generateAiPrompt(aiPromptModalIdea, activeProject, teamMembers, target);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <span>AI Coding Agent Brief Exporter</span>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  {aiPromptModalIdea.issueKey}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Ready-to-paste prompt for your autonomous AI development team
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiPromptModalIdea(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target AI Selection Tabs */}
        <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex space-x-1 bg-slate-200/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setTarget('antigravity')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-colors ${
                target === 'antigravity'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Antigravity</span>
            </button>
            <button
              onClick={() => setTarget('claude')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-colors ${
                target === 'claude'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Claude Code</span>
            </button>
            <button
              onClick={() => setTarget('openwork')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-colors ${
                target === 'openwork'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>Openwork / Other</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
          </button>
        </div>

        {/* Prompt Content Preview */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed selection:bg-blue-800">
          <pre className="whitespace-pre-wrap">{promptText}</pre>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>💡 Paste into your AI coding tool prompt box to start building.</span>
          <button
            onClick={() => setAiPromptModalIdea(null)}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
