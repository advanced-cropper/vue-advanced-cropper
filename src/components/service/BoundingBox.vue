<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import { directionNames } from '../../utils/core.js';

const cn = bem('vue-bounding-box');

const HORIZONTAL_DIRECTIONS = ['east', 'west', null];
const VERTICAL_DIRECTIONS = ['south', 'north', null];

export default {
	name: 'BoundingBox',
	props: {
		img: {
			type: String
		},
		classname: {
			type: String
		},
		handlers: {
			type: Object,
			default() {
				return {
					eastNorth: true,
					north: true,
					westNorth: true,
					west: true,
					westSouth: true,
					south: true,
					eastSouth: true,
					east: true
				};
			}
		},
		handlerComponent: {
			type: [Object, String]
		},
		handlersClassnames: {
			type: Object,
			default() {
				return {};
			}
		},
		lines: {
			type: Object,
			default() {
				return {
					west: true,
					north: true,
					east: true,
					south: true
				};
			}
		},
		lineComponent: {
			type: [Object, String]
		},
		linesClassnames: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		const points = [];
		HORIZONTAL_DIRECTIONS.forEach(hDirection => {
			VERTICAL_DIRECTIONS.forEach(vDirection => {
				if (hDirection !== vDirection) {
					let { name, classname } = directionNames(hDirection, vDirection);
					points.push({
						name,
						classname,
						verticalDirection: vDirection,
						horizontalDirection: hDirection
					});
				}
			});
		});
		return {
			points
		};
	},
	computed: {
		classnames() {
			const handlers = this.handlersClassnames;
			const lines = this.linesClassnames;

			return {
				default: classnames(
					!this.disableDefaultClasses && cn(),
					this.classname
				),
				handlers,
				lines
			};
		},
		lineNodes() {
			const lines = [];
			this.points.forEach(point => {
				if (!point.horizontalDirection || !point.verticalDirection) {
					lines.push({
						name: point.name,
						component: this.lineComponent,
						visible: !!this.lines[point.name],
						classname: classnames(
							this.classnames.lines.default,
							this.classnames.lines[point.name]
						),
						hoverClassname: this.classnames.lines.hover,
						verticalDirection: point.verticalDirection,
						horizontalDirection: point.horizontalDirection
					});
				}
			});
			return lines;
		},
		handlerNodes() {
			const handlers = [];
			this.points.forEach(point => {
				handlers.push({
					name: point.name,
					component: this.handlerComponent,
					visible: !!this.handlers[point.name],
					classname: classnames(
						this.classnames.handlers.default,
						this.classnames.handlers[point.name]
					),
					hoverClassname: this.classnames.handlers.hover,
					verticalDirection: point.verticalDirection,
					horizontalDirection: point.horizontalDirection
				});
			});
			return handlers;
		}
	},
	beforeMount() {
		window.addEventListener('mouseup', this.onMouseUp, { passive: false });
		window.addEventListener('mousemove', this.onMouseMove, { passive: false });
		window.addEventListener('touchmove', this.onTouchMove, { passive: false });
		window.addEventListener('touchend', this.onTouchEnd, { passive: false });
	},
	beforeDestroy() {
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);
	},
	mounted() {
		this.touches = [];
		this.draggingAnchor = [];
	},
	methods: {
		onHandlerDrag(dragEvent, horizontalDirection, verticalDirection) {
			const position = dragEvent.position;
			const anchor = dragEvent.anchor;
			const directions = {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			};
			const handler = dragEvent.element;
			const { left, right, bottom, top } = handler.getBoundingClientRect();

			if (horizontalDirection === 'west') {
				directions.left += left - position.left + anchor.left;
			} else if (horizontalDirection === 'east') {
				directions.right += position.left - right + anchor.right;
			}
			if (verticalDirection === 'north') {
				directions.top += top - position.top + anchor.top;
			} else if (verticalDirection === 'south') {
				directions.bottom += position.top - bottom + anchor.bottom;
			}

			let respectDirection;
			if (!verticalDirection && horizontalDirection) {
				respectDirection = 'width';
			} else if (verticalDirection && !horizontalDirection) {
				respectDirection = 'height';
			}

			this.$emit('resize', {
				nativeEvent: dragEvent.nativeEvent,
				directions,
				allowedDirections: {
					left: horizontalDirection === 'west' || !horizontalDirection,
					right: horizontalDirection === 'east' || !horizontalDirection,
					bottom: verticalDirection === 'south' || !verticalDirection,
					top: verticalDirection === 'north' || !verticalDirection
				},
				respectDirection
			});
		}
	}
};
</script>

<template>
  <div
    ref="box"
    :class="classnames.default"
  >
    <slot />
    <div>
      <component
        :is="line.component"
        v-for="line in lineNodes"
        v-if="line.visible"
        :key="line.name"
        :classname="line.classname"
        :hover-classname="line.hoverClassname"
        :position="line.name"
        @drag="onHandlerDrag($event, line.horizontalDirection, line.verticalDirection)"
      />
    </div>
    <div>
      <component
        :is="handler.component"
        v-for="handler in handlerNodes"
        v-if="handler.visible"
        :key="handler.name"
        :classname="handler.classname"
        :hover-classname="handler.hoverClassname"
        :horizontal-position="handler.horizontalDirection"
        :vertical-position="handler.verticalDirection"
        @drag="onHandlerDrag($event, handler.horizontalDirection, handler.verticalDirection)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.vue-bounding-box {
  position: relative;
  &__line {
    position: absolute;
    &--north {
      top: 0;
      width: 100%;
      cursor: n-resize;
    }
    &--east {
      left: 100%;
      top: 0;
      height: 100%;
      cursor: e-resize;
    }
    &--south {
      top: 100%;
      width: 100%;
      cursor: s-resize;
    }
    &--west {
      left: 0;
      top: 0;
      height: 100%;
      cursor: w-resize;
    }
  }
  &__handler {
  }
}
</style>
