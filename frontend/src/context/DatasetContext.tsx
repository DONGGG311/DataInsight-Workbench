import { createContext, useContext, useReducer, ReactNode } from 'react';

interface ColumnInfo {
  name: string;
  dtype: string;
  missing_count: number;
}

interface DatasetState {
  currentId: string | null;
  columns: ColumnInfo[];
  rowCount: number;
  colCount: number;
  filename: string;
  loading: boolean;
}

type Action =
  | { type: 'SET_DATASET'; payload: Omit<DatasetState, 'loading'> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR' };

const initialState: DatasetState = {
  currentId: null,
  columns: [],
  rowCount: 0,
  colCount: 0,
  filename: '',
  loading: false,
};

function reducer(state: DatasetState, action: Action): DatasetState {
  switch (action.type) {
    case 'SET_DATASET':
      return { ...state, ...action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

const DatasetContext = createContext<{
  state: DatasetState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DatasetContext.Provider value={{ state, dispatch }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetContext() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDatasetContext must be inside DatasetProvider');
  return ctx;
}
