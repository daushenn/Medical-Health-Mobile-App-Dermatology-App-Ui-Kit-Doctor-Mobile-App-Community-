export const doctors = [
  {
    id: '1', name: 'Dr. Olivia Turner, M.D.', spec: 'Dermato-Endocrinology', rating: 5, reviews: 60,
    years: 20, hours: 'Mon - Sat / 9 AM - 4 PM', workDays: [0, 1, 2, 3, 4, 5],
    focus: 'The impact of hormonal imbalances on skin conditions, specializing in acne, hirsutism, and other skin disorders.',
    about: 'Dr. Olivia Turner is a dermato-endocrinologist who treats skin problems caused by hormonal changes. She combines clinical dermatology with endocrine diagnostics to find the root cause of chronic conditions.',
  },
  {
    id: '2', name: 'Dr. Alexander Bennett, Ph.D.', spec: 'Dermato-Genetics', rating: 4.5, reviews: 40,
    years: 15, hours: 'Mon - Fri / 10 AM - 5 PM', workDays: [0, 1, 2, 3, 4],
    focus: 'Inherited skin diseases and genetic testing for personalised dermatological treatment.',
    about: 'Dr. Alexander Bennett researches and treats hereditary skin disorders. He uses genetic testing to build treatment plans tailored to each patient.',
  },
  {
    id: '3', name: 'Dr. Sophia Martinez, Ph.D.', spec: 'Cosmetic Bioengineering', rating: 5, reviews: 150,
    years: 12, hours: 'Tue - Sat / 9 AM - 3 PM', workDays: [1, 2, 3, 4, 5],
    focus: 'Advanced skin rejuvenation, scar treatment and bioengineered cosmetic procedures.',
    about: 'Dr. Sophia Martinez develops and performs modern cosmetic procedures based on bioengineering, with a focus on natural-looking results and skin health.',
  },
  {
    id: '4', name: 'Dr. Michael Davidson, M.D.', spec: 'Nano-Dermatology', rating: 4.8, reviews: 90,
    years: 10, hours: 'Mon - Thu / 11 AM - 6 PM', workDays: [0, 1, 2, 3],
    focus: 'Nanotechnology-based delivery of medicines for acne, psoriasis and sensitive skin.',
    about: 'Dr. Michael Davidson specialises in nano-dermatology, using nanoparticle-based treatments that deliver active ingredients deeper into the skin with fewer side effects.',
  },
];

export type Doctor = (typeof doctors)[number];