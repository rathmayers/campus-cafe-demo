// Shared content: both versions show exactly the same information.
// Only the implementation differs.

export const cafe = {
  name: 'Campus Café',
  tagline: 'Good coffee for long study days',
  street: 'Example Street 1',
  city: '80000 Munich',
  phone: '+49 89 000 000 00',
  email: 'hello@campus-cafe.example',
  hours: [
    { days: 'Monday – Friday', time: '7:30 – 19:00' },
    { days: 'Saturday', time: '9:00 – 16:00' },
    { days: 'Sunday', time: 'closed' },
  ],
};

export const special = {
  name: 'Pumpkin Spice Latte',
  price: '3,90 €',
  note: 'Only until 4 pm',
};

export const menu = [
  {
    category: 'Coffee',
    items: [
      { name: 'Espresso', description: 'Single shot, house blend', price: '2,20 €' },
      { name: 'Cappuccino', description: 'Espresso, steamed milk, foam', price: '3,20 €' },
      { name: 'Flat White', description: 'Double shot, silky milk', price: '3,60 €' },
      { name: 'Oat Latte', description: 'With oat milk, no surcharge', price: '3,70 €' },
    ],
  },
  {
    category: 'Tea & more',
    items: [
      { name: 'Chai Latte', description: 'Spiced black tea with milk', price: '3,50 €' },
      { name: 'Fresh mint tea', description: 'Organic mint, hot water, honey on request', price: '2,80 €' },
      { name: 'Hot chocolate', description: 'Dark chocolate, whipped cream optional', price: '3,40 €' },
    ],
  },
  {
    category: 'Food',
    items: [
      { name: 'Butter croissant', description: 'Baked fresh every morning', price: '2,10 €' },
      { name: 'Bagel', description: 'Cream cheese, cucumber, chives (vegetarian)', price: '4,50 €' },
      { name: 'Exam-week bowl', description: 'Oats, berries, nuts (vegan)', price: '5,20 €' },
    ],
  },
];

export const events = [
  {
    slug: 'open-mic',
    title: 'Open Mic Night',
    date: '2026-11-05',
    dateLabel: 'Thursday, 5 November 2026',
    time: '19:00',
    text: 'Music, poetry, comedy: five minutes on stage for everyone who signs up.',
  },
  {
    slug: 'study-marathon',
    title: 'Exam Study Marathon',
    date: '2026-11-19',
    dateLabel: 'Thursday, 19 November 2026',
    time: '8:00 – 22:00',
    text: 'Long opening hours, quiet zones, and free coffee refills for students.',
  },
  {
    slug: 'latte-art',
    title: 'Latte Art Workshop',
    date: '2026-12-03',
    dateLabel: 'Thursday, 3 December 2026',
    time: '17:00',
    text: 'Learn to pour a heart, a tulip, and a rosetta. Max. 8 participants.',
  },
];

/** Prefix a path with the configured base (works for GitHub Pages sub-paths). */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
