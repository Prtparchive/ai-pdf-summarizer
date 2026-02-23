"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check } from 'lucide-react';

interface SummaryDisplayProps {
    summary: string;
    markdownContent?: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([summary], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Generated Summary</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                        title="Download as Markdown"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="p-8 prose prose-blue max-w-none text-gray-900">
                {/* We will need to install react-markdown: npm install react-markdown */}
                <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SummaryDisplay;
