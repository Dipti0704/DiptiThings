export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/assets/avatar.png',
    alt: 'Taranpreet Singh',
    width: 48,
    height: 48,
  },
  navItems: [
    { label: 'Experience', href: '/work-experience' },
    { label: 'Projects', href: '/projects' },
    { label: 'Resume', href: '/resume' },
    { label: 'Gears', href: '/gears' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],
};
