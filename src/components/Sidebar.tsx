"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MessageSquare, Trash2, KeyIcon, WorkflowIcon, Settings, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Chat {
    id: string;
    name: string;
    created_at: string;
}

import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import SettingsPage from "@/app/settings/page";

export function Sidebar() {
    const [chats, setChats] = useState<Chat[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentChatId = searchParams.get("chatId");

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch("/api/chats");
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const navigateTo = async (path: string) => {
        router.push(path)
    };

    const deleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
            if (res.ok) {
                setChats(chats.filter((c) => c.id !== chatId));
                if (currentChatId === chatId) {
                    router.push("/");
                }
            }
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    return (
        <div className="w-[300px] border-r h-screen flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border">
            <div className="p-6 border-b border-sidebar-border">
                <div className="flex justify-between items-center w-full mb-6">
                    <Link href={'/'}>
                        <p className="text-4xl font-thin text-foreground">Intent.ai</p>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <UserButton />
                    </div>
                </div>

                <div className="space-y-2">
                    <Button className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" variant={'ghost'} onClick={() => navigateTo('/integrations')}><KeyIcon className="mr-2 h-4 w-4" /> Integrations</Button>
                    <Button className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" variant={'ghost'} onClick={() => navigateTo('/automations')}><WorkflowIcon className="mr-2 h-4 w-4" /> Automations</Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" variant={'ghost'}><Settings className="mr-2 h-4 w-4" /> Settings</Button>
                        </DialogTrigger>
                        <DialogContent className="w-4xl">
                            <DialogHeader>
                                <DialogTitle>Settings</DialogTitle>
                                <DialogDescription>
                                    Make changes to your settings here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <SettingsPage isPage={false} />
                        </DialogContent>
                    </Dialog>

                    <Button className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" variant={'ghost'} onClick={() => navigateTo('/workspace')}><Folder className="mr-2 h-4 w-4" /> Workspace</Button>
                    <Button className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" variant={'ghost'} onClick={() => navigateTo('/')}><Plus className="mr-2 h-4 w-4" /> New Chat</Button>
                </div>

            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => router.push(`/?chatId=${chat.id}`)}
                        className={cn(
                            "p-3 rounded-lg text-sm cursor-pointer flex justify-between group items-center transition-colors px-3",
                            currentChatId === chat.id
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "hover:bg-sidebar-accent text-sidebar-foreground"
                        )}
                    >
                        <div className="flex items-center gap-3 truncate flex-1">
                            <MessageSquare size={16} className={cn("min-w-[16px]", currentChatId === chat.id ? "text-sidebar-primary-foreground/70" : "text-muted-foreground")} />
                            <span className="truncate">{chat.name}</span>
                        </div>
                        <button
                            onClick={(e) => deleteChat(e, chat.id)}
                            className={cn(
                                "opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-opacity",
                                currentChatId === chat.id && "hover:bg-white/20 hover:text-white"
                            )}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}