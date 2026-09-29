import type { Meta, StoryObj } from '@storybook/react';
import CanvasForm from './canvas-form';
import { HmFlowDepsProvider } from '@/hm-flow/provider';
import {
  FormBuilder,
  ReactiveTextareaField,
  ReactiveTextField
} from '@/reactive-form';

FormBuilder.defineWidget({ name: 'text', component: ReactiveTextField });
FormBuilder.defineWidget({
  name: 'textarea',
  component: ReactiveTextareaField
});
// ############################ Reactive form ######################

type Story = StoryObj<typeof CanvasForm>;

const meta: Meta<typeof CanvasForm> = {
  title: 'HmFlow/CanvasForm',
  component: CanvasForm
};

export default meta;

export const _CanvasForm: Story = {
  // CanvasForm closes the flow's drawer on submit, through the flow's deps.
  render: (args) => (
    <HmFlowDepsProvider deps={{ setDrawerOpened: () => {} } as never}>
      <CanvasForm {...args} />
    </HmFlowDepsProvider>
  ),
  args: {
    defaultValues: {
      name: '',
      version: ''
    },
    meta: [
      {
        name: 'Create workflow',
        fields: [
          {
            fieldKey: 'name',
            label: 'Name',
            type: 'text',
            options: {
              required: true
            }
          },
          {
            fieldKey: 'description',
            label: 'Description',
            type: 'textarea',
            options: {
              maxLength: 300
            }
          },
          {
            fieldKey: 'version',
            label: 'Version',
            type: 'text'
          }
        ]
      }
    ]
  }
};
