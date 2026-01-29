import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

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

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `
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
Use "action" type when you want to propose an action to the user. The content MUST be a valid JSON object containing the parameters for the action. The identifier MUST match a valid action slug.
Keep your normal conversational responses outside of these tags.
`,
    });

    const chatHistory = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
    }));

    const chatSession = model.startChat({
        history: chatHistory,
        generationConfig: {
            maxOutputTokens: 8000,
        },
    });

    const result = await chatSession.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            let accumulatedText = "";
            try {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    accumulatedText += chunkText;
                    controller.enqueue(encoder.encode(chunkText));
                }

                // Persist AI Response Complete
                if (accumulatedText) {
                    await supabase.from("messages").insert({
                        chat_id: chatId,
                        role: "assistant",
                        content: accumulatedText,
                    });

                    // Auto-Generate Title
                    const { count } = await supabase
                        .from("messages")
                        .select("*", { count: "exact", head: true })
                        .eq("chat_id", chatId);

                    if (count && count <= 2) {
                        const titleModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                        const titleResult = await titleModel.generateContent(`Generate a concise (3-5 words) chat title for this message: "${lastMessage.content}". Do not use quotes.`);
                        const title = titleResult.response.text();

                        if (title) {
                            await supabase.from("chats").update({ name: title }).eq("id", chatId);
                        }
                    }
                }

                controller.close();
            } catch (error) {
                console.error("Stream error:", error);
                controller.error(error);
            }
        },
    });

    return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
