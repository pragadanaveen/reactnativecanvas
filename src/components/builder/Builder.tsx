import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Inspector from './Inspector';
import CodePreview from './CodePreview';

const Builder: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Canvas />
          </div>
          <Toolbar />
        </div>
        <div className="flex">
          <Inspector />
          <CodePreview />
        </div>
      </div>
    </DndProvider>
  );
};

export default Builder; 