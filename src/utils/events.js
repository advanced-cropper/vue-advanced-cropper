export class ResizeEvent {
  constructor(nativeEvent, directions, anchor) {
    this.nativeEvent = nativeEvent
    this.directions = directions
    this.anchor = anchor
  }
}
export class MoveEvent {
  constructor(nativeEvent, directions, anchor) {
    this.nativeEvent = nativeEvent
    this.directions = directions
    this.anchor = anchor
  }
}
