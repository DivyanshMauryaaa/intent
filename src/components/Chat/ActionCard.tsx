import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { ActionSheet } from './ActionSheet';
import { useState } from "react";

interface ActionCardProps {
    identifier: string;
    title: string;
    content: string; // JSON string of parameters
}

export function ActionCard({ identifier, title, content }: ActionCardProps) {
    const [open, setOpen] = useState(false);

    let parsedContent = {};
    try {
        parsedContent = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse action content", e);
    }

    return (
        <div className="w-full my-4">
            <Card className="w-full hover:bg-primary/5 bg-card overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
                <CardHeader className="">
                    <CardTitle className="text-xl flex items-center gap-2">
                        {title}
                    </CardTitle>
                </CardHeader>
            </Card>

            <ActionSheet
                open={open}
                onOpenChange={setOpen}
                identifier={identifier}
                initialData={parsedContent}
                title={title}
            />
        </div>
    );
}
