import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { CanvasState, Component, ComponentType, Position, Size } from '../types';

const initialState: CanvasState = {
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
        present: {} as CanvasState,
        future: [],
      },
    },
    future: [],
  },
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addComponent: (
      state,
      action: PayloadAction<{
        type: ComponentType;
        parentId: string | null;
        position: Position;
        size: Size;
      }>
    ) => {
      const { type, parentId, position, size } = action.payload;
      const id = uuidv4();
      const newComponent: Component = {
        id,
        type,
        name: `${type}${Object.keys(state.components).length + 1}`,
        parentId,
        children: [],
        position,
        size,
        style: {},
        props: {},
      };

      state.components[id] = newComponent;
      if (parentId) {
        state.components[parentId].children.push(id);
      }
    },

    removeComponent: (state, action: PayloadAction<string>) => {
      const removeComponentRecursive = (componentId: string) => {
        const component = state.components[componentId];
        if (!component) return;

        // Remove all children recursively
        component.children.forEach((childId) => {
          removeComponentRecursive(childId);
        });

        // Remove from parent's children array
        if (component.parentId) {
          const parent = state.components[component.parentId];
          parent.children = parent.children.filter((id) => id !== componentId);
        }

        // Remove the component itself
        delete state.components[componentId];
      };

      removeComponentRecursive(action.payload);
      if (state.selectedComponentId === action.payload) {
        state.selectedComponentId = null;
      }
    },

    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },

    hoverComponent: (state, action: PayloadAction<string | null>) => {
      state.hoveredComponentId = action.payload;
    },

    dragComponent: (state, action: PayloadAction<string | null>) => {
      state.draggedComponentId = action.payload;
    },

    setDropTarget: (state, action: PayloadAction<string | null>) => {
      state.dropTargetId = action.payload;
    },

    moveComponent: (
      state,
      action: PayloadAction<{
        componentId: string;
        newParentId: string | null;
        newPosition: Position;
      }>
    ) => {
      const { componentId, newParentId, newPosition } = action.payload;
      const component = state.components[componentId];

      if (!component) return;

      // Remove from old parent's children array
      if (component.parentId) {
        const oldParent = state.components[component.parentId];
        oldParent.children = oldParent.children.filter((id) => id !== componentId);
      }

      // Add to new parent's children array
      if (newParentId) {
        const newParent = state.components[newParentId];
        newParent.children.push(componentId);
      }

      // Update component's parent and position
      component.parentId = newParentId;
      component.position = newPosition;
    },

    updateComponentStyle: (
      state,
      action: PayloadAction<{
        componentId: string;
        style: Partial<Component['style']>;
      }>
    ) => {
      const { componentId, style } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.style = { ...component.style, ...style };
      }
    },

    updateComponentProps: (
      state,
      action: PayloadAction<{
        componentId: string;
        props: Partial<Component['props']>;
      }>
    ) => {
      const { componentId, props } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.props = { ...component.props, ...props };
      }
    },

    updateComponentSize: (
      state,
      action: PayloadAction<{
        componentId: string;
        size: Partial<Size>;
      }>
    ) => {
      const { componentId, size } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.size = { ...component.size, ...size };
      }
    },

    reorderComponents: (
      state,
      action: PayloadAction<{
        parentId: string;
        componentId: string;
        newIndex: number;
      }>
    ) => {
      const { parentId, componentId, newIndex } = action.payload;
      const parent = state.components[parentId];
      if (!parent) return;

      const oldIndex = parent.children.indexOf(componentId);
      if (oldIndex === -1) return;

      parent.children.splice(oldIndex, 1);
      parent.children.splice(newIndex, 0, componentId);
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
  addComponent,
  removeComponent,
  selectComponent,
  hoverComponent,
  dragComponent,
  setDropTarget,
  moveComponent,
  updateComponentStyle,
  updateComponentProps,
  updateComponentSize,
  reorderComponents,
  undo,
  redo,
} = canvasSlice.actions;

export default canvasSlice.reducer; 