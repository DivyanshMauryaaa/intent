"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/Chat/ChatWindow";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);

    try {
      // Create chat
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({})
      });

      if (res.ok) {
        const newChat = await res.json();
        // Save pending message for ChatWindow to consume
        localStorage.setItem("pendingMessage", inputValue);
        router.push(`/?chatId=${newChat.id}`);
      }
    } catch (error) {
      console.error("Failed to start chat", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateChat();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background relative">
        {chatId ? (
          <ChatWindow chatId={chatId} />
        ) : (
          <div className="p-6 flex flex-col justify-center h-[99vh] w-full items-center">
            <div className="w-full max-w-2xl">
              <p className="text-3xl font-thin">Sup {user?.firstName}!</p>
              <p className="text-4xl font-thin mb-8">What's on your mind today?</p>

              <div className="relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell me what you want to automate, do or chat about your workspace"
                  className="resize-none min-h-[100px] focus:outline-none focus:ring-0 max-h-[400px] w-full p-4 pr-16 text-lg shadow-sm rounded-xl border-border focus:border-ring focus:ring-0 bg-background"
                />
                <Button
                  onClick={handleCreateChat}
                  className="absolute right-3 bottom-3 h-10 w-10 rounded-lg cursor-pointer"
                  size="icon"
                  disabled={!inputValue.trim() || loading}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>

              <div>
                <Link href="/integrations">
                  <Button variant={'secondary'} className="w-full py-5 mt-4 cursor-pointer">

                    <div className="flex">
                      <Image
                        src={'/notion.png'}
                        height={20}
                        width={20}
                        alt="Notion"
                      />
                      <Image
                        src={'/slack.png'}
                        height={20}
                        width={20}
                        alt="Slack"
                      />
                      <Image
                        src={'/google.webp'}
                        height={20}
                        width={20}
                        alt="Google"
                      />
                    </div>


                    Make Intent work with your favourite apps
                  </Button>
                </Link>
              </div>

              <div className="flex gap-3 mt-4">
                <div className="w-[33%] border border-border rounded-xl p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => setInputValue("Help me Automate my social media, make sure that whenever I run this workflow. It automatically creates a video with veo3 and posts it on Instagram.")}>
                  Automate Social media posts
                </div>
                <div className="w-[33%] border border-border rounded-xl p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => setInputValue("Email the team about the meeting that's going to happen on 4:00PM. It's in the 'Members.csv' file.")}>
                  Remind the team about the meeting
                </div>
                <div className="w-[33%] border border-border rounded-xl p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => setInputValue("Email the client about demanding the project details for their latest request. Check the latest project I'm working on.")}>
                  Finalize client project details and forward to the team
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}