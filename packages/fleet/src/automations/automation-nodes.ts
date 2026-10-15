import type { IPyNode } from '@funcd-dev/ui';

export type NodeKindType =
  | 'sensor'
  | 'threshold'
  | 'wait'
  | 'email'
  | 'slack'
  | 'restart'
  | 'interval';

interface INodeKind {
  label: string;
  color: string;
}

// The steps an automation can chain; their icons are in public/nodes.
export const nodeKinds = {
  sensor: { label: 'Sensor reading', color: '#12b886' },
  threshold: { label: 'Threshold', color: '#fab005' },
  wait: { label: 'Wait', color: '#868e96' },
  email: { label: 'Email the team', color: '#228be6' },
  slack: { label: 'Post to Slack', color: '#7950f2' },
  restart: { label: 'Restart device', color: '#fa5252' },
  interval: { label: 'Set reporting interval', color: '#15aabf' }
} satisfies Record<NodeKindType, INodeKind>;

const nodeData = (kind: NodeKindType, name: string) => ({
  label: nodeKinds[kind].label,
  icon: `/nodes/${kind}.svg`,
  color: nodeKinds[kind].color,
  name,
  image: '',
  parameters: {},
  actions: []
});

// A node placed in a row, as the editor stores it.
export const flowNode = (kind: NodeKindType, id: string, index: number) => ({
  id,
  type: 'pyNode',
  position: { x: index * 220, y: 0 },
  data: nodeData(kind, id)
});

// The editor's node search: one entry per kind.
export const searchItems: IPyNode[] = (
  Object.keys(nodeKinds) as NodeKindType[]
).map((kind) => ({ id: kind, type: 'pyNode', data: nodeData(kind, kind) }));
