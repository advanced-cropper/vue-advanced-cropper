export class ResizeEvent {
  constructor(nativeEvent, directions, allowedDirections, massPoint) {
    this.nativeEvent = nativeEvent
    this.directions = directions
    this.allowedDirections = allowedDirections
    this.massPoint = massPoint
  }
}

export class MoveEvent {
  constructor(nativeEvent, directions) {
    this.nativeEvent = nativeEvent
    this.directions = directions
  }
}

export class DragEvent {
  constructor(nativeEvent, position, element, anchor) {
    this.nativeEvent = nativeEvent
    this.position = position
    this.element = element
    this.anchor = anchor
  }
}
