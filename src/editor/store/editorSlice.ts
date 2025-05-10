import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, ComponentType } from '../types';

const initialState: EditorState = {
  canvas: {
    components: {},
    selectedComponentId: null,
    hoveredComponentId: null,
    draggedComponentId: null,
    dropTargetId: null,
    history: {
      past: [],
      present: {
        components: {},
        selectedComponentId: null,
        hoveredComponentId: null,
        draggedComponentId: null,
        dropTargetId: null,
        history: {
          past: [],
          present: {} as any,
          future: [],
        },
      },
      future: [],
    },
  },
  isDragging: false,
  isResizing: false,
  showGrid: true,
  zoom: 1,
  theme: 'light',
  codePreview: '',
  selectedTab: 'components',
  searchQuery: '',
  recentComponents: [],
  favorites: [],
  history: {
    past: [],
    present: {} as EditorState,
    future: [],
  },
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },

    setIsResizing: (state, action: PayloadAction<boolean>) => {
      state.isResizing = action.payload;
    },

    setShowGrid: (state, action: PayloadAction<boolean>) => {
      state.showGrid = action.payload;
    },

    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },

    setCodePreview: (state, action: PayloadAction<string>) => {
      state.codePreview = action.payload;
    },

    setSelectedTab: (state, action: PayloadAction<'components' | 'styles' | 'code'>) => {
      state.selectedTab = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    addRecentComponent: (state, action: PayloadAction<ComponentType>) => {
      const component = action.payload;
      state.recentComponents = [
        component,
        ...state.recentComponents.filter((c) => c !== component),
      ].slice(0, 5);
    },

    toggleFavorite: (state, action: PayloadAction<ComponentType>) => {
      const component = action.payload;
      const index = state.favorites.indexOf(component);
      if (index === -1) {
        state.favorites.push(component);
      } else {
        state.favorites.splice(index, 1);
      }
    },

    undo: (state) => {
      if (state.history.past.length === 0) return;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);

      state.history = {
        past: newPast,
        present: state.history.present,
        future: [state.history.present, ...state.history.future],
      };

      return previous;
    },

    redo: (state) => {
      if (state.history.future.length === 0) return;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      state.history = {
        past: [...state.history.past, state.history.present],
        present: next,
        future: newFuture,
      };

      return next;
    },
  },
});

export const {
  setIsDragging,
  setIsResizing,
  setShowGrid,
  setZoom,
  setTheme,
  setCodePreview,
  setSelectedTab,
  setSearchQuery,
  addRecentComponent,
  toggleFavorite,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer; 