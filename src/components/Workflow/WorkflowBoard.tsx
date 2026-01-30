import { useState, useCallback, useRef } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    NodeChange,
    EdgeChange,
    Node,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ActionNode, { ActionNodeData } from './ActionNode';
import { ActionDetailsPanel } from '@/components/Chat/ActionDetailsPanel';
import { ActionSheet } from '@/components/Chat/ActionSheet'; // For the optional overlay
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const nodeTypes = {
    actionNode: ActionNode,
};

const initialNodes: Node<ActionNodeData>[] = [
    {
        id: '1',
        type: 'actionNode',
        position: { x: 100, y: 100 },
        data: { slug: 'gmail_send', title: 'Send Email', description: 'Draft an email to client' }
    },
    {
        id: '2',
        type: 'actionNode',
        position: { x: 400, y: 200 },
        data: { slug: 'slack_send_message', title: 'Notify Slack', description: 'Send notification to #general' }
    }
];

const initialEdges: Edge[] = [];

export function WorkflowBoard() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Layout state
    const isSidebarOpen = !!selectedNodeId;

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    // Update node data when form changes in sidebar
    const handleNodeDataChange = (newData: Record<string, any>) => {
        if (!selectedNodeId) return;

        setNodes((nds) => nds.map(node => {
            if (node.id === selectedNodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...newData
                    }
                };
            }
            return node;
        }));
    };

    // Execution Handler
    const handleRunWorkflow = async () => {
        // Reset statuses
        setNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle' } })));

        const { executeWorkflow } = await import('@/lib/workflowEngine');

        await executeWorkflow(nodes, edges, (nodeId, status) => {
            setNodes((nds) => nds.map(n => {
                if (n.id === nodeId) {
                    return { ...n, data: { ...n.data, status } };
                }
                return n;
            }));
        });
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            {/* Workflow Canvas */}
            <div
                className={`transition-all duration-300 ease-in-out h-full ${isSidebarOpen ? 'w-2/3 border-r' : 'w-full'
                    }`}
            >
                <div className="h-full w-full relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-neutral-50 dark:bg-neutral-900"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        <Controls />
                    </ReactFlow>

                    <div className="absolute top-4 right-4 z-10">
                        <Button className='shadow-md' onClick={handleRunWorkflow}>
                            <Play className="w-4 h-4 mr-2" />
                            Run Workflow
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sidebar Panel (1/3 Width) */}
            <div
                className={`transition-all duration-300 ease-in-out h-full bg-card overflow-hidden flex flex-col ${isSidebarOpen ? 'w-1/3 opacity-100' : 'w-0 opacity-0'
                    }`}
            >
                {selectedNode && (
                    <div className="p-6 h-full">
                        <ActionDetailsPanel
                            identifier={selectedNode.data.slug}
                            initialData={selectedNode.data}
                            onChange={handleNodeDataChange}
                            onExpand={() => setIsOverlayOpen(true)}
                            mode="sidebar"
                        />
                    </div>
                )}
            </div>

            {/* Overlay Sheet (Triggered from Sidebar) */}
            {selectedNode && (
                <ActionSheet
                    open={isOverlayOpen}
                    onOpenChange={setIsOverlayOpen}
                    identifier={selectedNode.data.slug}
                    initialData={selectedNode.data}
                    title={`Edit: ${selectedNode.data.title}`}
                />
            )}
        </div>
    );
}
