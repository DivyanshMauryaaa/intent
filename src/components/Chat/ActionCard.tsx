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
            <Card className="w-full max-w-sm border-2 border-primary/20 bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Play className="h-4 w-4" />
                        </div>
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-sm text-muted-foreground">
                    <p>Ready to configure and execute.</p>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4">
                    <Button onClick={() => setOpen(true)} className="w-full cursor-pointer">
                        Setup Action
                    </Button>
                </CardFooter>
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
