export class ResizeEvent {
  constructor(nativeEvent, directions, allowedDirections) {
    this.nativeEvent = nativeEvent
    this.directions = directions
    this.allowedDirections = allowedDirections
  }
}
export class MoveEvent {
  constructor(nativeEvent, directions) {
    this.nativeEvent = nativeEvent
    this.directions = directions
  }
}
