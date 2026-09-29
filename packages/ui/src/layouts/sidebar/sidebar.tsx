/* eslint-disable react/require-default-props */
import { CNDIcon } from '@/atoms';
import { Box, Center, Group, Stack } from '@mantine/core';
import { FC, useCallback } from 'react';
import { IModuleLink } from '../types';
import NavbarButton from './navbar-button';
import styles from './navbar-button.module.css';

interface ISideBar {
  modules: IModuleLink[];
}

const SideBar: FC<ISideBar> = (props) => {
  const { modules, ...rest } = props;

  const indexModuleFn = useCallback(
    (mainModules: IModuleLink[]) =>
      mainModules.filter((item) => item.isIndex)[0],
    // .sort((a, b) => a.label.localeCompare(b.label))
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [modules]
  );

  const menu = useCallback(
    (mainModules: IModuleLink[]) =>
      mainModules.filter((item) => !item.isBottom),
    // .sort((a, b) => a.label.localeCompare(b.label))
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [modules]
  );

  const bottomMenu = useCallback(
    (mainModules: IModuleLink[]) =>
      mainModules
        .filter((item) => item.isBottom)
        .sort((a, b) => a.label.localeCompare(b.label)),
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [modules]
  );

  const indexModule = indexModuleFn(modules);

  return (
    <Box className={styles.root} component="nav" {...rest}>
      <Box className={styles.navbar}>
        <Center>
          <Group className={styles.logo}>
            <CNDIcon />
          </Group>
        </Center>
        <Group grow component="section" mt={50}>
          <Stack justify="center" gap="sm">
            {menu(modules).map((link) => (
              <NavbarButton
                to={link.to ?? ''}
                color={link.color}
                label={link.label}
                key={link.label}>
                <link.icon stroke={1.5} />
              </NavbarButton>
            ))}
          </Stack>
        </Group>
        <Group grow component="section" className={styles.bottomMenu}>
          <Stack justify="flex-end" align="stretch" gap="sm">
            {bottomMenu(modules).map((link) => (
              <NavbarButton
                to={link.to ?? ''}
                color={link.color}
                label={link.label}
                key={link.label}>
                <link.icon stroke={1.5} />
              </NavbarButton>
            ))}
          </Stack>
        </Group>
      </Box>
    </Box>
  );
};

export default SideBar;
