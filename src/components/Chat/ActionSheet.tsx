import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import actions from "@/lib/actions";
import { Check, Loader2, Play } from "lucide-react";

interface ActionSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    identifier: string;
    initialData: Record<string, any>;
    title: string;
}

export function ActionSheet({ open, onOpenChange, identifier, initialData, title }: ActionSheetProps) {
    const actionDef = actions.find(a => a.slug === identifier);
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [executing, setExecuting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData, open]);

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleExecute = async () => {
        setExecuting(true);
        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log(`Executing action "${identifier}" with data:`, formData);

        setExecuting(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onOpenChange(false);
        }, 1500);
    };

    if (!actionDef) return null;

    const properties = actionDef.parameters.properties || {};

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto  w-[40%]">
                <SheetHeader className="mb-6">
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {actionDef.description}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {Object.entries(properties).map(([key, schema]: [string, any]) => {
                        const isArray = schema.type === 'array';
                        const isObject = schema.type === 'object';
                        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

                        // Handle array inputs (simplified as comma-separated string for now)
                        if (isArray) {
                            const value = Array.isArray(formData[key]) ? formData[key].join(', ') : (formData[key] || '');

                            return (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={key} className="font-medium">{label}</Label>
                                    <Input
                                        id={key}
                                        value={value}
                                        onChange={(e) => handleChange(key, e.target.value.split(',').map((s: string) => s.trim()))}
                                        placeholder={`Comma separated ${schema.title || 'values'}...`}
                                        className="rounded-lg"
                                    />
                                    {schema.description && <p className="text-xs text-muted-foreground">{schema.description}</p>}
                                </div>
                            );
                        }

                        // Handle primitive inputs
                        const isTextArea = schema.description?.toLowerCase().includes("body") || schema.description?.toLowerCase().includes("description");

                        return (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="font-medium">{label}</Label>
                                {isTextArea ? (
                                    <Textarea
                                        id={key}
                                        value={formData[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        placeholder={schema.description}
                                        className="min-h-[100px] rounded-lg resize-y"
                                    />
                                ) : (
                                    <Input
                                        id={key}
                                        type={key.toLowerCase().includes('password') ? 'password' : 'text'}
                                        value={formData[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        placeholder={schema.description}
                                        className="rounded-lg"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <SheetFooter className="mt-8">
                    <Button
                        onClick={handleExecute}
                        disabled={executing || success}
                        className={`w-full py-6 text-lg transition-all ${success ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                        {executing ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : success ? (
                            <>
                                <Check className="mr-2 h-5 w-5" />
                                Executed!
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-5 w-5" />
                                Execute Action
                            </>
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
