export function profilePanelOptions(gameEnv) {
  const hud = gameEnv.game?.environment?.pathwayHud;
  if (!hud) return {};
  return {
    mountTo: () => {
      hud.details.hidden = false;
      return hud.profile;
    },
    layout: 'inline',
    width: '100%',
  };
}

export function scoreboardOptions(gameEnv) {
  const hud = gameEnv.game?.environment?.pathwayHud;
  return hud ? { mountTo: hud.scores, showNextLevel: false } : {};
}
