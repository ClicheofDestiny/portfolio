import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArcadeMenu from '../../../src/components/ArcadeMenu.vue';
import { siteConfig } from '../../../src/config/site';

describe('ArcadeMenu', () => {
  it('renders all nav items', () => {
    const wrapper = mount(ArcadeMenu);
    siteConfig.nav.forEach(item => {
      expect(wrapper.text()).toContain(item.label);
    });
  });

  it('first item is selected by default', () => {
    const wrapper = mount(ArcadeMenu);
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('true');
    expect(items[1].attributes('aria-selected')).toBe('false');
  });

  it('ArrowDown moves selection to next item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('false');
    expect(items[1].attributes('aria-selected')).toBe('true');
  });

  it('ArrowUp wraps from first to last item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    const items = wrapper.findAll('[role="menuitem"]');
    const last = items[items.length - 1];
    expect(last.attributes('aria-selected')).toBe('true');
  });

  it('ArrowDown wraps from last to first item', async () => {
    const wrapper = mount(ArcadeMenu);
    const lastIndex = siteConfig.nav.length - 1;
    // Move to last item
    for (let i = 0; i < lastIndex; i++) {
      await wrapper.trigger('keydown', { key: 'ArrowDown' });
    }
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('true');
  });
});
