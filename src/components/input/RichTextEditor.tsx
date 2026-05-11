"use client";
import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditorProps {
    label?: string;
    name: string;
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    hint?: string;
    required?: boolean;
    height?: number;
}

export default function RichTextEditor({
    label,
    name,
    value = "",
    onChange,
    placeholder = "Nhập nội dung...",
    hint,
    required = false,
    height = 400
}: RichTextEditorProps) {
    const editorRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [isMounted, setIsMounted] = useState(false);

    // Only render editor on client-side to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    const handleEditorChange = (content: string) => {
        if (onChange) {
            onChange(content);
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                    {label}
                    {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                {!isMounted ? (
                    // Placeholder while loading
                    <div 
                        className="w-full bg-slate-50 flex items-center justify-center border border-slate-200"
                        style={{ height: `${height}px` }}
                    >
                        <div className="text-center space-y-2">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400 font-medium">Đang tải editor...</p>
                        </div>
                    </div>
                ) : (
                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        onInit={(evt, editor) => editorRef.current = editor}
                        value={value}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: height,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding: 10px; }',
                            placeholder: placeholder,
                            branding: false,
                            promotion: false,
                        }}
                    />
                )}
            </div>

            {/* Hidden input to submit with form */}
            <input type="hidden" name={name} value={value} />

            {hint && (
                <p className="text-[10px] text-slate-400 font-medium ml-1 mt-1.5">
                    {hint}
                </p>
            )}
        </div>
    );
}
