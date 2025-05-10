export type ComponentType = 
  | 'View'
  | 'Text'
  | 'Image'
  | 'Button'
  | 'Input'
  | 'ScrollView'
  | 'TouchableOpacity'
  | 'SafeAreaView'
  | 'StatusBar'
  | 'TextInput'
  | 'Switch'
  | 'ActivityIndicator'
  | 'FlatList'
  | 'SectionList'
  | 'Modal';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComponentStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  flex?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  position?: 'absolute' | 'relative';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  zIndex?: number;
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
  display?: 'flex' | 'none';
  [key: string]: any;
}

export interface Component {
  id: string;
  type: ComponentType;
  name: string;
  parentId: string | null;
  children: string[];
  position: Position;
  size: Size;
  style: ComponentStyle;
  props: {
    text?: string;
    source?: string;
    alt?: string;
    placeholder?: string;
    value?: string;
    onPress?: () => void;
    onChange?: (value: string) => void;
    [key: string]: any;
  };
}

export interface CanvasState {
  components: { [key: string]: Component };
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  draggedComponentId: string | null;
  dropTargetId: string | null;
  history: {
    past: CanvasState[];
    present: CanvasState;
    future: CanvasState[];
  };
}

export interface DropZone {
  id: string;
  parentId: string | null;
  position: Position;
  size: Size;
}

export interface DragItem {
  id: string;
  type: ComponentType;
  parentId: string | null;
}

export interface EditorState {
  canvas: CanvasState;
  isDragging: boolean;
  isResizing: boolean;
  showGrid: boolean;
  zoom: number;
  theme: 'light' | 'dark';
  codePreview: string;
  selectedTab: 'components' | 'styles' | 'code';
  searchQuery: string;
  recentComponents: ComponentType[];
  favorites: ComponentType[];
  history: {
    past: EditorState[];
    present: EditorState;
    future: EditorState[];
  };
} 