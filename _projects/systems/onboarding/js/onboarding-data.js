export const CHALLENGES = [
  { id: 'identity-forge', title: 'Identity Forge', description: 'Create your identity, choose an avatar and make the world your own.', image: '/images/tools/accounts.png', gate: 'identity-cookie' },
  { id: 'toolchain-trail', title: 'Toolchain Trail', description: 'Explore the tools and stations that bring your development environment to life.', image: '/images/tools/os.png', url: '/cs-pathway/toolchain-trail', gate: 'toolchain-snake' },
  { id: 'wayfinding-world', title: 'Wayfinding World', description: 'Find your place in the community and share your story.', image: '/images/projects/onboarding/wayfinding.svg', url: '/cs-pathway/wayfinding' },
  { id: 'mission-tools', title: 'AI Review Challenge', description: 'Answer AI-generated questions about tools, files, the SDLC and teamwork to boost your score.', image: '/images/projects/onboarding/ai-review.svg', url: '/cs-pathway/mission-tools' },
  { id: 'assessment-observatory', title: 'Assessment Observatory', description: 'Explore your learning, progress and next steps.', image: '/images/toolkit-nav-buttons/grades.png', url: '/cs-pathway/assessment-observatory' },
  { id: 'game-workbench', title: 'Game Workbench', description: 'Build a game world, configure its characters and explore the code.', image: '/images/projects/onboarding/game-workbench.svg', url: '/gamebuilder/v2/', direct: true },
  { id: 'ui-builder', title: 'UI Builder', description: 'Design a page from blocks and bring your project to life.', image: '/images/tools/github_pages.png', url: '/ui-builder/', direct: true },
];

export function challengeById(id) {
  return CHALLENGES.find(challenge => challenge.id === id);
}

export function viewerPath(id, baseurl = '') {
  const challenge = challengeById(id);
  if (challenge?.direct) return `${baseurl}${challenge.url}`;
  const query = new URLSearchParams({ onboarding_view: '1', challenge: id });
  return `${baseurl}/onboarding/view/?${query}`;
}
