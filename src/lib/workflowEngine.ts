import { Edge, Node } from '@xyflow/react';
import { ActionNodeData } from '@/components/Workflow/ActionNode';

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export interface WorkflowExecutionResult {
    nodeId: string;
    status: ExecutionStatus;
    output?: any;
    error?: string;
}

/**
 * Sorts nodes based on dependencies (edges).
 * Simple topological sort.
 */
function getExecutionOrder(nodes: Node<ActionNodeData>[], edges: Edge[]): string[] {
    const visited = new Set<string>();
    const order: string[] = [];
    const adj = new Map<string, string[]>();

    // Build adjacency list
    nodes.forEach(node => adj.set(node.id, []));
    edges.forEach(edge => {
        if (adj.has(edge.source)) {
            adj.get(edge.source)?.push(edge.target);
        }
    });

    // Valid nodes lookup
    const nodeIds = new Set(nodes.map(n => n.id));

    // Calculate in-degree
    const inDegree = new Map<string, number>();
    nodes.forEach(n => inDegree.set(n.id, 0));
    edges.forEach(edge => {
        if (nodeIds.has(edge.target)) {
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        }
    });

    // Queue for BFS
    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
        if (deg === 0) queue.push(id);
    });

    // Process
    while (queue.length > 0) {
        const u = queue.shift()!;
        order.push(u);

        const neighbors = adj.get(u) || [];
        for (const v of neighbors) {
            if (!nodeIds.has(v)) continue;
            const deg = (inDegree.get(v) || 0) - 1;
            inDegree.set(v, deg);
            if (deg === 0) {
                queue.push(v);
            }
        }
    }

    // If cycle exists or disconnected components not reachable (unlikely with this approach for all components), 
    // we just take what we found. For a robust engine, we'd handle cycles.

    // Add any remaining nodes (disconnected islands)
    nodes.forEach(n => {
        if (!order.includes(n.id)) {
            order.push(n.id);
        }
    });

    return order;
}

/**
 * Executes the workflow locally in the browser (simulation).
 * In a real app, this might send the graph to the server.
 */
export async function executeWorkflow(
    nodes: Node<ActionNodeData>[],
    edges: Edge[],
    updateNodeStatus: (nodeId: string, status: ExecutionStatus) => void
) {
    const executionOrder = getExecutionOrder(nodes, edges);

    console.log("Execution Order:", executionOrder);

    for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        updateNodeStatus(nodeId, 'running');

        try {
            // Simulate execution or call API
            console.log(`Executing ${node.data.slug} (${nodeId})...`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay

            // Here you would call the actual action API, e.g.
            // await fetch('/api/execute-action', { body: JSON.stringify(node.data) })

            updateNodeStatus(nodeId, 'success');
        } catch (error) {
            console.error(error);
            updateNodeStatus(nodeId, 'error');
            // Stop execution on error?
            break;
        }
    }
}
