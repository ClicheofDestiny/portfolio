import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AttractMode from '../../../src/components/AttractMode.vue';
import { siteConfig } from '../../../src/config/site';

describe('AttractMode', () => {
  it('renders all high score entries', () => {
    const wrapper = mount(AttractMode);
    siteConfig.highScores.forEach(entry => {
      expect(wrapper.text()).toContain(entry.label);
    });
  });

  it('emits "start" when clicked', async () => {
    const wrapper = mount(AttractMode);
    await wrapper.trigger('click');
    expect(wrapper.emitted('start')).toBeTruthy();
  });

  it('emits "start" when any key is pressed', async () => {
    const wrapper = mount(AttractMode);
    await wrapper.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('start')).toBeTruthy();
  });
});
