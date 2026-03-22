export const siteConfig = {
  name: 'Justin Keevers',
  tagline: 'Engineering Leader',
  marquee: '★ JUSTIN KEEVERS ★ ENGINEERING LEADER ★ INSERT COIN ★',

  highScores: [
    { rank: '1ST', label: 'TEAMS GROWN', value: '×12' },
    { rank: '2ND', label: 'PRODUCTS SHIPPED', value: '×8' },
    { rank: '3RD', label: 'YRS EXPERIENCE', value: '×10+' },
  ],

  nav: [
    { key: '1', label: 'ABOUT ME', href: '/about' },
    { key: '2', label: 'MY WORK', href: '/work' },
    { key: '3', label: 'HOW I LEAD', href: '/leadership' },
    { key: '4', label: 'WRITING', href: '/writing' },
    { key: '5', label: 'CONTACT', href: '/contact' },
  ],

  social: {
    linkedin: 'https://linkedin.com/in/justinkeevers',
    github: 'https://github.com/justinkeevers',
    email: 'hello@justinkeevers.com',
  },
} as const;
