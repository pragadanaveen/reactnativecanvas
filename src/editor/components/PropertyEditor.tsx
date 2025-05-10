import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  updateComponentStyle,
  updateComponentProps,
  updateComponentSize,
} from '../store/canvasSlice';
import { Component, ComponentStyle } from '../types';

const PropertyEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedComponentId, components } = useSelector(
    (state: RootState) => state.canvas
  );

  const selectedComponent = selectedComponentId
    ? components[selectedComponentId]
    : null;

  if (!selectedComponent) {
    return (
      <div className="p-4 text-gray-500">
        Select a component to edit its properties
      </div>
    );
  }

  const handleStyleChange = (property: keyof ComponentStyle, value: any) => {
    dispatch(
      updateComponentStyle({
        componentId: selectedComponent.id,
        style: { [property]: value },
      })
    );
  };

  const handlePropChange = (property: string, value: any) => {
    dispatch(
      updateComponentProps({
        componentId: selectedComponent.id,
        props: { [property]: value },
      })
    );
  };

  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    dispatch(
      updateComponentSize({
        componentId: selectedComponent.id,
        size: { [property]: value },
      })
    );
  };

  const renderStyleEditor = () => {
    const commonStyles: (keyof ComponentStyle)[] = [
      'backgroundColor',
      'color',
      'fontSize',
      'fontWeight',
      'textAlign',
      'padding',
      'margin',
      'borderWidth',
      'borderColor',
      'borderRadius',
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Style</h3>
        {commonStyles.map((property) => (
          <div key={property} className="flex items-center space-x-2">
            <label className="w-24 text-sm">{property}</label>
            <input
              type="text"
              value={selectedComponent.style[property] || ''}
              onChange={(e) => handleStyleChange(property, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderPropsEditor = () => {
    const commonProps = {
      text: 'Text',
      source: 'Source',
      alt: 'Alt Text',
      placeholder: 'Placeholder',
      value: 'Value',
    };

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Properties</h3>
        {Object.entries(commonProps).map(([prop, label]) => (
          <div key={prop} className="flex items-center space-x-2">
            <label className="w-24 text-sm">{label}</label>
            <input
              type="text"
              value={selectedComponent.props[prop] || ''}
              onChange={(e) => handlePropChange(prop, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderSizeEditor = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Size</h3>
        <div className="flex items-center space-x-2">
          <label className="w-24 text-sm">Width</label>
          <input
            type="number"
            value={selectedComponent.size.width}
            onChange={(e) =>
              handleSizeChange('width', parseInt(e.target.value) || 0)
            }
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-24 text-sm">Height</label>
          <input
            type="number"
            value={selectedComponent.size.height}
            onChange={(e) =>
              handleSizeChange('height', parseInt(e.target.value) || 0)
            }
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-medium">{selectedComponent.name}</h2>
        <p className="text-sm text-gray-500">{selectedComponent.type}</p>
      </div>

      {renderSizeEditor()}
      {renderStyleEditor()}
      {renderPropsEditor()}
    </div>
  );
};

export default PropertyEditor; 