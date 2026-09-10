// Model: Property Database — All property definitions for Real Estate Tycoon

const RESIDENTIAL = [
  {
    id: 'starter_home', name: 'Starter Home', type: 'residential', tier: 1,
    price: 145000, monthlyRent: 1150,
    desc: 'Cozy 2BR/1BA in a quiet suburb. Great first investment.',
    roi: 0.095, risk: 'low', emoji: '🏠',
  },
  {
    id: 'duplex', name: 'Urban Duplex', type: 'residential', tier: 1,
    price: 265000, monthlyRent: 2200,
    desc: 'Two-unit rental. Two tenants, double the income stream.',
    roi: 0.100, risk: 'low', emoji: '🏘️',
  },
  {
    id: 'condo', name: 'Downtown Condo', type: 'residential', tier: 2,
    price: 390000, monthlyRent: 3100,
    desc: 'High-demand modern condo steps from the city core.',
    roi: 0.095, risk: 'medium', emoji: '🏙️',
  },
  {
    id: 'townhouse', name: 'Luxury Townhouse', type: 'residential', tier: 2,
    price: 520000, monthlyRent: 4200,
    desc: '3-story townhome with rooftop terrace. Premium tenants.',
    roi: 0.097, risk: 'medium', emoji: '🏡',
  },
  {
    id: 'apartment_complex', name: 'Apartment Complex', type: 'residential', tier: 3,
    price: 980000, monthlyRent: 8500,
    desc: '18-unit complex with steady 95% occupancy rate.',
    roi: 0.104, risk: 'medium', emoji: '🏗️',
  },
  {
    id: 'suburban_estate', name: 'Suburban Estate', type: 'residential', tier: 3,
    price: 1400000, monthlyRent: 11000,
    desc: '6BR/5BA gated estate with pool and 4-car garage.',
    roi: 0.094, risk: 'low', emoji: '🏰',
  },
];

const COMMERCIAL = [
  {
    id: 'retail_shop', name: 'Retail Strip Shop', type: 'commercial', tier: 1,
    price: 210000, monthlyRent: 2100,
    desc: 'Corner retail on a busy shopping street. 100% leased.',
    roi: 0.120, risk: 'medium', emoji: '🏪',
  },
  {
    id: 'office_suite', name: 'Class-A Office Suite', type: 'commercial', tier: 1,
    price: 360000, monthlyRent: 3800,
    desc: 'Premium office space leased to a growing tech startup.',
    roi: 0.127, risk: 'medium', emoji: '🏦',
  },
  {
    id: 'restaurant_space', name: 'Restaurant Space', type: 'commercial', tier: 2,
    price: 520000, monthlyRent: 6200,
    desc: 'High-traffic restaurant with full kitchen build-out.',
    roi: 0.143, risk: 'high', emoji: '🍽️',
  },
  {
    id: 'medical_office', name: 'Medical Office', type: 'commercial', tier: 2,
    price: 680000, monthlyRent: 7500,
    desc: 'Long-term triple-net lease with medical practice. Very stable.',
    roi: 0.132, risk: 'low', emoji: '🏥',
  },
  {
    id: 'warehouse', name: 'Industrial Warehouse', type: 'commercial', tier: 2,
    price: 840000, monthlyRent: 9200,
    desc: 'E-commerce fulfillment center. 10-year lease secured.',
    roi: 0.131, risk: 'low', emoji: '🏭',
  },
  {
    id: 'office_building', name: 'Office Tower', type: 'commercial', tier: 3,
    price: 2800000, monthlyRent: 32000,
    desc: '12-story Class-A office tower in the financial district.',
    roi: 0.137, risk: 'high', emoji: '🏢',
  },
];

const LUXURY = [
  {
    id: 'beach_villa', name: 'Beachfront Villa', type: 'luxury', tier: 1,
    price: 3200000, monthlyRent: 24000,
    desc: 'Stunning oceanfront villa with private beach and infinity pool.',
    roi: 0.090, risk: 'medium', emoji: '🏖️',
  },
  {
    id: 'penthouse', name: 'Luxury Penthouse', type: 'luxury', tier: 2,
    price: 4800000, monthlyRent: 38000,
    desc: 'Full-floor penthouse. 360° panoramic city views.',
    roi: 0.095, risk: 'medium', emoji: '🌆',
  },
  {
    id: 'resort', name: 'Boutique Resort', type: 'luxury', tier: 2,
    price: 7500000, monthlyRent: 68000,
    desc: '42-room boutique resort. Peak season triples rental income.',
    roi: 0.109, risk: 'high', emoji: '🌴',
  },
  {
    id: 'private_island', name: 'Private Island Estate', type: 'luxury', tier: 3,
    price: 12000000, monthlyRent: 110000,
    desc: 'Exclusive island paradise. Chartered exclusively by billionaires.',
    roi: 0.110, risk: 'high', emoji: '🏝️',
  },
  {
    id: 'skyscraper', name: 'Mixed-Use Skyscraper', type: 'luxury', tier: 3,
    price: 18000000, monthlyRent: 175000,
    desc: 'Trophy asset: retail+office+residential tower. City landmark.',
    roi: 0.117, risk: 'high', emoji: '🗼',
  },
];

const ALL = [...RESIDENTIAL, ...COMMERCIAL, ...LUXURY];

class PropertyDatabase {
  getAll() { return ALL; }
  getResidential() { return RESIDENTIAL; }
  getCommercial() { return COMMERCIAL; }
  getLuxury() { return LUXURY; }

  getByType(type) {
    if (type === 'residential') return RESIDENTIAL;
    if (type === 'commercial') return COMMERCIAL;
    if (type === 'luxury') return LUXURY;
    return ALL;
  }

  getById(id) { return ALL.find(p => p.id === id) || null; }

  getUnowned(type, ownedIds = []) {
    return this.getByType(type).filter(p => !ownedIds.includes(p.id));
  }

  // Get a random selection of properties for a deal level
  getDealSelection(type, ownedIds = [], count = 3) {
    const available = this.getUnowned(type, ownedIds);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export default new PropertyDatabase();
