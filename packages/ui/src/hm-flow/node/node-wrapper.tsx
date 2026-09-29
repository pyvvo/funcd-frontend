import { Node, NodeProps } from '@xyflow/react';
import { ComponentType } from 'react';
import { INodeAction } from './types';

interface INodeWrapper<
  TPyNodeProps extends Node
> extends NodeProps<TPyNodeProps> {
  NodeType: ComponentType<NodeProps<TPyNodeProps>>;
  actions?: INodeAction[];
}

const NodeWrapper = <TPyNodeProps extends Node>(
  props: INodeWrapper<TPyNodeProps>
) => {
  const { NodeType, actions, data, ...rest } = props;
  const modifiedData = { ...data, actions };
  return <NodeType data={modifiedData} {...rest} />;
};

export default NodeWrapper;
