import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateComponentProps, updateComponentPosition } from '@/redux/builderSlice';

const CodePreview: React.FC = () => {
  const dispatch = useDispatch();
  const { components } = useSelector((state: RootState) => state.builder);
  const [code, setCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'styles' | 'props'>('code');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const removePx = (value: string) => {
    return value.replace('px', '');
  };

  const generateCode = () => {
    const imports = `import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';\n\n`;

    const styles = 'const styles = StyleSheet.create({\n' +
      '  container: {\n' +
      '    flex: 1,\n' +
      '    backgroundColor: "#fff",\n' +
      '  },\n' +
      components.map((component, index) => {
        const styleProps = Object.entries(component.props)
          .filter(([key]) => !['text', 'source', 'name', 'role', 'description'].includes(key))
          .map(([key, value]) => {
            const processedValue = typeof value === 'string' ? removePx(value) : value;
            return `    ${key}: ${typeof processedValue === 'string' ? `'${processedValue}'` : processedValue}`;
          })
          .join(',\n');
        return `  component${index}: {\n${styleProps}\n  }`;
      }).join(',\n') +
      '\n});\n\n';

    const componentCode = 'export default function App() {\n  return (\n    <View style={styles.container}>\n' +
      components.map((component, index) => {
        const props = Object.entries(component.props)
          .filter(([key]) => !['width', 'height'].includes(key))
          .map(([key, value]) => {
            const processedValue = typeof value === 'string' ? removePx(value) : value;
            return `${key}={${typeof processedValue === 'string' ? `'${processedValue}'` : processedValue}}`;
          })
          .join(' ');
        
        switch (component.type) {
          case 'Text':
            return `      <Text style={styles.component${index}} ${props} />`;
          case 'Image':
            return `      <Image style={styles.component${index}} ${props} />`;
          case 'Button':
            return `      <TouchableOpacity style={styles.component${index}} ${props}>\n        <Text>${component.props.text || 'Button'}</Text>\n      </TouchableOpacity>`;
          case 'Input':
            return `      <TextInput style={styles.component${index}} ${props} />`;
          case 'Switch':
            return `      <Switch style={styles.component${index}} ${props} />`;
          case 'Card':
            return `      <View style={styles.component${index}} ${props}>\n        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${component.props.title || 'Card Title'}</Text>\n        <Text style={{ marginTop: 8 }}>${component.props.description || 'Card Description'}</Text>\n      </View>`;
          case 'Profile':
            return `      <View style={styles.component${index}} ${props}>\n        <Image source={{ uri: '${component.props.avatar || 'https://via.placeholder.com/100'}' }} style={{ width: 100, height: 100, borderRadius: 50 }} />\n        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>${component.props.name || 'Name'}</Text>\n        <Text style={{ color: '#666' }}>${component.props.role || 'Role'}</Text>\n      </View>`;
          case 'Container':
            return `      <View style={styles.component${index}} ${props}>\n        ${component.props.children || ''}\n      </View>`;
          default:
            return `      <View style={styles.component${index}} ${props} />`;
        }
      }).join('\n') +
      '\n    </View>\n  );\n}';

    return imports + styles + componentCode;
  };

  useEffect(() => {
    if (!isEditing) {
      setCode(generateCode());
    }
  }, [components, isEditing]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleCodeBlur = () => {
    try {
      const styleMatch = code.match(/StyleSheet\.create\({([^}]+)}\)/);
      if (styleMatch) {
        const styles = styleMatch[1];
        const componentStyles = styles.split('component').slice(1);
        
        componentStyles.forEach((style, index) => {
          const props: Record<string, any> = {};
          const styleProps = style.match(/\s+(\w+):\s*['"]?([^,}]+)['"]?/g);
          
          if (styleProps) {
            styleProps.forEach(prop => {
              const [key, value] = prop.trim().split(':').map(s => s.trim());
              const processedValue = value.replace(/['"]/g, '');
              props[key] = isNaN(Number(processedValue)) ? processedValue : Number(processedValue);
            });
            
            dispatch(updateComponentProps({
              id: components[index].id,
              props: {
                ...components[index].props,
                ...props
              }
            }));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing code:', error);
    }
    setIsEditing(false);
  };

  const renderComponentTree = () => {
    return (
      <div className="space-y-2">
        {components.map((component, index) => (
          <div
            key={component.id}
            className={`p-2 rounded cursor-pointer ${
              selectedComponent === component.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">{index}</span>
              <span className="font-mono">{component.type}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStyles = () => {
    const component = components.find(c => c.id === selectedComponent);
    if (!component) return null;

    return (
      <div className="space-y-4">
        {Object.entries(component.props)
          .filter(([key]) => !['text', 'source', 'name', 'role', 'description'].includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{key}:</span>
              <input
                type="text"
                value={value as string}
                onChange={(e) => {
                  const newValue = e.target.value;
                  dispatch(updateComponentProps({
                    id: component.id,
                    props: { [key]: isNaN(Number(newValue)) ? newValue : Number(newValue) }
                  }));
                }}
                className="flex-1 bg-gray-800 text-white px-2 py-1 rounded"
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="w-1/2 h-full bg-gray-900 text-white flex flex-col">
      <div className="flex border-b border-gray-800">
        <button
          className={`px-4 py-2 ${activeTab === 'code' ? 'bg-gray-800' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'styles' ? 'bg-gray-800' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Styles
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'props' ? 'bg-gray-800' : ''}`}
          onClick={() => setActiveTab('props')}
        >
          Components
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Code Preview</h3>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy Code
              </button>
            </div>
            <textarea
              value={code}
              onChange={handleCodeChange}
              onFocus={() => setIsEditing(true)}
              onBlur={handleCodeBlur}
              className="flex-1 font-mono text-sm bg-gray-800 text-white p-4"
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="h-full p-4 overflow-y-auto">
            {renderStyles()}
          </div>
        )}

        {activeTab === 'props' && (
          <div className="h-full p-4 overflow-y-auto">
            {renderComponentTree()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview; 