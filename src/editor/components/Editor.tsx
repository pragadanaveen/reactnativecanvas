import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setSelectedTab } from '../store/editorSlice';
import Canvas from './Canvas';
import ComponentPalette from './ComponentPalette';
import PropertyEditor from './PropertyEditor';
import CodePreview from './CodePreview';

const Editor: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTab } = useSelector((state: RootState) => state.editor);

  const renderSidebar = () => {
    switch (selectedTab) {
      case 'components':
        return <ComponentPalette />;
      case 'styles':
        return <PropertyEditor />;
      case 'code':
        return <CodePreview />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">ProtoNative</h1>
        </div>
        <div className="flex border-b">
          <button
            className={`flex-1 p-2 text-sm ${
              selectedTab === 'components'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => dispatch(setSelectedTab('components'))}
          >
            Components
          </button>
          <button
            className={`flex-1 p-2 text-sm ${
              selectedTab === 'styles'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => dispatch(setSelectedTab('styles'))}
          >
            Styles
          </button>
          <button
            className={`flex-1 p-2 text-sm ${
              selectedTab === 'code'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => dispatch(setSelectedTab('code'))}
          >
            Code
          </button>
        </div>
        <div className="flex-1 overflow-hidden">{renderSidebar()}</div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b flex items-center px-4">
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>
      </div>
    </div>
  );
};

export default Editor; 