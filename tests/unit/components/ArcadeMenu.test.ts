import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    expect(items[0].attributes('aria-current')).toBe('true');
    expect(items[1].attributes('aria-current')).toBeUndefined();
  });

  it('ArrowDown moves selection to next item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-current')).toBeUndefined();
    expect(items[1].attributes('aria-current')).toBe('true');
  });

  it('ArrowUp wraps from first to last item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    const items = wrapper.findAll('[role="menuitem"]');
    const last = items[items.length - 1];
    expect(last.attributes('aria-current')).toBe('true');
  });

  it('ArrowDown wraps from last to first item', async () => {
    const wrapper = mount(ArcadeMenu);
    const lastIndex = siteConfig.nav.length - 1;
    for (let i = 0; i < lastIndex; i++) {
      await wrapper.trigger('keydown', { key: 'ArrowDown' });
    }
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-current')).toBe('true');
  });

  describe('navigation', () => {
    beforeEach(() => {
      vi.stubGlobal('location', { href: '' });
    });

    it('Enter navigates to selected item href', async () => {
      const wrapper = mount(ArcadeMenu);
      await wrapper.trigger('keydown', { key: 'Enter' });
      expect(window.location.href).toBe(siteConfig.nav[0].href);
    });

    it('clicking an item navigates to its href', async () => {
      const wrapper = mount(ArcadeMenu);
      const items = wrapper.findAll('[role="menuitem"]');
      await items[2].trigger('click');
      expect(window.location.href).toBe(siteConfig.nav[2].href);
    });
  });
});
