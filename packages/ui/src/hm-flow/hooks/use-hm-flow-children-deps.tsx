import { useContext } from 'react';
import { HmFlowChildrenDepsContext } from '../provider';

const useHmFlowChildrenDeps = () => {
  const context = useContext(HmFlowChildrenDepsContext);
  if (!context) {
    throw new Error('HmFlowChildrenDepsContext is not defined');
  }
  return context;
};

export default useHmFlowChildrenDeps;
