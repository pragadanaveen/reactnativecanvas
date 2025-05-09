import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Component {
  id: string;
  type: 'Text' | 'Image' | 'Button' | 'Input' | 'Switch' | 'Card' | 'Profile' | 'Container';
  props: {
    text?: string;
    source?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    shadowColor?: string;
    shadowOffset?: string;
    shadowOpacity?: string;
    shadowRadius?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    name?: string;
    role?: string;
    avatar?: string;
    description?: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
}

const initialState: BuilderState = {
  components: [],
  selectedComponentId: null,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<Component>) => {
      state.components.push(action.payload);
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(c => c.id !== action.payload);
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },
    updateComponentPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const component = state.components.find(c => c.id === action.payload.id);
      if (component) {
        component.position = { x: action.payload.x, y: action.payload.y };
      }
    },
    updateComponentProps: (state, action: PayloadAction<{ id: string; props: Partial<Component['props']> }>) => {
      const component = state.components.find(c => c.id === action.payload.id);
      if (component) {
        component.props = { ...component.props, ...action.payload.props };
      }
    },
  },
});

export const {
  addComponent,
  removeComponent,
  selectComponent,
  updateComponentPosition,
  updateComponentProps,
} = builderSlice.actions;

export default builderSlice.reducer; 