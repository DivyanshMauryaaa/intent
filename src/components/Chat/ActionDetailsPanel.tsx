import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import actions from "@/lib/actions";
import { Check, Loader2, Play, Maximize2 } from "lucide-react";

interface ActionDetailsPanelProps {
    identifier: string;
    initialData: Record<string, any>;
    onChange: (data: Record<string, any>) => void;
    onExecute?: (data: Record<string, any>) => Promise<void>;
    onExpand?: () => void; // For opening the overlay
    mode?: "sidebar" | "overlay";
}

import { WorkflowEditorWrapper } from "./WorkflowEditorWrapper";

interface ActionDetailsPanelProps {
    identifier: string;
    initialData: Record<string, any>;
    onChange: (data: Record<string, any>) => void;
    onExecute?: (data: Record<string, any>) => Promise<void>;
    onExpand?: () => void; // For opening the overlay
    mode?: "sidebar" | "overlay";
}

export function ActionDetailsPanel({
    identifier,
    initialData,
    onChange,
    onExecute,
    onExpand,
    mode = "sidebar"
}: ActionDetailsPanelProps) {
    const actionDef = actions.find(a => a.slug === identifier);
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [executing, setExecuting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (key: string, value: any) => {
        const newData = { ...formData, [key]: value };
        setFormData(newData);
        onChange(newData);
    };

    const handleExecuteClick = async () => {
        if (!onExecute) return;
        setExecuting(true);
        try {
            await onExecute(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (e) {
            console.error(e);
        } finally {
            setExecuting(false);
        }
    };

    if (!actionDef) return <div className="p-4">Action not found</div>;

    // Special handling for Workflow Editor
    if (identifier === 'run_workflow') {
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-lg font-semibold">{actionDef.slug}</h3>
                        <p className="text-sm text-muted-foreground">{actionDef.description}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden min-h-[400px]">
                    <WorkflowEditorWrapper
                        initialNodes={formData.nodes || []}
                        initialEdges={formData.edges || []}
                        onChange={(data) => {
                            // Debounce or direct update? Direct for now.
                            // We need to merge this back into formData
                            // But we shouldn't trigger a full re-render of this wrapper if we can avoid it?
                            // Wrapper has its own state. passing initialNodes only affects mount.
                            // Updating formData here is for the Execute button at the bottom.
                            setFormData(prev => ({ ...prev, nodes: data.nodes, edges: data.edges }));
                            onChange({ ...formData, nodes: data.nodes, edges: data.edges });
                        }}
                    />
                </div>
                {onExecute && (
                    <div className="mt-4 pt-4 border-t">
                        <Button
                            onClick={handleExecuteClick}
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
                                    Run Workflow
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    const properties = actionDef.parameters.properties || {};

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{actionDef.slug}</h3>
                    <p className="text-sm text-muted-foreground">{actionDef.description}</p>
                </div>
                {mode === "sidebar" && onExpand && (
                    <Button variant="ghost" size="icon" onClick={onExpand} title="Edit Properties (Overlay)">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                {Object.entries(properties).map(([key, schema]: [string, any]) => {
                    const isArray = schema.type === 'array';
                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

                    if (isArray) {
                        const value = Array.isArray(formData[key]) ? formData[key].join(', ') : (formData[key] || '');
                        return (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="font-medium">{label}</Label>
                                <Textarea
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
                                <Textarea
                                    id={key}
                                    value={formData[key] || ''}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    placeholder={schema.description}
                                    className="min-h-[100px] rounded-lg resize-y"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {onExecute && (
                <div className="mt-6 pt-4 border-t">
                    <Button
                        onClick={handleExecuteClick}
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
                </div>
            )}
        </div>
    );
}
