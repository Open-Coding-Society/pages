// ============================================
// srfscFallback.js
// RESPONSIBILITY: Content shown when the SRFSC backend is unreachable.
// Only facts published on srfiresafe.org belong here, never invented events or numbers.
// ============================================

export const COUNCIL_CONTACT = 'Call 858-201-3711 or email srfiresafecouncil@gmail.com';

export const OFFLINE_EVENTS_MESSAGE =
  `The live event calendar is offline right now. Clearing days run monthly. ${COUNCIL_CONTACT} for the next date.`;

export const OFFLINE_FORM_MESSAGE =
  `Online sign-ups are offline right now. ${COUNCIL_CONTACT} and we'll take it from there.`;

// Mirrors the seed updates in the Flask initSrfsc(); sourced from srfiresafe.org.
export const FALLBACK_UPDATES = Object.freeze([
  {
    title: 'Why we exist',
    body: 'The 2003 Cedar Fire destroyed 312 homes in Scripps Ranch. Neighbors founded the council in 2004 so the next fire meets cleared canyons and prepared households.',
    category: 'Impact Story',
  },
  {
    title: '650+ residential firebreaks',
    body: 'Volunteers and contractors have established more than 650 residential firebreaks and removed 340 dangerous trees along canyon edges.',
    category: 'Impact Story',
  },
  {
    title: 'Working with the agencies',
    body: 'SRFSC coordinates with CAL FIRE, San Diego Fire-Rescue, and the California Conservation Corps on fuel reduction and community education.',
    category: 'Partner',
  },
]);
