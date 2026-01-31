
import { useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    Connection,
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    addEdge,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ActionNode from './ActionNode';

const nodeTypes = {
    actionNode: ActionNode,
};

interface WorkflowCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect?: (connection: Connection) => void;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onPaneClick?: (event: React.MouseEvent) => void;
    setEdges?: (updater: (edges: Edge[]) => Edge[]) => void;
}

export function WorkflowCanvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    setEdges,
}: WorkflowCanvasProps) {

    // Default onConnect if not provided (requires setEdges to be passed or handled parent side)
    const defaultOnConnect = useCallback(
        (params: Connection) => {
            if (setEdges) {
                setEdges((eds) => addEdge(params, eds));
            }
        },
        [setEdges]
    );

    return (
        <div className="h-full w-full min-h-[400px] border border-border rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect || defaultOnConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-neutral-50 dark:bg-neutral-900"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
}
