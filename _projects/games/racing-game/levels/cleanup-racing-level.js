export default function cleanupRacingLevel(gameEnv) {
  const cleanupErrors = [];

  for (const gameObject of [...gameEnv.gameObjects].reverse()) {
    try {
      gameObject.destroy();
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  gameEnv.gameObjects.length = 0;
  gameEnv.container.querySelectorAll('canvas').forEach((canvas) => canvas.remove());

  if (cleanupErrors.length > 0) {
    throw new AggregateError(cleanupErrors, 'Failed to clean up racing level objects');
  }
}
