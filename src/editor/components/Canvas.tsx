import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  selectComponent,
  hoverComponent,
  moveComponent,
  addComponent,
} from '../store/canvasSlice';
import { Component } from '../types';
import DraggableComponent from './DraggableComponent';

const Canvas: React.FC = () => {
  const dispatch = useDispatch();
  const {
    components,
    selectedComponentId,
    hoveredComponentId,
  } = useSelector((state: RootState) => state.canvas);

  const handleSelect = useCallback((id: string) => {
    dispatch(selectComponent(id));
  }, [dispatch]);

  const handleHover = useCallback((id: string | null) => {
    dispatch(hoverComponent(id));
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (type) {
      dispatch(addComponent({
        type,
        parentId: null,
        position: { x, y },
        size: { width: 200, height: 100 }
      }));
    }
  }, [dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const renderComponent = (component: Component) => {
    const isSelected = component.id === selectedComponentId;
    const isHovered = component.id === hoveredComponentId;

    return (
      <React.Fragment key={component.id}>
        <DraggableComponent
          component={component}
          isSelected={isSelected}
          isHovered={isHovered}
          onSelect={handleSelect}
          onHover={handleHover}
        />
        {component.children?.map((childId) => {
          const childComponent = components[childId];
          return childComponent ? renderComponent(childComponent) : null;
        })}
      </React.Fragment>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas Header */}
      <div className="h-12 border-b bg-white flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium">Canvas</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Frame */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="mobile-frame relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div className="h-8 bg-black flex items-center justify-between px-6">
            <div className="text-white text-xs">9:41</div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            className="canvas-area relative w-full h-[calc(100%-32px)] overflow-auto"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onClick={() => handleSelect('')}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {Object.values(components)
              .filter((component) => !component.parentId)
              .map((component) => renderComponent(component))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas; 