import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import actions from "@/lib/actions";

const openai = new OpenAI({
    apiKey: process.env.AIMLAPI_KEY,
    baseURL: "https://api.aimlapi.com/v1",
});

const ACTIONS_SCHEMA = actions.map(action => JSON.stringify({
    slug: action.slug,
    description: action.description,
    parameters: action.parameters
})).join("\n");

const SYSTEM_INSTRUCTION = `
You are a helpful AI assistant.
When you write code or long documents, you MUST use the following artifact format:

<artifact type="code" title="filename.ext">
...code content...
</artifact>


<artifact type="document" title="Document Title">
...markdown content...
</artifact>

<artifact type="action" identifier="slug_of_action" title="Action Title">
{ "parameter_name": "value" }
</artifact>

Use "code" type for any programming code, scripts, or configuration files.
Use "document" type for markdown text, plans, reports, or long explanations that should be distinct from the chat flow.
Use "action" type when you want to propose an action to the user. The content MUST be a valid JSON object containing the parameters for the action. The identifier MUST match a valid action slug from the list below.

Available Actions:
${ACTIONS_SCHEMA}

Keep your normal conversational responses outside of these tags.
`;

export async function POST(req: Request) {
    const { messages, chatId } = await req.json();
    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!chatId) {
        return new Response("Chat ID is required", { status: 400 });
    }

    // Persist User Message
    const lastMessage = messages[messages.length - 1];
    await supabase.from("messages").insert({
        chat_id: chatId,
        role: "user",
        content: lastMessage.content,
    });

    // Prepare messages for OpenAI
    const formattedMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({
            role: m.role === "model" ? "assistant" : m.role, // Handle legacy 'model' role if any
            content: m.content
        }))
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: "claude-3-7-sonnet-20250219", // Or any model supported by AIML API
            messages: formattedMessages,
            stream: false,
            max_tokens: 16384,
        });

        const aiContent = completion.choices[0]?.message?.content || "";

        // Persist AI Response Complete
        if (aiContent) {
            await supabase.from("messages").insert({
                chat_id: chatId,
                role: "assistant",
                content: aiContent,
            });

            // Auto-Generate Title
            const { count } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true })
                .eq("chat_id", chatId);

            if (count && count <= 2) {
                try {
                    const titleCompletion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: "Generate a concise (3-5 words) chat title. Do not use quotes." },
                            { role: "user", content: `Message: "${lastMessage.content}"` }
                        ],
                    });
                    const title = titleCompletion.choices[0]?.message?.content?.trim();

                    if (title) {
                        await supabase.from("chats").update({ name: title }).eq("id", chatId);
                    }
                } catch (e) {
                    console.error("Failed to generate title", e);
                }
            }
        }

        return new Response(aiContent, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return new Response("Failed to generate response", { status: 500 });
    }
}
