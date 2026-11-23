export const CHALLENGES = [
  { id: 'identity-forge', title: 'Identity Forge', description: 'Create your identity, choose an avatar and make the world your own.', image: '/images/projects/cs-pathway/bg/identity-forge-default.png', url: '/onboarding/identity-game/' },
  { id: 'toolchain-trail', title: 'Toolchain Trail', description: 'Explore the tools and stations that bring your development environment to life.', image: '/images/projects/cs-pathway/bg/toolchain-trail-space.png', url: '/cs-pathway/toolchain-trail' },
  { id: 'wayfinding-world', title: 'Wayfinding World', description: 'Find your place in the community and share your story.', image: '/images/projects/cs-pathway/bg1/wayfinding-world-city.png', url: '/cs-pathway/wayfinding' },
  { id: 'mission-tools', title: 'Mission Tools', description: 'Practice the tools and workflows used to build a project.', image: '/images/projects/cs-pathway/bg2/mission-tools-city.png', url: '/cs-pathway/mission-tools' },
  { id: 'assessment-observatory', title: 'Assessment Observatory', description: 'Explore your learning, progress and next steps.', image: '/images/projects/cs-pathway/bg3/assessment-observatory-city.png', url: '/cs-pathway/assessment-observatory' },
  { id: 'game-workbench', title: 'Game Workbench', description: 'Build a game world, configure its characters and explore the code.', image: '/images/projects/cs-pathway/bg/toolchain-trail-space.png', url: '/gamebuilder/v2/' },
  { id: 'ui-builder', title: 'UI Builder', description: 'Design a page from blocks and bring your project to life.', image: '/images/projects/cs-pathway/bg1/wayfinding-world-city.png', url: '/ui-builder/', external: true },
];

export function challengeById(id) {
  return CHALLENGES.find(challenge => challenge.id === id);
}

export function viewerPath(id, baseurl = '') {
  const query = new URLSearchParams({ onboarding_view: '1', challenge: id });
  return `${baseurl}/onboarding/view/?${query}`;
}
