import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Component } from '../types';

const CodePreview: React.FC = () => {
  const { components } = useSelector((state: RootState) => state.canvas);

  const generateComponentCode = useCallback((component: Component): string => {
    const styleString = Object.entries(component.style)
      .map(([key, value]) => `${key}: ${value}`)
      .join(',\n    ');

    const propsString = Object.entries(component.props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        return `${key}={${value}}`;
      })
      .join('\n    ');

    const childrenString = component.children
      .map((childId) => {
        const child = components[childId];
        return child ? generateComponentCode(child) : '';
      })
      .filter(Boolean)
      .join('\n    ');

    return `
  <${component.type}
    style={{
      ${styleString}
    }}
    ${propsString}
  >
    ${childrenString}
  </${component.type}>`;
  }, [components]);

  const generateCode = useCallback(() => {
    const rootComponents = Object.values(components).filter(
      (component) => !component.parentId
    );

    const imports = new Set<string>();
    rootComponents.forEach((component) => {
      imports.add(component.type);
    });

    const importString = Array.from(imports)
      .map((type) => `import { ${type} } from 'react-native';`)
      .join('\n');

    const componentsString = rootComponents
      .map((component) => generateComponentCode(component))
      .join('\n');

    return `import React from 'react';\n${importString}\n\nexport default function App() {\n  return (\n    ${componentsString}\n  );\n}`;
  }, [components, generateComponentCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
  };

  const handleDownload = () => {
    const blob = new Blob([generateCode()], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Code Preview</h2>
        <div className="space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="flex-1 p-4 overflow-auto bg-gray-50 text-sm">
        <code>{generateCode()}</code>
      </pre>
    </div>
  );
};

export default CodePreview; 