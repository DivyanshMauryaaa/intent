import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { data: chats, error } = await supabase
            .from("chats")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[CHATS_GET]", error);
            return new NextResponse("Internal Error", { status: 500 });
        }

        return NextResponse.json(chats);
    } catch (error) {
        console.error("[CHATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await currentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { message } = await req.json(); // Optional: Initial message to help name?
        // For now, just create a default chat. Naming happens later or we use a default.
        // Actually, creating a chat usually implies starting one. 
        // We'll name it "New Chat" by default and renaming happens via AI later.

        const { data, error } = await supabase
            .from("chats")
            .insert({
                user_id: user.id,
                name: "New Chat",
            })
            .select()
            .single();

        if (error) {
            console.error("[CHATS_POST]", error);
            return new NextResponse("Internal Error", { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[CHATS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
