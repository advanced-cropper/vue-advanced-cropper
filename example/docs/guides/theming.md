---
title: Theming
---

# Theming

## Basics

Theme is the set of predefined styles for the following default components: `Cropper`, `CircleStencil`, `RectangleStencil`, `BoundingBox`, `SimpleHandler` and `SimpleLine`. 

They define global rules for such classes as `vue-advanced-cropper`, `vue-rectangle-stencil` and etc. 

When you import the styles, you lo
ad both service styles that required to correct displaying of components and the simplest default theme.
```js
import 'vue-advanced-cropper/dist/style.css';
```

It's the deliberate decision to reduce the count of operations needed to start work with this library. 
However, because this library uses the BEM methodology the defined styles can be easily redefined later (for example, 
by importing another theme later).

### Customizing a theme

If you use SCSS preprocessor you can easily customize the theme by redefining available variables and importing the scss theme file.

For example:
```scss
	$base-color: cornflowerblue;
	@import '~vue-advanced-cropper/dist/theme.classic.scss';
```

## Themes

### Default Theme

If you loaded styles as written earlier it will be enabled by default. This theme can be familiar to you by other examples in this documentation.

<theme-example theme="default"/>


### Compact Theme

The compact theme inspired by some of Android croppers. It's well suited
for mobile devices.
```js
import 'vue-advanced-cropper/dist/themes/theme.compact.css';
```
<theme-example theme="compact"/>

::: details  SCSS variables

| Name                  | Default Value              |
| --------------------- | -------------------------- |
| $base-color | white  |
| $grid | true  |
| $grid-color | $base-color  |
| $handler-color | $base-color  |
| $big-handler-color | $handler-color  |
| $small-handler-color | $handler-color  |
| $line-color | $base-color  |
| $big-handler-size | 16px  |
| $small-handler-size | 4px  |
| $big-handler-width | 2px  |
:::

### Classic Theme

It's the default theme with batteries included.
```js
import 'vue-advanced-cropper/dist/themes/theme.classic.css';
```
<theme-example theme="classic"/>

::: details  SCSS variables

| Name                  | Default Value              |
| --------------------- | -------------------------- |
| $base-color | white  |
| $grid | true  |
| $grid-color | $base-color  |
| $handler-color | $base-color  |
| $line-color | $base-color  |
| $handler-size | 8px  |
:::

### Bubble Theme

The bright and light theme. 
```js
import 'vue-advanced-cropper/dist/themes/theme.bubble.css';
```
<theme-example theme="bubble"/>

::: details  SCSS variables

| Name                  | Default Value              |
| --------------------- | -------------------------- |
| $base-color | white  |
| $grid | false  |
| $grid-color | $base-color  |
| $handler-color | $base-color  |
| $line-color | $base-color  |
| $handler-size | 14px  |
| $hover-handler-size | 25px  |
:::
