import React, { useState } from "react";
import { Code, FileText, Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

import { ActionCard } from "./ActionCard";

interface ArtifactRendererProps {
    type: "code" | "document" | "action";
    title: string;
    content: string;
    identifier?: string;
    onActionClick?: (data: { identifier: string; title: string; initialData: Record<string, any> }) => void;
}

export function ArtifactRenderer({ type, title, content, identifier, onActionClick }: ArtifactRendererProps) {
    const [copied, setCopied] = useState(false);

    if (type === "action" && identifier) {
        return <ActionCard identifier={identifier} title={title} content={content} onSelect={onActionClick} />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 border border-border rounded-lg overflow-hidden bg-card shadow-sm w-full">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {type === "code" ? (
                        <Code className="h-4 w-4 text-blue-500" />
                    ) : (
                        <FileText className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="truncate max-w-[200px] text-foreground">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                        title="Copy content"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </button>
                    {type === "code" && (
                        <span className="text-xs text-muted-foreground uppercase">Code</span>
                    )}
                    {type === "document" && (
                        <span className="text-xs text-muted-foreground uppercase">Doc</span>
                    )}
                </div>
            </div>
            <div className="p-4 bg-card overflow-x-auto">
                {type === "code" ? (
                    <pre className="text-sm font-mono text-foreground whitespace-pre">
                        <code>{content}</code>
                    </pre>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
