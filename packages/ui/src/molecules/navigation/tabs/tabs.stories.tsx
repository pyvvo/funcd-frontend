/* oxlint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/ActionIcon-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { rem, Tabs } from '@mantine/core';
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto
} from '@tabler/icons-react';

type Story = StoryObj<typeof Tabs>;

const meta: Meta<typeof Tabs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Molecules/Tabs',
  component: Tabs,
  argTypes: {
    variant: {
      options: ['default', 'outline', 'pills'],
      control: { type: 'select' }
    },
    orientation: {
      options: ['vertical', 'horizontal'],
      control: { type: 'select' }
    },
    placement: {
      options: ['left', 'right'],
      control: { type: 'select' }
    }
  },
  render: (args) => {
    const iconStyle = { width: rem(12), height: rem(12) };
    return (
      <Tabs defaultValue="photos" {...args}>
        <Tabs.List className="space-x-1">
          <Tabs.Tab
            value="photos"
            leftSection={<IconPhoto style={iconStyle} />}>
            Photos
          </Tabs.Tab>
          <Tabs.Tab
            value="collections"
            leftSection={<IconMessageCircle style={iconStyle} />}>
            Collections
          </Tabs.Tab>
          <Tabs.Tab
            value="users"
            leftSection={<IconSettings style={iconStyle} />}>
            Users
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="photos" className="mt-5">
          Photos tab content
        </Tabs.Panel>

        <Tabs.Panel value="collections" className="mt-5">
          Collections tab content
        </Tabs.Panel>

        <Tabs.Panel value="users" className="mt-5">
          Users tab content
        </Tabs.Panel>
      </Tabs>
    );
  }
};

export const _Tabs: Story = {
  args: {
    // radius: 'xl'
  }
};

export default meta;

// export const Showcase: Story = {
//   name: 'Showcase',
//   render: () => {
//     function Main() {
//       return (
//         <div className="flex h-full flex-col  items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6">
//           <div className="w-full">
//             <h6 className="font-semibold">Usage</h6>
//             <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white ">
//               k
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return <Main />;
//   }
// };
