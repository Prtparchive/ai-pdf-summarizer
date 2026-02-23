"use client";

import React from 'react';
import { Settings, BookOpen, List, AlignLeft } from 'lucide-react';

interface SummaryOptionsProps {
    onOptionChange: (mode: string) => void;
    selectedMode: string;
    disabled: boolean;
}

const SummaryOptions: React.FC<SummaryOptionsProps> = ({ onOptionChange, selectedMode, disabled }) => {
    const options = [
        {
            id: 'short',
            label: 'TL;DR',
            description: 'Quick overview (~200 words)',
            icon: <AlignLeft size={20} />,
        },
        {
            id: 'medium',
            label: 'Study Notes',
            description: 'Key points & concepts',
            icon: <List size={20} />,
        },
        {
            id: 'detailed',
            label: 'Detailed',
            description: 'In-depth analysis',
            icon: <BookOpen size={20} />,
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onOptionChange(option.id)}
                        disabled={disabled}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-200 text-left
              ${selectedMode === option.id
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <div className={`mb-3 p-2 rounded-lg w-fit ${selectedMode === option.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {option.icon}
                        </div>
                        <h4 className="font-semibold text-gray-800">{option.label}</h4>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SummaryOptions;
