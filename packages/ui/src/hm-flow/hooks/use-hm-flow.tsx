import { useContext } from 'react';
import { HmFlowContext } from '../provider';

const useHmFlow = () => {
  const context = useContext(HmFlowContext);
  if (!context) {
    throw new Error('useHmFlow must be used within a HmFlowProvider');
  }
  return context;
};

export default useHmFlow;
