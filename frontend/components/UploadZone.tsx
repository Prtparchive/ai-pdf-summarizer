"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    isUploading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isUploading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndSelect(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSelect(e.target.files[0]);
        }
    };

    const validateAndSelect = (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        // Limit size if needed, e.g., 50MB
        if (file.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit.');
            return;
        }

        setFileName(file.name);
        setError(null);
        onFileSelect(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400 bg-white/50'}
          ${fileName ? 'border-green-500 bg-green-50/30' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileInput}
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${fileName ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {fileName ? <CheckCircle size={40} /> : <Upload size={40} />}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {fileName ? 'File Selected' : 'Upload your PDF'}
                        </h3>
                        <p className="text-gray-500">
                            {fileName ? fileName : 'Drag & drop or click to browse'}
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center text-red-500 text-sm mt-2">
                            <AlertCircle size={16} className="mr-1" />
                            {error}
                        </div>
                    )}

                    {!fileName && (
                        <div className="text-xs text-gray-400 mt-4">
                            Max file size: 50MB. text-based PDFs only.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadZone;
