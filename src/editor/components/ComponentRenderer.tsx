import React from 'react';
import { Component } from '../types';

interface ComponentRendererProps {
  component: Component;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  const { type, props, style } = component;

  const renderComponent = () => {
    switch (type) {
      case 'View':
        return <div style={style}>{props.children}</div>;
      case 'Text':
        return <div style={style}>{props.text || 'Text'}</div>;
      case 'Image':
        return <img src={props.source} alt={props.alt} style={style} />;
      case 'Button':
        return (
          <button style={style} onClick={props.onPress}>
            {props.text || 'Button'}
          </button>
        );
      case 'Input':
        return (
          <input
            type="text"
            placeholder={props.placeholder || 'Input text...'}
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value)}
            style={style}
          />
        );
      case 'ScrollView':
        return <div style={{ ...style, overflow: 'auto' }}>{props.children}</div>;
      case 'TouchableOpacity':
        return (
          <div style={{ ...style, cursor: 'pointer' }} onClick={props.onPress}>
            {props.children}
          </div>
        );
      case 'SafeAreaView':
        return <div style={style}>{props.children}</div>;
      case 'StatusBar':
        return <div style={style}>Status Bar</div>;
      case 'TextInput':
        return (
          <input
            type="text"
            placeholder={props.placeholder || 'Enter text...'}
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value)}
            style={style}
          />
        );
      case 'Switch':
        return <input type="checkbox" style={style} />;
      case 'ActivityIndicator':
        return <div style={style}>Loading...</div>;
      case 'FlatList':
        return <div style={style}>List</div>;
      case 'SectionList':
        return <div style={style}>Section List</div>;
      case 'Modal':
        return <div style={style}>Modal</div>;
      default:
        return <div style={style}>{type}</div>;
    }
  };

  return renderComponent();
};

export default ComponentRenderer; 