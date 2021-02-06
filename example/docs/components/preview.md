# Preview

[[toc]]

## Methods

### `refresh()`

- **Usage:**

	This method refreshes the preview. This method is called on every window resize and can be
	useful if you don't set width and height explicitly and you need to inform the preview
	that its size should be recalculated.


## Props

### `image`

- **Type:** `Object`

- **Default:** `null`

- **Details:**
	
	The object with the data about cropped image. 
	
	This object has the following structure:
	```ts
	{
		src: string;
		width: number;
		height: number;
		transforms: {
			rotate: number;
			flip: {
				horizonal: boolean;
				vertical: boolean;
			};
		}
	}
	```
	
	Only the `src` field is required.
	
	It's recommended to use the image property from the cropper results object:
	```js
	const { image } = this.$refs.cropper.getResult()
	```
	
	```js
	// Inside `change` event callback
	onChange({ image }) {
		...
	}
	```
	
### `coordinates`

- **Type:** `Object`

- **Default:** `{}`

- **Details:**

	The actual coordinates of the cropped fragment

### `width`

- **Type:** `Number`


- **Details:**

	The width of the preview. It's the optional prop. If it is not set the preview will calculate the width of
	the root preview element by itself. 
	

### `height`

- **Type:** `Number`


- **Details:**

	The height of the preview. It's the optional prop. If it is not set the preview will calculate the height of
    the root preview element by itself. 
