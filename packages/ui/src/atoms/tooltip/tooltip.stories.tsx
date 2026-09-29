/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Tooltip } from '@mantine/core';

type Story = StoryObj<typeof Tooltip>;

const meta: Meta<typeof Tooltip> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    label: {
      control: 'text'
    },
    position: {
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'select' }
    },
    color: {
      options: ['blue', 'red', 'cyan', 'yellow', 'gray'],
      control: { type: 'select' }
    },
    arrowPosition: {
      options: ['center', 'side'],
      control: { type: 'select' }
    },
    withArrow: {
      control: { type: 'boolean' }
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    disabled: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    },
    offset: {
      control: {
        type: 'number'
      }
    },
    arrowOffset: {
      control: {
        type: 'number'
      }
    },
    arrowRadius: {
      control: {
        type: 'number'
      }
    },
    arrowSize: {
      control: {
        type: 'number'
      }
    },
    w: {
      control: {
        type: 'number'
      }
    },
    opened: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    },
    multiline: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    }
  },
  render: (args) => {
    return (
      <Tooltip {...args}>
        <Button>Show Tooltip</Button>
      </Tooltip>
    );
  }
};
export default meta;

export const _Tooltip: Story = {
  args: {
    radius: 'lg',
    label: 'Tooltip',
    offset: 6,
    arrowOffset: 6,
    arrowRadius: 6,
    arrowSize: 6,
    w: 200
  }
};
