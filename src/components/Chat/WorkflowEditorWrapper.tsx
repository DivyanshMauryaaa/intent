
import { useEffect, useCallback } from 'react';
import {
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node
} from '@xyflow/react';
import { WorkflowCanvas } from '@/components/Workflow/WorkflowCanvas';

interface WorkflowEditorWrapperProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onChange: (data: { nodes: Node[], edges: Edge[] }) => void;
}

export function WorkflowEditorWrapper({ initialNodes = [], initialEdges = [], onChange }: WorkflowEditorWrapperProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync back to parent whenever nodes or edges change
    useEffect(() => {
        onChange({ nodes, edges });
    }, [nodes, edges, onChange]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setEdges={setEdges}
        />
    );
}
