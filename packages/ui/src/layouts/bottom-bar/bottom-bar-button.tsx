/* eslint-disable react/require-default-props */
import { NavBarLink } from '@/molecules';
import { MantineColor, Tooltip, UnstyledButton } from '@mantine/core';
import { TablerIcon } from '@tabler/icons-react';
import { FC, useState } from 'react';
import styles from './bottom-bar.module.css';

interface INavbarButton {
  icon: TablerIcon;
  label: string;
  color?: MantineColor;
  onClick?: () => void;
  to: string;
}

const NavbarButton: FC<INavbarButton> = (props) => {
  const { icon: Icon, label, onClick, color, to } = props;
  const [isActive, setIsActive] = useState(false);
  const handleIsactive = (param: boolean) => {
    setIsActive(param);
  };

  return (
    <NavBarLink to={to} handleIsActive={handleIsactive}>
      <Tooltip
        label={label}
        position="top"
        transitionProps={{ duration: 100 }}
        color={color}>
        <UnstyledButton
          onClick={onClick}
          mod={[{ active: isActive }]}
          className={styles.link}>
          <Icon stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </NavBarLink>
  );
};

export default NavbarButton;
