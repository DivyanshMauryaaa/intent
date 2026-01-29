import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const user = await currentUser();
    const { chatId } = await params;

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // First verify ownership of the chat
        const { data: chat, error: chatError } = await supabase
            .from("chats")
            .select("*")
            .eq("id", chatId)
            .eq("user_id", user.id)
            .single();

        if (chatError || !chat) {
            return new NextResponse("Chat not found", { status: 404 });
        }

        // Fetch messages
        const { data: messages, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true });

        if (messagesError) {
            console.error("[CHAT_GET_MESSAGES]", messagesError);
            return new NextResponse("Internal Error", { status: 500 });
        }

        return NextResponse.json(messages);
    } catch (error) {
        console.error("[CHAT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const user = await currentUser();
    const { chatId } = await params;

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { error } = await supabase
            .from("chats")
            .delete()
            .eq("id", chatId)
            .eq("user_id", user.id);

        if (error) {
            console.error("[CHAT_DELETE]", error);
            return new NextResponse("Internal Error", { status: 500 });
        }

        return new NextResponse("Chat deleted", { status: 200 });
    } catch (error) {
        console.error("[CHAT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const user = await currentUser();
    const { chatId } = await params;
    const { name } = await req.json();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
        return new NextResponse("Name is required", { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("chats")
            .update({ name })
            .eq("id", chatId)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("[CHAT_PATCH]", error);
            return new NextResponse("Internal Error", { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[CHAT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
