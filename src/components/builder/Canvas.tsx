import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import { RootState } from '@/redux/store';
import { selectComponent, updateComponentPosition, updateComponentProps, addComponent } from '@/redux/builderSlice';
import { v4 as uuidv4 } from 'uuid';

const GRID_SIZE = 20; // Size of the grid cells in pixels
const SNAP_TO_GRID = true;

const CanvasArea: React.FC = () => {
  const dispatch = useDispatch();
  const { components, selectedComponentId } = useSelector((state: RootState) => state.builder);
  const [editingText, setEditingText] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { type: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        // Calculate position relative to canvas
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;

        // Snap to grid if enabled
        const snappedX = SNAP_TO_GRID ? snapToGrid(x) : x;
        const snappedY = SNAP_TO_GRID ? snapToGrid(y) : y;

        // Get default dimensions based on component type
        const getDefaultDimensions = (type: string) => {
          switch (type) {
            case 'Text':
              return { width: 200, height: 40 };
            case 'Button':
              return { width: 120, height: 40 };
            case 'Image':
              return { width: 200, height: 200 };
            case 'Input':
              return { width: 200, height: 40 };
            case 'Switch':
              return { width: 50, height: 30 };
            case 'Card':
              return { width: 300, height: 200 };
            case 'Profile':
              return { width: 200, height: 250 };
            case 'Container':
              return { width: 300, height: 200 };
            default:
              return { width: 200, height: 100 };
          }
        };

        const dimensions = getDefaultDimensions(item.type);

        const newComponent = {
          id: uuidv4(),
          type: item.type,
          props: {
            text: item.type === 'Text' ? 'New Text' : '',
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: 16,
            padding: 0,
            margin: 0,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#000000',
            shadowColor: '#000000',
            shadowOffset: '0 0',
            shadowOpacity: 0,
            shadowRadius: 0,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 0,
          },
          position: {
            x: snappedX,
            y: snappedY,
          },
        };

        dispatch(addComponent(newComponent));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleResizeStop = (id: string, e: any, direction: any, ref: any, delta: any, position: any) => {
    const snappedX = SNAP_TO_GRID ? snapToGrid(position.x) : position.x;
    const snappedY = SNAP_TO_GRID ? snapToGrid(position.y) : position.y;
    const snappedWidth = SNAP_TO_GRID ? snapToGrid(parseInt(ref.style.width)) : parseInt(ref.style.width);
    const snappedHeight = SNAP_TO_GRID ? snapToGrid(parseInt(ref.style.height)) : parseInt(ref.style.height);

    dispatch(updateComponentProps({
      id,
      props: {
        width: snappedWidth,
        height: snappedHeight,
      },
    }));
    dispatch(updateComponentPosition({
      id,
      x: snappedX,
      y: snappedY,
    }));
  };

  const handleDragStop = (id: string, e: any, data: any) => {
    const snappedX = SNAP_TO_GRID ? snapToGrid(data.x) : data.x;
    const snappedY = SNAP_TO_GRID ? snapToGrid(data.y) : data.y;

    dispatch(updateComponentPosition({
      id,
      x: snappedX,
      y: snappedY,
    }));
  };

  const handleTextChange = (id: string, newText: string) => {
    dispatch(updateComponentProps({
      id,
      props: { text: newText },
    }));
  };

  const handleDoubleClick = (id: string) => {
    setEditingText(id);
  };

  const handleBlur = () => {
    setEditingText(null);
  };

  const renderComponent = (component: any) => {
    const isEditing = editingText === component.id;

    switch (component.type) {
      case 'Text':
        return isEditing ? (
          <input
            type="text"
            value={component.props.text || ''}
            onChange={(e) => handleTextChange(component.id, e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full p-1 border border-blue-500 rounded"
          />
        ) : (
          <div onDoubleClick={() => handleDoubleClick(component.id)}>
            {component.props.text}
          </div>
        );
      case 'Image':
        return <img src={component.props.source || 'https://via.placeholder.com/200x100'} alt="Component" />;
      case 'Button':
        return isEditing ? (
          <input
            type="text"
            value={component.props.text || ''}
            onChange={(e) => handleTextChange(component.id, e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full p-1 border border-blue-500 rounded"
          />
        ) : (
          <button
            onDoubleClick={() => handleDoubleClick(component.id)}
            className="w-full h-full"
          >
            {component.props.text || 'Button'}
          </button>
        );
      case 'Input':
        return (
          <input
            type="text"
            placeholder={component.props.text || 'Input text...'}
            className="w-full h-full p-2"
          />
        );
      case 'Switch':
        return <input type="checkbox" className="w-full h-full" />;
      case 'Card':
        return (
          <div className="w-full h-full p-4">
            <h3 className="text-lg font-bold">{component.props.title || 'Card Title'}</h3>
            <p className="mt-2">{component.props.description || 'Card Description'}</p>
          </div>
        );
      case 'Profile':
        return (
          <div className="w-full h-full p-4 flex flex-col items-center">
            <img
              src={component.props.avatar || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <h3 className="mt-4 text-lg font-bold">{component.props.name || 'Name'}</h3>
            <p className="text-gray-600">{component.props.role || 'Role'}</p>
          </div>
        );
      case 'Container':
        return (
          <div className="w-full h-full p-4">
            {component.props.children || 'Container'}
          </div>
        );
      default:
        return <div>{component.props.text}</div>;
    }
  };

  return (
    <div 
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className={`w-full h-full bg-white relative ${isOver ? 'bg-gray-50' : ''}`}
      style={{ paddingBottom: '200px' }}
    >
      {components.map((component) => (
        <Rnd
          key={component.id}
          default={{
            x: component.position.x,
            y: component.position.y,
            width: component.props.width,
            height: component.props.height,
          }}
          onResizeStop={(e, direction, ref, delta, position) =>
            handleResizeStop(component.id, e, direction, ref, delta, position)
          }
          onDragStop={(e, data) => handleDragStop(component.id, e, data)}
          onClick={() => dispatch(selectComponent(component.id))}
          className={`absolute ${
            selectedComponentId === component.id ? 'ring-2 ring-blue-500' : ''
          }`}
          bounds="parent"
          grid={[GRID_SIZE, GRID_SIZE]}
        >
          <div
            style={{
              ...component.props,
              width: '100%',
              height: '100%',
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {renderComponent(component)}
          </div>
        </Rnd>
      ))}
    </div>
  );
};

const Canvas: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CanvasArea />
    </DndProvider>
  );
};

export default Canvas; 