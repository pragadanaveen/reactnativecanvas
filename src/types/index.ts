export interface Component {
  id: string;
  type: string;
  props: {
    text?: string;
    source?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
}

export interface RootState {
  builder: BuilderState;
} 