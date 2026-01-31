"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ActionDetailsPanel } from "./ActionDetailsPanel";
import { ArrowUp, X } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
    chatId: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [selectedAction, setSelectedAction] = useState<{ identifier: string; title: string; initialData: Record<string, any> } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages when chatId changes
    useEffect(() => {
        setLoading(true);
        fetch(`/api/chats/${chatId}`)
            .then((res) => {
                if (res.ok) return res.json();
                return [];
            })
            .then((data) => {
                setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
                setLoading(false);

                // Check for pending message from Empty State
                const pending = localStorage.getItem("pendingMessage");
                if (pending) {
                    localStorage.removeItem("pendingMessage");
                    sendMessage(pending, data); // Pass current data effectively as history
                }
            });
    }, [chatId]);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streaming]);

    const sendMessage = async (msgContent: string, currentHistory: Message[] = messages) => {
        if (!msgContent.trim()) return;

        const newMessage: Message = { role: "user", content: msgContent };
        const updatedMessages = [...currentHistory.map(m => ({ ...m })), newMessage];

        // Optimistic Update
        setMessages(updatedMessages);
        setInput("");
        setStreaming(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    chatId,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const aiContent = await response.text();

            // Add placeholder AI message
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            // Animate typing (approx 0.5s total duration)
            const duration = 500; // ms
            const stepTime = 10; // ms per update
            const totalSteps = duration / stepTime;
            const charsPerStep = Math.ceil(aiContent.length / totalSteps);

            let currentIndex = 0;
            const interval = setInterval(() => {
                currentIndex += charsPerStep;
                if (currentIndex >= aiContent.length) {
                    currentIndex = aiContent.length;
                    clearInterval(interval);
                    setStreaming(false);
                }

                const currentText = aiContent.slice(0, currentIndex);
                setMessages((prev) => {
                    const newMsgs = [...prev];
                    const lastMsg = newMsgs[newMsgs.length - 1];
                    if (lastMsg.role === "assistant") {
                        lastMsg.content = currentText;
                    }
                    return newMsgs;
                });
            }, stepTime);

        } catch (error) {
            console.error("Failed to send message", error);
            setStreaming(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center h-full">Loading chat...</div>;
    }

    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-1 flex flex-col h-full relative min-w-0 transition-all duration-300">
                <div className="flex-1 overflow-y-auto p-4 pb-32 w-full max-w-4xl mx-auto no-scrollbar" ref={scrollRef}>
                    {messages.map((m, index) => (
                        <MessageBubble
                            key={index}
                            role={m.role as any}
                            content={m.content}
                            onActionClick={setSelectedAction}
                        />
                    ))}
                    {streaming && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                        <div className="flex w-full mb-4 justify-start">
                            <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-2 text-sm italic">Thinking...</div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 w-full px-4 flex justify-center z-10">
                    <div className="w-full max-w-3xl relative">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="resize-none min-h-[60px] bg-gray-50 dark:bg-gray-950 max-h-[200px] w-full py-4 pr-16 bg-background shadow-lg rounded-2xl border-input focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(input);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 bottom-3 rounded-xl h-10 w-10"
                                disabled={!input.trim() || streaming}
                            >
                                <ArrowUp className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {selectedAction && (
                <div className="w-[45%] border-l bg-background h-full flex flex-col shadow-xl z-20 transition-all duration-300">
                    <div className="p-2 border-b flex justify-between items-center bg-muted/30">
                        <span className="font-semibold px-2 text-sm text-muted-foreground">Action Details</span>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedAction(null)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <ActionDetailsPanel
                            identifier={selectedAction.identifier}
                            initialData={selectedAction.initialData}
                            onChange={(newData) => {
                                setSelectedAction(prev => prev ? { ...prev, initialData: newData } : null);
                            }}
                            onExecute={async (data) => {
                                console.log("Executing action:", data);
                                // Optional: Insert execution logic here
                            }}
                            mode="sidebar"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
