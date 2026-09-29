import { Modal, ScrollArea, Tabs } from '@mantine/core';
import { FC, SetStateAction } from 'react';
import { IHmFlowModalItem } from './hm-flow-modal.type';

export interface IHmFlowModalProps {
  items: IHmFlowModalItem[];
  modalOpened: boolean;
  currentModalTab: string | null;
  testMode?: boolean;
  setModalOpened: (value: SetStateAction<boolean>) => void;
}

const HmFlowModal: FC<IHmFlowModalProps> = (props) => {
  const {
    modalOpened,
    items,
    currentModalTab,
    testMode = false,
    setModalOpened
  } = props;

  return (
    <Modal
      radius="lg"
      opened={modalOpened}
      overlayProps={{
        backgroundOpacity: 0.2,
        blur: 3
      }}
      withCloseButton={false}
      scrollAreaComponent={ScrollArea.Autosize}
      onClose={() => setModalOpened(false)}
      centered>
      <Tabs value={currentModalTab}>
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
          const { component: ModalItem, name } = item;
          return (
            <Tabs.Panel key={item.name} value={name}>
              <ModalItem />
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Modal>
  );
};

export default HmFlowModal;
