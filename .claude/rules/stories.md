---
paths:
  - '**/*.stories.tsx'
  - 'packages/ui/src/story-utils/**/*'
  - 'packages/ui/.storybook/**/*'
---

# Stories (Storybook 10)

- Shape of a story file:

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react';
  import FlowCard from './card';

  type Story = StoryObj<typeof FlowCard>;

  const meta: Meta<typeof FlowCard> = {
    title: 'Molecules/FlowCard',
    component: FlowCard
  };

  export default meta;

  export const _FlowCard: Story = {
    args: {
      flowName: 'Flow Name',
      lastUpdated: new Date()
    }
  };
  ```

- Titles follow `<Group>/<ComponentName>`, where the group follows the source folder: `Atoms`, `Molecules`, `Layouts`, `Template`, `HmFlow`, `Reactive Field`, `Reactive Form`, `Features`.
- Story names: `_ComponentName` when the component is imported under its own name. When it is imported under a short alias (`import BB from './bottom-bar'`), use the plain name (`BottomBar`). Other variants get descriptive names (`Showcase`, `BarChart`, `WithMobx`).
- Prefer `args`. Use `render` when the story needs hooks or a wrapper. Controls look like `argTypes: { size: { options: [...], control: { type: 'select' } } }`.
- Decorators come from `@/story-utils` and are set on `meta`: `ReactRouterDecorator`, `ReactiveFieldDecorator(defaultValues)`, `ReactiveFormDecorator(defaultValues)` and `MantineSpotlightDecorator`. `.storybook/preview.tsx` provides Mantine globally.
- New story files do not get the old lint header or the "title prop is optional" comment; only the 2024 files have them.
- Interaction tests: `play` functions use `getReactiveRef(canvasElement, fieldKey)`, plus `userEvent` and `expect` from `storybook/test`. They end with `await waitFor(async () => { await expect(JSON.parse(resultRef.value)).toEqual({ ... }); })`.
- Models: `packages/ui/src/hm-flow/components/toolbar/toolbar.stories.tsx`, and for a reactive field, `reactive-text-field.stories.tsx`.
