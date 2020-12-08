---
title: Cropper Types
---



# Cropper Types

The croppers are different. The mission of this library is give the developer possibility to create
not only croppers with different appearance, but also with different behavior. 

Despite the variety of different croppers they can be classified on the three groups:
 - [Classic](/introduction/types.html#classic-cropper)
 - [Static](/introduction/types.html#static-cropper)
 - [Hybrid](/introduction/types.html#hybrid-cropper)
 
If you able to create all of them, you will able to create almost any of existing and even possible croppers.

 
## Classic Cropper

The classic cropper is the cropper, where the major way to choice an area is the resizing and moving the stencil. Depending on specific cropper
use may or may not resize and move image, but it's always the minor way. 

<types-classic-cropper img="https://images.pexels.com/photos/3761018/pexels-photo-3761018.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"></types-classic-cropper>


Examples: [Yandex](https://www.yandex.com).


### Basic Implementation

The most basic cropper configuration will give you the **classic** cropper, that is displayed above.
```html
<cropper :src="img" />
```

### Improving Techniques

#### The wide / tall images

If an user would crop the wide or tall image in the cropper with limited height or width it will be pretty uncomfortable to resize and move image.
 
<types-classic-cropper :small-height="true" img="https://images.pexels.com/photos/3760925/pexels-photo-3760925.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"></types-classic-cropper>

Due the backward compatibility `default-boundaries` is equal to `fit`. In the next major releases it will be probably changed to `fill`. 

Let's change it:
```html
<cropper :src="img" default-boundaries="fill" />
```

<types-classic-cropper :small-height="true" default-boundaries="fill" img="https://images.pexels.com/photos/3760925/pexels-photo-3760925.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"></types-classic-cropper>

Perhaps, it's the better result. There are no black borders, for example. But it's still has the obvious disadvantages. Due the equality of default image restriction to `fill-area`, the image
tries to fill the entire boundaries, but the boundaries is equal to entire cropper now, so user can't reduce the image now.

Let's set `image-restriction` to `fit-area` also to give an user experience similar to common modern image viewers.

```html
<cropper :src="img" default-boundaries="fill" image-restriction="fit-area" />
```

<types-classic-cropper :small-height="true" default-boundaries="fill"  image-restriction="fit-area" img="https://images.pexels.com/photos/3760925/pexels-photo-3760925.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"></types-classic-cropper>


#### Adjusting Stencil

::: warning Notice!
It's the part of the experimental API. It may be changed in the future.
:::

The stencil size doesn't change when you manipulate image by default. It might cause some discomfort to user in
a special situations like the situation in the example below. Try to reduce image size. You can't do it, because
to reduce image size the stencil size should be reduced as well.

 
<types-classic-cropper :default-size="{width: 950, height: 600}" :default-visible-area="{width:1100, height:448, left:-58, top:300}" :small-height="true" default-boundaries="fill"  image-restriction="fit-area" img="https://images.pexels.com/photos/3760853/pexels-photo-3760853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"></types-classic-cropper>

To fix it there is `adjustStencil` option in `resizeImage` prop. Let's add it to the previous example.
```html
<cropper 
	:src="img" 
    default-boundaries="fill" 
    image-restriction="fit-area"
    :resize-image="{
        adjustStencil: true
    }"
 />
```
<types-classic-cropper :resize-image="{adjustStencil: true}" :default-size="{width: 950, height: 600}" :default-visible-area="{width:1100, height:448, left:-58, top:300}" :small-height="true" default-boundaries="fill"  image-restriction="fit-area" img="https://images.pexels.com/photos/3760853/pexels-photo-3760853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"></types-classic-cropper>

Try to resize the image in this example. It's much more comfortable. This option is also very useful when you have
width and height limitations.

### Recommended Implementation

Thus, taking into account the written above the recommended implementation of **classic cropper** type is following:
```html
<cropper 
	:src="img" 
    default-boundaries="fill" 
    image-restriction="fit-area"
    :resize-image="{
        adjustStencil: true
    }"
 />
```

## Static Cropper

The static cropper has the static stencil. It doesn't have handlers, it can't be moved or resized. An user can only change the image size and position.

<types-static-cropper ></types-static-cropper>

Examples: [Twitter](https://www.twitter.com), [Instagram](https://www.instagram.com).

### Basic Implementation

To implement the static cropper above you should:

- set `image-restriction` to `stencil` (to give an user the possibility to move the image to the edge of the fixed stencil)
- disable the stencil adjusting to prevent the changing of stencil size during the image resize
- hide the handlers, disable move and scale for the stencil or use a custom one
- set the aspect ratio, because you can't change aspect ratio in the static cropper and you shouldn't rely on a random one

```html
<cropper 
	:src="img"
	:stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
		aspectRatio: 1,
	}"
	:resize-image="{
		adjustStencil: false
	}"
	image-restriction="stencil"
/>
```


### Improving Techniques

#### The wide/tall image

It's recommended to set `default-boundaries` to `fill` also, otherwise the large images uploaded to limited cropper will behave a pretty strange to user. 
It will be the default value later, but due the backward compatibility it's still equals to `fit` by default.

<types-static-cropper :small-height="true" img="https://images.unsplash.com/photo-1583172332547-c768b4e2f5ff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80"></types-static-cropper>


The result code that we will get in this case is pretty similar:
```html
<cropper 
	:src="img"
	:stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
		aspectRatio: 1,
	}"
	:resize-image="{
		adjustStencil: false
	}"
	default-boundaries="fill"
	image-restriction="stencil"
/>
```
<types-static-cropper default-boundaries="fill" :small-height="true" img="https://images.unsplash.com/photo-1583172332547-c768b4e2f5ff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80"></types-static-cropper>


#### The fixed stencil size

The stencil size in the croppers above is pretty unpredictable. For the used image above it's already too small.
You can imagine what the stencil size you would get for a narrower image. So the fixed croppers have fixed stencil size alike. 

The most simpler way to set fixed stencil size is using [`stencil-size`](http://localhost:8080/vue-advanced-cropper/components/cropper.html#stencilsize) prop.

Notice, that in the following example:
 - `aspectRatio` is not set explicitly because it's calculated from `stencil-size`, 
 - `adjustStencil` option is absented too because it's always disabled if you use `stencil-size` prop.


```html
<cropper 
	:src="img"
	:stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
	}"
	:stencil-size="{
		width: 280,
		height: 280
	}"
	default-boundaries="fill"
	image-restriction="stencil"
/>
```


<types-static-cropper 
	:stencil-size="{ width: 250, height: 250}"
	:small-height="true" 
	default-boundaries="fill"
	img="https://images.unsplash.com/photo-1583172332547-c768b4e2f5ff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80"
></types-static-cropper>


### Recommended Implementation


Thus, taking into account the written above the recommended implementation of **fixed cropper** type is following:
```html
<cropper 
	:src="img"
	:stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
	}"
	:stencil-size="{
		width: 280,
		height: 280
	}"
	image-restriction="stencil"
	default-boundaries="fill"
 />
```

## Hybrid Cropper

The hybrid cropper is the cropper that has semi-static stencil, i.e. user able to
change its size and position, but it always tries to return to some default position and return some default size.

This process of returning to some default constraints is called **auto zoom**.

Examples: [Telegram](https://www.telegram.org).

### Implementation

To implement the hybrid cropper we will use the fragments of recommended implementations and just add `autoZoom`
prop to them.

#### Classic Hybrid

The **classic hybrid** is the cropper type, that is very similar to the **classic cropper**, but its stencil is
automatically resized and moved. It makes it more closer to static cropper, because its stencil tries to be static.
```html
<cropper 
	:src="img"
	:auto-zoom="true"
	:transitions="true"
	:resize-image="{
		adjustStencil: true
	}"
	image-restriction="fit-area"
    default-boundaries="fill"
 />
```

Note, that `transitions` prop is added. It is needed to make auto zoom smoother, but it's the part of experimental API, so use it careful.

<types-hybrid-cropper 
	src="https://images.unsplash.com/photo-1583853287541-6e82b3d5ea12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
	default-boundaries="fill"
	image-restriction="fit-area"
	:resize-image="{
		adjustStencil: true
	}"
	:transitions="true"
	:auto-zoom="true"
></types-hybrid-cropper>

#### Fixed Hybrid

The **fixed hybrid** is the cropper type, that is very similar to the **fixed cropper**, but user is able to change
the size and position of cropper.
```html
<cropper 
	:src="img"
	:auto-zoom="true"
	:transitions="true"
	:stencil-size="{
		width: 280,
		height: 280
	}"
	image-restriction="stencil"
	default-boundaries="fill"
 />
```

<types-hybrid-cropper 
	src="https://images.unsplash.com/photo-1588805309715-0a5f66e9e8aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80"
	:auto-zoom="true"
	:transitions="true"
	:stencil-size="{
		width: 280,
		height: 280
	}"
	image-restriction="stencil"
	default-boundaries="fill"
></types-hybrid-cropper>




