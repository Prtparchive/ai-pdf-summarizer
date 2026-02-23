"use client";

import React, { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import SummaryOptions from '@/components/SummaryOptions';
import SummaryDisplay from '@/components/SummaryDisplay';
import { uploadPDF, generateSummary } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [summaryMode, setSummaryMode] = useState<string>('medium');
    const [isUploading, setIsUploading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsUploading(true);
        setError(null);
        setSummary(null);

        try {
            const result = await uploadPDF(selectedFile);
            setFileId(result.file_id);
        } catch (err: any) {
            setError(err.message || 'Failed to upload PDF');
            setFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSummarize = async () => {
        if (!fileId) return;

        setIsSummarizing(true);
        setError(null);

        try {
            const result = await generateSummary(fileId, summaryMode);
            setSummary(result.summary);
        } catch (err: any) {
            setError(err.message || 'Failed to generate summary');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl w-full mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    AI PDF Summarizer
                </h1>
                <p className="text-lg text-gray-600">
                    Upload your documents and get intelligent summaries in seconds.
                    Tailored for students, researchers, and professionals.
                </p>
            </div>

            <div className="w-full max-w-4xl space-y-8">
                {!summary && (
                    <>
                        <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />

                        {isUploading && (
                            <div className="text-center text-blue-600 flex items-center justify-center mt-4">
                                <Loader2 className="animate-spin mr-2" /> Uploading and processing...
                            </div>
                        )}

                        <div className={`transition-opacity duration-500 ${fileId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <SummaryOptions
                                selectedMode={summaryMode}
                                onOptionChange={setSummaryMode}
                                disabled={!fileId || isSummarizing}
                            />

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleSummarize}
                                    disabled={!fileId || isSummarizing}
                                    className={`
                     px-8 py-3 rounded-full font-bold text-white text-lg shadow-lg transform transition-all
                     ${!fileId || isSummarizing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-xl'}
                   `}
                                >
                                    {isSummarizing ? (
                                        <span className="flex items-center">
                                            <Loader2 className="animate-spin mr-2" /> Generating Summary...
                                        </span>
                                    ) : (
                                        "Generate Summary"
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                        {error}
                    </div>
                )}

                {summary && (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
                        <SummaryDisplay summary={summary} />
                        <div className="text-center mt-8">
                            <button
                                onClick={() => { setSummary(null); setFile(null); setFileId(null); }}
                                className="text-gray-500 hover:text-gray-700 underline"
                            >
                                Summarize another document
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
