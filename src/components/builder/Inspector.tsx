import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateComponentProps } from '@/redux/builderSlice';

const Inspector: React.FC = () => {
  const dispatch = useDispatch();
  const { components, selectedComponentId } = useSelector((state: RootState) => state.builder);
  const selectedComponent = components.find(c => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="w-64 h-full bg-white p-4 border-l">
        <p className="text-gray-500">Select a component to edit its properties</p>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateComponentProps({
      id: selectedComponent.id,
      props: { text: e.target.value },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateComponentProps({
          id: selectedComponent.id,
          props: { source: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleChange = (property: string, value: string) => {
    dispatch(updateComponentProps({
      id: selectedComponent.id,
      props: { [property]: value },
    }));
  };

  const renderTextEditor = () => {
    // Show text editor for Text, Button, and Input components
    if (['Text', 'Button', 'Input'].includes(selectedComponent.type)) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {selectedComponent.type === 'Input' ? 'Placeholder Text' : 'Text Content'}
          </label>
          <input
            type="text"
            value={selectedComponent.props.text || ''}
            onChange={handleTextChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={selectedComponent.type === 'Input' ? 'Enter placeholder text...' : 'Enter text...'}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-64 h-full bg-white p-4 border-l overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Component Properties</h3>
      
      {renderTextEditor()}

      {selectedComponent.type === 'Image' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image Source</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full"
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Background Color</label>
          <input
            type="color"
            value={selectedComponent.props.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Text Color</label>
          <input
            type="color"
            value={selectedComponent.props.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Font Size</label>
          <input
            type="text"
            value={selectedComponent.props.fontSize || '16px'}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Border Radius</label>
          <input
            type="text"
            value={selectedComponent.props.borderRadius || '0px'}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Padding</label>
          <input
            type="text"
            value={selectedComponent.props.padding || '0px'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Margin</label>
          <input
            type="text"
            value={selectedComponent.props.margin || '0px'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Inspector; 