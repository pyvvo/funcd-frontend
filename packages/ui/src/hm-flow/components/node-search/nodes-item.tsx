import { FC } from 'react';
import { Group, Image } from '@mantine/core';
import styles from './nodes-search.module.css';

export interface INodesItemProps {
  img: string;
  label: string;
  onSelect: (label: string) => void;
}

const NodesItem: FC<INodesItemProps> = ({ img, label, onSelect }) => (
  <Group className={styles.nodeItem} onClick={() => onSelect(label)}>
    <Image src={img} className={styles.icon} />
    <p>{label}</p>
  </Group>
);

export default NodesItem;
