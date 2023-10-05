import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import "./index.css";
import Sidebar from "./Components/Sidebar";
import MsData from "./Components/NodeTypes/MsData";
import MsAnalysis from "./Components/NodeTypes/MsAnalysis";
import MsProcessing from "./Components/NodeTypes/MsProcessing";
import { Button } from "@mui/material";
import GroupFeatures from "./Components/NodeTypes/GroupFeatures";

const flowKey = "example-flow";
const initialNodes = [];
const nodeTypes = {
  MsDataNode: MsData,
  MsAnalysisNode: MsAnalysis,
  FindFeaturesNode: MsProcessing,
  GroupFeaturesNode: GroupFeatures,
};

let id = 0;
const getId = (type) => `${type}${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      const sourceNode = nodes.find((node) => node.id === params.source);
      if (sourceNode) {
        const updatedSourceNode = {
          ...sourceNode,
          data: {
            ...sourceNode.data,
            edges: [...sourceNode.data.edges, params],
          },
        };
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === params.source ? updatedSourceNode : node
          )
        );
      }
      const targetNode = nodes.find((node) => node.id === params.target);
      if (targetNode) {
        const updatedTargetNode = {
          ...targetNode,
          data: {
            ...targetNode.data,
            edges: [...targetNode.data.edges, params],
          },
        };
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === params.target ? updatedTargetNode : node
          )
        );
      }
    },
    [edges, nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  console.log(nodes);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(type),
        type: type,
        position,
        data: {
          label: `${type}`,
          edges: [],
          inputFiles: [],
          find_features: [],
          group_features: [],
          setNodes: setNodes,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onReset = useCallback(() => {
    const resetFlow = async () => {
      setNodes([]);
      setEdges([]);
      setViewport({});
    };

    resetFlow();
  }, [setNodes, setViewport]);

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <Background />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          ></ReactFlow>
        </div>
        <Controls position="bottom-right">
          <Button onClick={onSave}>save</Button>
          <Button onClick={onReset}>reset</Button>
        </Controls>
      </ReactFlowProvider>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);
