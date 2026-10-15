import dayjs from 'dayjs';
import { AutomationType } from '../../api/contract';
import { flowNode } from '../../automations/automation-nodes';

const edge = (source: string, target: string) => ({
  id: `${source}-${target}`,
  source,
  target,
  animated: true
});

export const automations: AutomationType[] = [
  {
    id: 'cold-chain',
    name: 'Cold chain guard',
    description: 'Notify the team when a cold room gets warmer than 8 °C',
    enabled: true,
    updatedAt: dayjs().subtract(2, 'day').toISOString(),
    flow: {
      nodes: [
        flowNode('sensor', 'sensor-1', 0),
        flowNode('threshold', 'threshold-1', 1),
        flowNode('email', 'email-1', 2)
      ],
      edges: [edge('sensor-1', 'threshold-1'), edge('threshold-1', 'email-1')]
    }
  },
  {
    id: 'offline-restart',
    name: 'Restart offline devices',
    description:
      'Wait 10 minutes, then restart a device that stopped reporting',
    enabled: true,
    updatedAt: dayjs().subtract(5, 'hour').toISOString(),
    flow: {
      nodes: [
        flowNode('sensor', 'sensor-1', 0),
        flowNode('wait', 'wait-1', 1),
        flowNode('restart', 'restart-1', 2),
        flowNode('slack', 'slack-1', 3)
      ],
      edges: [
        edge('sensor-1', 'wait-1'),
        edge('wait-1', 'restart-1'),
        edge('restart-1', 'slack-1')
      ]
    }
  },
  {
    id: 'battery-saver',
    name: 'Battery saver',
    description: 'Slow down reporting when a battery drops below 15%',
    enabled: false,
    updatedAt: dayjs().subtract(12, 'day').toISOString(),
    flow: {
      nodes: [
        flowNode('sensor', 'sensor-1', 0),
        flowNode('threshold', 'threshold-1', 1),
        flowNode('interval', 'interval-1', 2)
      ],
      edges: [
        edge('sensor-1', 'threshold-1'),
        edge('threshold-1', 'interval-1')
      ]
    }
  }
];
