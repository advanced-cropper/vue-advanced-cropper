<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { isEmpty, replacedProp } from '../../core';
import { directionNames } from '../../core/utils';
import { ResizeEvent } from '../../core/events';
import { SimpleHandler } from '../handlers';
import { SimpleLine } from '../lines';

const cn = bem('vue-bounding-box');

const HORIZONTAL_DIRECTIONS = ['east', 'west', null];
const VERTICAL_DIRECTIONS = ['south', 'north', null];

export default {
	name: 'BoundingBox',
	props: {
		width: {
			type: Number,
		},
		height: {
			type: Number,
		},
		transitions: {
			type: Object,
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
					east: true,
				};
			},
		},
		handlersComponent: {
			type: [Object, String],
			default() {
				return SimpleHandler;
			},
		},
		handlersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		handlersWrappersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		lines: {
			type: Object,
			default() {
				return {
					west: true,
					north: true,
					east: true,
					south: true,
				};
			},
		},
		linesComponent: {
			type: [Object, String],
			default() {
				return SimpleLine;
			},
		},
		linesClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		linesWrappersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		resizable: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		const points = [];
		HORIZONTAL_DIRECTIONS.forEach((hDirection) => {
			VERTICAL_DIRECTIONS.forEach((vDirection) => {
				if (hDirection !== vDirection) {
					let { name, classname } = directionNames(hDirection, vDirection);
					points.push({
						name,
						classname,
						verticalDirection: vDirection,
						horizontalDirection: hDirection,
					});
				}
			});
		});
		return {
			points,
		};
	},
	computed: {
		style() {
			const result = {};
			if (this.width && this.height) {
				result.width = `${this.width}px`;
				result.height = `${this.height}px`;

				if (this.transitions && this.transitions.enabled) {
					result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
				}
			}
			return result;
		},
		classes() {
			const handlers = this.handlersClasses;
			const handlersWrappers = this.handlersWrappersClasses;
			const lines = this.linesClasses;
			const linesWrappers = this.linesWrappersClasses;

			return {
				root: cn(),
				handlers,
				handlersWrappers,
				lines,
				linesWrappers,
			};
		},
		lineNodes() {
			const lines = [];
			this.points.forEach((point) => {
				if ((!point.horizontalDirection || !point.verticalDirection) && this.lines[point.name]) {
					lines.push({
						name: point.name,
						component: this.linesComponent,
						class: classnames(
							this.classes.lines.default,
							this.classes.lines[point.name],
							!this.resizable && this.classes.lines.disabled,
						),
						wrapperClass: classnames(
							this.classes.linesWrappers.default,
							this.classes.linesWrappers[point.name],
							!this.resizable && this.classes.linesWrappers.disabled,
						),
						hoverClass: this.classes.lines.hover,
						verticalDirection: point.verticalDirection,
						horizontalDirection: point.horizontalDirection,
						disabled: !this.resizable,
					});
				}
			});
			return lines;
		},
		handlerNodes() {
			const handlers = [];
			const { width, height } = this;
			this.points.forEach((point) => {
				if (this.handlers[point.name]) {
					const result = {
						name: point.name,
						component: this.handlersComponent,
						class: classnames(this.classes.handlers.default, this.classes.handlers[point.name]),
						wrapperClass: classnames(
							this.classes.handlersWrappers.default,
							this.classes.handlersWrappers[point.name],
						),
						hoverClass: this.classes.handlers.hover,
						verticalDirection: point.verticalDirection,
						horizontalDirection: point.horizontalDirection,
						disabled: !this.resizable,
					};
					if (width && height) {
						const { horizontalDirection, verticalDirection } = point;
						const left =
							horizontalDirection === 'east' ? width : horizontalDirection === 'west' ? 0 : width / 2;
						const top =
							verticalDirection === 'south' ? height : verticalDirection === 'north' ? 0 : height / 2;
						result.wrapperClass = cn('handler');
						result.wrapperStyle = {
							transform: `translate(${left}px, ${top}px)`,
						};

						if (this.transitions && this.transitions.enabled) {
							result.wrapperStyle.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
						}
					} else {
						result.wrapperClass = cn('handler', { [point.classname]: true });
					}
					handlers.push(result);
				}
			});
			return handlers;
		},
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
	},
	methods: {
		onEnd() {
			this.$emit('resize-end');
		},
		onHandlerDrag(dragEvent, horizontalDirection, verticalDirection) {
			const { left, top } = dragEvent.shift();

			const directions = {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
			};

			if (horizontalDirection === 'west') {
				directions.left -= left;
			} else if (horizontalDirection === 'east') {
				directions.right += left;
			}
			if (verticalDirection === 'north') {
				directions.top -= top;
			} else if (verticalDirection === 'south') {
				directions.bottom += top;
			}

			let respectDirection;
			if (!verticalDirection && horizontalDirection) {
				respectDirection = 'width';
			} else if (verticalDirection && !horizontalDirection) {
				respectDirection = 'height';
			}

			if (this.resizable) {
				this.$emit(
					'resize',
					new ResizeEvent(directions, {
						allowedDirections: {
							left: horizontalDirection === 'west' || !horizontalDirection,
							right: horizontalDirection === 'east' || !horizontalDirection,
							bottom: verticalDirection === 'south' || !verticalDirection,
							top: verticalDirection === 'north' || !verticalDirection,
						},
						preserveAspectRatio: dragEvent.nativeEvent && dragEvent.nativeEvent.shiftKey,
						respectDirection,
					}),
				);
			}
		},
	},
};
</script>

<template>
	<div ref="box" :class="classes.root" :style="style">
		<slot />
		<div>
			<component
				:is="line.component"
				v-for="line in lineNodes"
				:key="line.name"
				:default-class="line.class"
				:hover-class="line.hoverClass"
				:wrapper-class="line.wrapperClass"
				:position="line.name"
				:disabled="line.disabled"
				@drag="onHandlerDrag($event, line.horizontalDirection, line.verticalDirection)"
				@drag-end="onEnd()"
			/>
		</div>
		<div
			v-for="handler in handlerNodes"
			:key="handler.name"
			:style="handler.wrapperStyle"
			:class="handler.wrapperClass"
		>
			<component
				:is="handler.component"
				:default-class="handler.class"
				:hover-class="handler.hoverClass"
				:wrapper-class="handler.wrapperClass"
				:horizontal-position="handler.horizontalDirection"
				:vertical-position="handler.verticalDirection"
				:disabled="handler.disabled"
				@drag="onHandlerDrag($event, handler.horizontalDirection, handler.verticalDirection)"
				@drag-end="onEnd()"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.vue-bounding-box {
	position: relative;
	height: 100%;
	width: 100%;
	&__handler {
		position: absolute;
		&--west-north {
			left: 0;
			top: 0;
		}
		&--north {
			left: 50%;
			top: 0;
		}
		&--east-north {
			left: 100%;
			top: 0;
		}
		&--east {
			left: 100%;
			top: 50%;
		}
		&--east-south {
			left: 100%;
			top: 100%;
		}
		&--south {
			left: 50%;
			top: 100%;
		}
		&--west-south {
			left: 0;
			top: 100%;
		}
		&--west {
			left: 0;
			top: 50%;
		}
	}
}
</style>
