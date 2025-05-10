import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleFavorite } from '../store/editorSlice';
import { ComponentType } from '../types';

const componentGroups = {
  Layout: ['View', 'ScrollView', 'SafeAreaView'],
  Basic: ['Text', 'Image', 'Button', 'Input'],
  Interactive: ['TouchableOpacity', 'Switch', 'TextInput'],
  Feedback: ['ActivityIndicator', 'Modal'],
  List: ['FlatList', 'SectionList'],
  Other: ['StatusBar'],
};

const ComponentPalette: React.FC = () => {
  const dispatch = useDispatch();
  const { searchQuery, favorites } = useSelector(
    (state: RootState) => state.editor
  );

  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderComponentItem = (type: ComponentType) => {
    const isFavorite = favorites.includes(type);

    return (
      <div
        key={type}
        draggable
        onDragStart={(e) => handleDragStart(e, type)}
        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-move rounded"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
            {type.charAt(0)}
          </div>
          <span className="text-sm font-medium">{type}</span>
        </div>
        <button
          onClick={() => dispatch(toggleFavorite(type))}
          className="text-gray-400 hover:text-yellow-500"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    );
  };

  const filteredGroups = Object.entries(componentGroups).reduce(
    (acc, [group, components]) => {
      const filtered = components.filter((type) =>
        type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[group] = filtered;
      }
      return acc;
    },
    {} as Record<string, ComponentType[]>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-3 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredGroups).map(([group, components]) => (
          <div key={group} className="mb-4">
            <h3 className="px-4 py-2 text-sm font-medium text-gray-500">{group}</h3>
            <div className="space-y-1">
              {components.map((type) => renderComponentItem(type))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette; 