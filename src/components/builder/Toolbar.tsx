import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { addComponent } from '@/redux/builderSlice';

interface DraggableComponentProps {
  type: string;
  icon: string;
  label: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon, label }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    const newComponent = {
      id: uuidv4(),
      type,
      props: {
        text: type === 'Text' ? 'New Text' : '',
        width: 200,
        height: 100,
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
        x: 100,
        y: 100,
      },
    };

    dispatch(addComponent(newComponent));
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`flex flex-col items-center p-2 rounded-lg cursor-move ${
        isDragging ? 'opacity-50' : 'hover:bg-gray-700'
      }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
};

const Toolbar: React.FC = () => {
  const components = [
    { type: 'Text', icon: '📝', label: 'Text' },
    { type: 'Button', icon: '🔘', label: 'Button' },
    { type: 'Image', icon: '🖼️', label: 'Image' },
    { type: 'Input', icon: '📥', label: 'Input' },
    { type: 'Switch', icon: '🔄', label: 'Switch' },
    { type: 'Card', icon: '🎴', label: 'Card' },
    { type: 'Profile', icon: '👤', label: 'Profile' },
    { type: 'Container', icon: '📦', label: 'Container' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-8 gap-4 h-full items-center">
          {components.map((component) => (
            <DraggableComponent
              key={component.type}
              type={component.type}
              icon={component.icon}
              label={component.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 