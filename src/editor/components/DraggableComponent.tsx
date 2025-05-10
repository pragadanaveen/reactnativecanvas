import React from 'react';
import { Rnd } from 'react-rnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { dragComponent, selectComponent, updateComponentSize, updateComponentStyle } from '../store/canvasSlice';
import { Component } from '../types';
import ComponentRenderer from './ComponentRenderer';

interface DraggableComponentProps {
  component: Component;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const dispatch = useDispatch();
  const { draggedComponentId } = useSelector((state: RootState) => state.canvas);

  const handleDragStart = () => {
    dispatch(dragComponent(component.id));
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    dispatch(dragComponent(null));
    dispatch(updateComponentStyle({
      componentId: component.id,
      style: {
        position: 'absolute',
        left: d.x,
        top: d.y,
      }
    }));
  };

  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    dispatch(updateComponentSize({
      componentId: component.id,
      size: {
        width: ref.style.width,
        height: ref.style.height,
      }
    }));
    dispatch(updateComponentStyle({
      componentId: component.id,
      style: {
        position: 'absolute',
        left: position.x,
        top: position.y,
      }
    }));
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const handleMouseEnter = () => {
    onHover(component.id);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  return (
    <Rnd
      default={{
        x: component.position.x,
        y: component.position.y,
        width: component.size.width,
        height: component.size.height,
      }}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      dragGrid={[10, 10]}
      resizeGrid={[10, 10]}
      style={{
        zIndex: isSelected || isHovered ? 100 : 1,
      }}
    >
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          height: '100%',
          border: isSelected
            ? '2px solid #3b82f6'
            : isHovered
            ? '2px solid #93c5fd'
            : '2px solid transparent',
          cursor: 'move',
          backgroundColor: 'white',
          opacity: draggedComponentId === component.id ? 0.5 : 1,
        }}
      >
        <ComponentRenderer component={component} />
      </div>
    </Rnd>
  );
};

export default DraggableComponent; 