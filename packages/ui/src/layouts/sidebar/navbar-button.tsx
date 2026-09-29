/* eslint-disable react/require-default-props */
import { MantineColor, Tooltip, UnstyledButton } from '@mantine/core';
import { FC, ReactNode, useState } from 'react';
import { NavBarLink } from '@/molecules';
import styles from './navbar-button.module.css';

interface INavbarButton {
  label: string;
  color?: MantineColor;
  onClick?: () => void;
  to: string;
  children: ReactNode;
}

const NavbarButton: FC<INavbarButton> = (props) => {
  const { label, onClick, color, to, children } = props;
  const [isActive, setIsActive] = useState(false);
  const handleIsactive = (param: boolean) => {
    setIsActive(param);
  };
  return (
    <NavBarLink to={to} handleIsActive={handleIsactive}>
      <Tooltip
        label={label}
        position="right"
        transitionProps={{ duration: 100 }}
        color={color}>
        <UnstyledButton
          variant="subtle"
          onClick={onClick}
          mod={[{ active: isActive }]}
          className={styles.link}>
          {children}
        </UnstyledButton>
      </Tooltip>
    </NavBarLink>
  );
};

export default NavbarButton;
