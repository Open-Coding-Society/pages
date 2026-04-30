/**
 * Level configs consumed by RobotLogicLevel.
 *
 * Direction codes: 0=East, 1=South, 2=West, 3=North.
 * `walls` is a list of [col, row] pairs.
 * `tutorialSteps[].check` accepts: 'hasRun' | 'hasWon' | 'hasBlock:<type>'.
 * `starThresholds.three` = max blocks for 3 stars; `.two` = max for 2 stars.
 */

export const levelConfigs = [
  {
    id: 1,
    name: 'First Steps',
    blurb: '7×7, no walls. Learn the basics.',
    gridSize: 7,
    walls: [],
    start: { col: 0, row: 3, dir: 0 },
    goal: { col: 6, row: 0 },
    availableBlocks: ['forward', 'turnLeft', 'turnRight', 'repeat'],
    starThresholds: { three: 5, two: 8 },
    tutorialSteps: [
      { text: 'Drag a Move Forward block from the Blocks panel into the Program panel.',
        check: 'hasBlock:forward', highlight: '[data-block-type="forward"]' },
      { text: 'Now add a Turn Left block so the robot can change direction.',
        check: 'hasBlock:turnLeft', highlight: '[data-block-type="turnLeft"]' },
      { text: 'Press Run to execute your program and watch the robot move.',
        check: 'hasRun', highlight: '[data-action="run"]' },
      { text: 'Try a Repeat N times block — it wraps other blocks and repeats them.',
        check: 'hasBlock:repeat', highlight: '[data-block-type="repeat"]' },
      { text: 'Final step — program the robot to reach the green square.',
        check: 'hasWon', highlight: null },
    ],
  },

  {
    id: 2,
    name: 'Around the Wall',
    blurb: 'Walls block the direct path. Plan a detour.',
    gridSize: 7,
    walls: [[3, 2], [3, 3], [3, 4]],
    start: { col: 0, row: 3, dir: 0 },
    goal: { col: 6, row: 3 },
    availableBlocks: ['forward', 'turnLeft', 'turnRight', 'repeat'],
    starThresholds: { three: 11, two: 14 },
    tutorialSteps: [
      { text: 'Walls block the robot. Route around them to reach the green square.',
        check: 'hasWon', highlight: null },
    ],
  },

  {
    id: 3,
    name: 'The Long Way',
    blurb: 'A long detour. Use Repeat blocks to keep your program short.',
    gridSize: 7,
    walls: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
    start: { col: 0, row: 0, dir: 0 },
    goal: { col: 6, row: 0 },
    availableBlocks: ['forward', 'turnLeft', 'turnRight', 'repeat'],
    starThresholds: { three: 11, two: 17 },
    tutorialSteps: [
      { text: 'This path is long. Use Repeat N times to stay efficient.',
        check: 'hasBlock:repeat', highlight: '[data-block-type="repeat"]' },
      { text: 'Route around the wall and reach the green square.',
        check: 'hasWon', highlight: null },
    ],
  },

  {
    id: 4,
    name: 'Reverse Course',
    blurb: 'New block: Move Backward. No need to turn around.',
    gridSize: 7,
    walls: [],
    start: { col: 5, row: 3, dir: 0 },
    goal: { col: 0, row: 3 },
    availableBlocks: ['forward', 'backward', 'turnLeft', 'turnRight', 'repeat'],
    starThresholds: { three: 2, two: 4 },
    tutorialSteps: [
      { text: 'Add a Move Backward block — it moves the robot without turning it around.',
        check: 'hasBlock:backward', highlight: '[data-block-type="backward"]' },
      { text: 'Now reach the green square. Try combining Backward with Repeat for the best score.',
        check: 'hasWon', highlight: null },
    ],
  },

  {
    id: 5,
    name: 'Corridor Maze',
    blurb: 'A real maze — walls, loops, and backward moves together.',
    gridSize: 7,
    walls: [
      [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
    ],
    start: { col: 0, row: 0, dir: 0 },
    goal: { col: 6, row: 6 },
    availableBlocks: ['forward', 'backward', 'turnLeft', 'turnRight', 'repeat'],
    starThresholds: { three: 13, two: 20 },
    tutorialSteps: [
      { text: 'Navigate the switchback corridors to reach the goal.',
        check: 'hasWon', highlight: null },
    ],
  },

  {
    id: 6,
    name: 'Right-Hand Spiral',
    blurb: 'New block: If Can Move. Walk until blocked, then turn — solve with one nested loop.',
    gridSize: 7,
    walls: [[3, 0], [2, 3]],
    start: { col: 0, row: 0, dir: 0 },
    goal: { col: 0, row: 2 },
    availableBlocks: ['forward', 'turnLeft', 'turnRight', 'repeat', 'ifCanMove'],
    starThresholds: { three: 5, two: 9 },
    tutorialSteps: [
      { text: 'Drop an If Can Move Forward block — it runs its body only when the path ahead is clear.',
        check: 'hasBlock:ifCanMove', highlight: '[data-block-type="ifCanMove"]' },
      { text: 'Combine it with Repeat: try wrapping If Can Move + a turn in a Repeat to walk-then-turn until you reach the goal.',
        check: 'hasWon', highlight: null },
    ],
  },
];

export default levelConfigs;
