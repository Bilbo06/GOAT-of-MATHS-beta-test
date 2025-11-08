import React, { useState, useRef, useEffect } from 'react';
import { MindMap, MindMapNode } from '../../types';

interface MindMapEditorProps {
    mindMap: MindMap;
    onSave: (mindMap: MindMap) => void;
    onBack: () => void;
}

type EditorMode = 'move' | 'connect';

const NODE_COLORS = ['#FFFFFF', '#FECACA', '#BFDBFE', '#A7F3D0', '#FDE68A', '#DDD6FE', '#E5E7EB'];
const BACKGROUNDS = [
    { name: 'Points', value: 'radial-gradient(#d1d5db 1px, transparent 1px)', style: { backgroundSize: '20px 20px', backgroundColor: '#f1f5f9' } },
    { name: 'Clair', value: '#f1f5f9', style: { background: '#f1f5f9' } },
    { name: 'Sombre', value: '#1e293b', style: { background: '#1e293b' } },
    { name: 'Gradient', value: 'linear-gradient(to top, #e0f2fe, #f0f9ff)', style: { background: 'linear-gradient(to top, #e0f2fe, #f0f9ff)' } },
];

const isColorDark = (hexColor: string | undefined): boolean => {
    if (!hexColor || hexColor === '#FFFFFF') return false;
    try {
        const color = hexColor.substring(1); // remove #
        const rgb = parseInt(color, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 128;
    } catch (e) {
        return false;
    }
};


export const MindMapEditor: React.FC<MindMapEditorProps> = ({ mindMap, onSave, onBack }) => {
    const [title, setTitle] = useState(mindMap.title);
    const [nodes, setNodes] = useState(mindMap.nodes);
    const [connections, setConnections] = useState(mindMap.connections);
    const [background, setBackground] = useState(mindMap.background || BACKGROUNDS[0].value);
    
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    
    const [mode, setMode] = useState<EditorMode>('move');
    const [connectingFromNodeId, setConnectingFromNodeId] = useState<string | null>(null);
    
    const [isBgPickerOpen, setBgPickerOpen] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingNodeId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingNodeId]);

    const getSVGPoint = (e: React.MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
        return { x: svgP.x, y: svgP.y };
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setSelectedNodeId(nodeId);
        if (mode === 'move') {
            setDraggingNodeId(nodeId);
        } else if (mode === 'connect') {
            if (!connectingFromNodeId) {
                setConnectingFromNodeId(nodeId);
            } else {
                if(connectingFromNodeId !== nodeId && !connections.some(c => (c.from === connectingFromNodeId && c.to === nodeId) || (c.from === nodeId && c.to === connectingFromNodeId))) {
                   setConnections(prev => [...prev, { from: connectingFromNodeId, to: nodeId }]);
                }
                setConnectingFromNodeId(null);
                setMode('move');
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNodeId) {
            const { x, y } = getSVGPoint(e);
            setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: x - 75, y: y - 25 } : n));
        }
    };

    const handleMouseUp = () => {
        setDraggingNodeId(null);
    };
    
    const handleNodeDoubleClick = (nodeId: string) => {
        setEditingNodeId(nodeId);
    };

    const handleNodeTextChange = (e: React.ChangeEvent<HTMLInputElement>, nodeId: string) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, text: e.target.value } : n));
    };
    
    const handleNodeColorChange = (color: string) => {
        if(selectedNodeId) {
            setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, color } : n));
        }
    };

    const handleNodeTextBlur = () => {
        setEditingNodeId(null);
    };

    const addNode = () => {
        const newNode: MindMapNode = {
            id: `node_${Date.now()}`,
            x: 50,
            y: 50,
            text: 'Nouveau concept',
            color: '#FFFFFF'
        };
        setNodes(prev => [...prev, newNode]);
    };

    const deleteSelectedNode = () => {
        if (selectedNodeId) {
            setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
            setConnections(prev => prev.filter(c => c.from !== selectedNodeId && c.to !== selectedNodeId));
            setSelectedNodeId(null);
        }
    };

    const handleSave = () => {
        onSave({ ...mindMap, title, nodes, connections, background });
    };

    return (
        <div className="flex flex-col h-full bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
                <button onClick={onBack} className="px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-2xl font-bold">
                    ←
                </button>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-grow mx-4 text-center text-lg font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                />
                <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold text-sm">
                    💾 Sauvegarder
                </button>
            </div>
            
            {/* SVG Canvas */}
            <div className="flex-grow relative" style={BACKGROUNDS.find(b => b.value === background)?.style || { background }}>
                <svg ref={svgRef} className="w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                    <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
                        </filter>
                    </defs>

                    {/* Connections */}
                    {connections.map((conn, index) => {
                        const fromNode = nodes.find(n => n.id === conn.from);
                        const toNode = nodes.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;
                        const [x1, y1] = [fromNode.x + 75, fromNode.y + 25];
                        const [x2, y2] = [toNode.x + 75, toNode.y + 25];
                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2;
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const ctrlX = midX - dy * 0.2;
                        const ctrlY = midY + dx * 0.2;

                        return (
                            <path
                                key={index}
                                d={`M${x1},${y1} Q${ctrlX},${ctrlY} ${x2},${y2}`}
                                stroke="#94a3b8" strokeWidth="2.5" fill="none"
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => (
                        <g 
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                            onDoubleClick={() => handleNodeDoubleClick(node.id)}
                            className="cursor-pointer"
                            style={{ filter: 'url(#shadow)' }}
                        >
                            <rect
                                x="0" y="0" width="150" height="50" rx="10"
                                fill={node.color || '#FFFFFF'}
                                stroke={connectingFromNodeId === node.id ? '#1d4ed8' : (selectedNodeId === node.id ? '#2563eb' : '#cbd5e1')}
                                strokeWidth="2.5"
                            />
                             {editingNodeId === node.id ? (
                                <foreignObject x="5" y="5" width="140" height="40">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={node.text}
                                        onChange={(e) => handleNodeTextChange(e, node.id)}
                                        onBlur={handleNodeTextBlur}
                                        onKeyDown={(e) => e.key === 'Enter' && handleNodeTextBlur()}
                                        className="w-full h-full bg-transparent text-center text-black font-semibold p-1 focus:outline-none"
                                    />
                                </foreignObject>
                            ) : (
                                <text x="75" y="30" textAnchor="middle" fill={isColorDark(node.color) ? 'white' : 'black'} fontSize="14" fontWeight="bold" style={{pointerEvents: 'none'}}>
                                    {node.text}
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </div>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-t border-border-light dark:border-border-dark flex-shrink-0 flex-wrap">
                <div className="flex items-center gap-2">
                    <button onClick={addNode} title="Ajouter un nœud" className="p-2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold text-lg">➕</button>
                    <button 
                        onClick={() => { setMode(m => m === 'connect' ? 'move' : 'connect'); setConnectingFromNodeId(null); }}
                        title="Connecter les nœuds"
                        className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-lg ${mode === 'connect' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        🔗
                    </button>
                    <button onClick={deleteSelectedNode} disabled={!selectedNodeId} title="Supprimer le nœud" className="p-2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold text-lg disabled:opacity-50">
                        🗑️
                    </button>
                     <div className="relative">
                        <button onClick={() => setBgPickerOpen(p => !p)} title="Changer l'arrière-plan" className="p-2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold text-lg">
                           🖼️
                        </button>
                        {isBgPickerOpen && (
                            <div className="absolute bottom-12 left-0 bg-card-light dark:bg-card-dark p-2 rounded-lg shadow-lg border border-border-light dark:border-border-dark flex gap-2">
                                {BACKGROUNDS.map(bg => (
                                    <button key={bg.name} onClick={() => { setBackground(bg.value); setBgPickerOpen(false); }} className="w-10 h-10 rounded-md border-2 border-slate-300" style={bg.style} title={bg.name}></button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {selectedNodeId && (
                     <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <span className="text-sm font-semibold ml-2">Couleur:</span>
                        {NODE_COLORS.map(color => (
                            <button 
                                key={color}
                                onClick={() => handleNodeColorChange(color)}
                                className="w-7 h-7 rounded-full border-2 border-white/50"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};