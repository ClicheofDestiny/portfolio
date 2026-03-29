export const siteConfig = {
  name: 'Justin Keevers',
  tagline: 'Engineering Manager',
  marquee: 'ENGINEERING MANAGER | TECH LEADER | WRITER',

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
    linkedin: 'https://www.linkedin.com/in/justin-keevers-96255991/',
    github: 'https://github.com/ClicheofDestiny',
    email: 'jpkeevers@gmail.com',
  },
} as const;
