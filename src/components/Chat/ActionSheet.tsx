import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { ActionDetailsPanel } from "./ActionDetailsPanel";

interface ActionSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    identifier: string;
    initialData: Record<string, any>;
    title: string;
}

export function ActionSheet({ open, onOpenChange, identifier, initialData, title }: ActionSheetProps) {
    // This component now strictly acts as the "Overlay" wrapper for the action details.

    // Internal handler for updates - in a real app this might sync back to a parent
    const [currentData, setCurrentData] = useState(initialData);

    useEffect(() => {
        setCurrentData(initialData);
    }, [initialData, open]);

    const handleExecute = async (data: Record<string, any>) => {
        // Simulate execution
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Executing overlay action "${identifier}" with data:`, data);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[60%] sm:max-w-md overflow-y-auto">
                <ActionDetailsPanel
                    identifier={identifier}
                    initialData={currentData}
                    onChange={setCurrentData}
                    onExecute={handleExecute} // Execution allowed in overlay
                    mode="overlay"
                />
            </SheetContent>
        </Sheet>
    );
}

