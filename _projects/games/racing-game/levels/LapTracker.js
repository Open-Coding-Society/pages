/**
 * LapTracker - counts laps for each car. Pure logic with no drawing or DOM, so it can be tested.
 *
 * The finish line is a vertical segment across the track in normalized (0-1) coordinates:
 * { x, top, bottom }. Cars race to the right, so a lap only counts when a car crosses it moving
 * right after it has been round the far side of the track.
 *
 * Each track supplies a narrow checkpoint segment on its far side. Requiring that gate prevents
 * shortcuts elsewhere on the track from being counted as completed laps.
 */

/**
 * Which way a move from `previous` to `current` crossed a vertical line.
 * @returns {number} 1 if it crossed moving right, -1 if moving left, 0 if it did not cross
 */
export function getCrossingDirection(previous, current, line) {
  const startsLeft = previous.x < line.x;
  const endsLeft = current.x < line.x;
  if (startsLeft === endsLeft) return 0;

  // Height where the move passes the line, so crossings above or below the track are ignored.
  const progress = (line.x - previous.x) / (current.x - previous.x);
  const crossingY = previous.y + progress * (current.y - previous.y);
  if (crossingY < line.top || crossingY > line.bottom) return 0;

  return endsLeft ? -1 : 1;
}

function validateLine(line, label) {
  const valid = line && [line.x, line.top, line.bottom].every(Number.isFinite) && line.top < line.bottom;
  if (!valid) {
    throw new TypeError(`LapTracker ${label} needs finite x, top and bottom with top < bottom`);
  }
}

export default class LapTracker {
  constructor({ finishLine, checkpoint, totalLaps }) {
    validateLine(finishLine, 'finishLine');
    validateLine(checkpoint, 'checkpoint');
    if (!Number.isInteger(totalLaps) || totalLaps < 1) {
      throw new RangeError('LapTracker totalLaps must be a positive whole number');
    }
    this.finishLine = finishLine;
    this.checkpoint = checkpoint;
    this.totalLaps = totalLaps;
    // Keyed by car object, because both cars share the same canvas id.
    this.cars = new Map();
  }

  /**
   * Record a car's new centre and update its laps.
   * @returns {boolean} true on the frame this car completes its final lap
   */
  update(car, centre) {
    const state = this.cars.get(car);
    if (!state) {
      this.cars.set(car, { previous: centre, lapsCompleted: 0, passedCheckpoint: false, finished: false });
      return false;
    }

    const previous = state.previous;
    state.previous = centre;
    if (state.finished) return false;

    const checkpointDirection = getCrossingDirection(previous, centre, this.checkpoint);
    if (checkpointDirection < 0) {
      state.passedCheckpoint = true;
    } else if (checkpointDirection > 0) {
      state.passedCheckpoint = false;
    }

    const finishDirection = getCrossingDirection(previous, centre, this.finishLine);
    if (finishDirection < 0) {
      // Reversing over the line cancels progress, so driving backwards round the track never counts.
      state.passedCheckpoint = false;
    } else if (finishDirection > 0 && state.passedCheckpoint) {
      state.lapsCompleted += 1;
      state.passedCheckpoint = false;
      if (state.lapsCompleted >= this.totalLaps) {
        state.finished = true;
        return true;
      }
    }
    return false;
  }

  /** Laps the car has fully completed, from 0 up to totalLaps. */
  getLapsCompleted(car) {
    return this.cars.get(car)?.lapsCompleted || 0;
  }

  /** True once the car has been round the far side and only needs to cross the finish line. */
  hasPassedCheckpoint(car) {
    return this.cars.get(car)?.passedCheckpoint || false;
  }
}
