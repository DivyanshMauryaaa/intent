import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

import { ArtifactRenderer } from "./ArtifactRenderer";

interface MessageBubbleProps {
    role: "user" | "assistant" | "system" | "data";
    content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === "user";

    // Helper to parse content for artifacts
    const renderContent = (text: string) => {
        if (isUser) return <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{text}</ReactMarkdown></div>;

        const parts = [];
        const regex = /<artifact\s+type="([^"]+)"(?:\s+identifier="([^"]+)")?\s+title="([^"]+)">([\s\S]*?)<\/artifact>/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Push preceding text if any
            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    content: text.slice(lastIndex, match.index),
                });
            }

            // Push artifact
            // Match group 1: type
            // Match group 2: identifier (optional)
            // Match group 3: title
            // Match group 4: content
            parts.push({
                type: "artifact",
                artifactType: match[1] as "code" | "document" | "action",
                identifier: match[2],
                title: match[3],
                content: match[4].trim(),
            });

            lastIndex = regex.lastIndex;
        }

        // Push remaining text
        if (lastIndex < text.length) {
            parts.push({
                type: "text",
                content: text.slice(lastIndex),
            });
        }

        return parts.map((part, idx) => {
            if (part.type === "text") {
                if (!part.content) return null;
                return (
                    <div key={idx} className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{part.content}</ReactMarkdown>
                    </div>
                );
            } else {
                return (
                    <ArtifactRenderer
                        key={idx}
                        type={part.artifactType as "code" | "document" | "action"}
                        title={part.title!}
                        content={part.content!}
                        identifier={part.identifier}
                    />
                );
            }
        });
    };

    return (
        <div
            className={cn(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "rounded-2xl px-4 py-2 text-sm py-4",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    !isUser && "w-full"
                )}
            >
                {renderContent(content)}
            </div>
        </div>
    );
}
