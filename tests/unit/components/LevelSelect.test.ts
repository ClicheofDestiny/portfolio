import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LevelSelect from '../../../src/components/LevelSelect.vue';

const stages = [
  { slug: 'post-one', title: 'Post One', stage: 1, published: true, xp: 200, category: 'leadership', date: '2026-01-01' },
  { slug: 'post-two', title: 'Post Two', stage: 2, published: false, xp: 150, category: 'engineering', date: '2026-02-01' },
];

describe('LevelSelect', () => {
  it('renders all stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.findAll('[data-stage]')).toHaveLength(2);
  });

  it('shows title for published stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('POST ONE');
  });

  it('shows ??? for unpublished stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('???');
  });

  it('shows XP value for published stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('200');
  });

  it('published stages have a link, locked stages do not', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    const links = wrapper.findAll('a[href]');
    expect(links).toHaveLength(1);
    expect(links[0].attributes('href')).toContain('post-one');
  });
});
