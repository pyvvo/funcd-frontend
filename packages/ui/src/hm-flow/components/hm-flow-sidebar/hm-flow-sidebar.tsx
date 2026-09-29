import { Drawer, ScrollArea, Tabs } from '@mantine/core';
import { FC, useState } from 'react';
import { IHmFlowSideBarItem } from './hm-flow-sidebar.type';

export interface IHmFlowSideBarProps {
  items: IHmFlowSideBarItem[];
  drawerOpened: boolean;
  onDrawerClose: () => void;
  currentTab: string | null;
  testMode?: boolean;
}

const HmFlowSideBar: FC<IHmFlowSideBarProps> = (props) => {
  const {
    drawerOpened,
    items,
    onDrawerClose,
    currentTab,
    testMode = false
  } = props;
  const [activeTab, setActiveTab] = useState<string | null>(currentTab);

  return (
    <Drawer
      opened={drawerOpened}
      position="right"
      onClose={onDrawerClose}
      withCloseButton={false}
      padding="md"
      radius={16}
      offset={8}
      scrollAreaComponent={ScrollArea.Autosize}
      overlayProps={{ backgroundOpacity: 0.2, blur: 6 }}>
      <Tabs value={activeTab} onChange={setActiveTab}>
        {testMode ? (
          <Tabs.List>
            {items.map((item) => (
              <Tabs.Tab key={item.name} value={item.name}>
                {item.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        ) : null}

        {items.map((item) => {
          const { component: SideBarItem, name } = item;
          return (
            <Tabs.Panel key={item.name} value={name}>
              <SideBarItem />
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default HmFlowSideBar;
