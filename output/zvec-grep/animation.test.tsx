// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import type { MotionValue } from 'motion/react';
import { AnimationLoop, useAnimationTime } from './animation';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('keeps loop clocks independent and resumes a paused clock in place', async () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {}
  }));

  const clocks = new Map<string, MotionValue<number>>();
  function ClockProbe({ id }: { id: string }) {
    const time = useAnimationTime();
    React.useEffect(() => {
      clocks.set(id, time);
    }, [id, time]);
    return null;
  }
  function Example({ paused }: { paused: boolean }) {
    return (
      <>
        <AnimationLoop paused={paused} duration={10}>
          <ClockProbe id="first" />
        </AnimationLoop>
        <AnimationLoop duration={10}>
          <ClockProbe id="second" />
        </AnimationLoop>
      </>
    );
  }

  const view = render(<Example paused={false} />);
  await waitFor(() => expect(clocks.get('first')!.get()).toBeGreaterThan(0.05));
  view.rerender(<Example paused />);
  // Let Motion commit the playhead position of its last scheduled frame.
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
  const frozenTime = clocks.get('first')!.get();
  const secondTime = clocks.get('second')!.get();

  await waitFor(() =>
    expect(clocks.get('second')!.get()).toBeGreaterThan(secondTime + 0.05)
  );
  expect(clocks.get('first')!.get()).toBe(frozenTime);
  expect(clocks.get('first')).not.toBe(clocks.get('second'));

  view.rerender(<Example paused={false} />);
  await waitFor(() =>
    expect(clocks.get('first')!.get()).toBeGreaterThan(frozenTime + 0.05)
  );

  view.unmount();
  const unmountedTime = clocks.get('first')!.get();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
  });
  expect(clocks.get('first')!.get()).toBe(unmountedTime);
});
