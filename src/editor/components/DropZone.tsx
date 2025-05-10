import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setDropTarget } from '../store/canvasSlice';
import { DropZone as DropZoneType } from '../types';

interface DropZoneProps {
  id: string;
  parentId: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onDrop?: (item: any, monitor: any) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  id,
  parentId,
  position,
  size,
  onDrop,
}) => {
  const dispatch = useDispatch();
  const dropRef = useRef<HTMLDivElement>(null);
  const { dropTargetId } = useSelector((state: RootState) => state.canvas);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any, monitor) => {
      if (onDrop) {
        onDrop(item, monitor);
      }
    },
    hover: (item: any, monitor) => {
      if (!dropRef.current) return;
      
      const isOverCurrent = monitor.isOver({ shallow: true });
      if (isOverCurrent) {
        dispatch(setDropTarget(id));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [id, onDrop]);

  const isActive = isOver || dropTargetId === id;

  return (
    <div
      ref={(node) => {
        drop(node);
        dropRef.current = node;
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: isActive ? '2px dashed #3b82f6' : '2px dashed transparent',
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        pointerEvents: 'all',
        zIndex: 1000,
      }}
    />
  );
};

export default DropZone; 