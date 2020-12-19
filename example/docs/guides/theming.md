---
title: Theming
---

# Theming

::: danger Not Released
This feature is not released. It's the concept of the changes, that may be implemented in future releases. Currently styles are loaded by script,
but this behavior will be changed in the future and styles should be imported separately.

This page is the sandbox for me to invent some themes for the future
:::

## Basics

Theme is the set of predefined styles for the following default components: `Cropper`, `CircleStencil`, `RectangleStencil`, `BoundingBox`, `SimpleHandler` and `SimpleLine`. 

They define global rules for such classes as `vue-advanced-cropper`, `vue-rectangle-stencil` and etc. 

When you import the styles, you load both service styles that required to correct displaying of components and the simplest default theme.
```js
import 'vue-advanced-cropper/style.css';
```

It's the deliberate decision to reduce the count of operations needed to start work with this library. 
However, because this library uses the BEM methodology the defined styles can be easily redefined later (for example, 
by importing another theme later).

## Themes

### Default Theme

If you loaded styles as written earlier it will be enabled by default. This theme can be familiar to you by other examples in this documentation.

<theme-example theme="default"/>



### Engineer

The strict and classic theme
```js
import 'vue-advanced-cropper/theme.engineer.css';
```
<theme-example theme="engineer"/>

### Classic

The simple classic theme
```js
import 'vue-advanced-cropper/theme.classic.css';
```
<theme-example theme="classic"/>

### Compact

The simple classic theme
```js
import 'vue-advanced-cropper/theme.compact.css';
```
<theme-example theme="compact"/>

### Bubble

The bright and light theme. 
```js
import 'vue-advanced-cropper/theme.bubble.css';
```
<theme-example theme="bubble"/>

### Noire

The noire, shaded theme.
```js
import 'vue-advanced-cropper/theme.noire.css';
```
<theme-example theme="noire"/>
