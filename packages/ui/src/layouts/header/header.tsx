/* eslint-disable react/require-default-props */
import { SearchBar, ToggleThemeMode } from '@/molecules';
import { Avatar, Box, Portal, Title } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import { FC, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';

const container = document.createElement('div');
const containerId = '#hm-overlay-header';
container.id = containerId;

interface IHeader {
  moduleName: string;
  modulePath?: string;
  imageSrc?: string;
  offset?: number;
}

const Header: FC<IHeader> = (props) => {
  const { moduleName, modulePath, imageSrc, offset = 0 } = props;
  const location = useLocation();

  useEffect(() => {
    document.body.appendChild(container);
    return () => document.getElementById(containerId)?.remove();
    // `container` is a module-scope value, not reactive state, so it is not a
    // valid dependency — this effect is mount/unmount only.
  }, []);

  // Link back to the module's page only from a page below it (/tables/transactions under /tables).
  const isLink =
    Boolean(modulePath) &&
    location.pathname !== modulePath &&
    location.pathname.startsWith(
      modulePath?.endsWith('/') ? modulePath : `${modulePath}/`
    );

  return (
    <Portal target={container}>
      <Box component="header" className={styles.header}>
        <Title size="h1" mod={{ link: isLink }} className={styles.title}>
          {isLink && modulePath ? (
            <Link to={modulePath} className={styles.titleLink}>
              {moduleName}
            </Link>
          ) : (
            moduleName
          )}
        </Title>
        <Box className={styles.featureBar}>
          <SearchBar
            className={styles.searchBar}
            onClick={() => spotlight.open()}
          />
          <ToggleThemeMode />
          <Avatar
            radius="xl"
            mx="xs"
            src={imageSrc}
            style={(theme) => ({
              color: theme.primaryColor
            })}
          />
        </Box>
      </Box>
    </Portal>
  );
};

export default Header;
