import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Play, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the data structure for the node
export type ActionNodeData = {
    slug: string;
    title: string;
    description?: string;
    status?: 'idle' | 'running' | 'success' | 'error';
    onEdit?: () => void;
    [key: string]: any;
};

const ActionNode = ({ data, selected }: NodeProps & { data: ActionNodeData }) => {
    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted-foreground" />

            <Card
                className={cn(
                    "w-[250px] shadow-sm transition-all duration-200 border-2",
                    selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
                    data.status === 'running' && "border-blue-500 animate-pulse",
                    data.status === 'success' && "border-green-500",
                    data.status === 'error' && "border-red-500"
                )}
            >
                <CardHeader className="p-4 py-3 bg-secondary/30">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="truncate">{data.title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-xs text-muted-foreground truncate">
                    {data.description || "No description"}
                </CardContent>
            </Card>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-muted-foreground" />
        </div>
    );
};

export default memo(ActionNode);
