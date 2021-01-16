# Preview

[[toc]]

## Props


### `width`

- **Type:** `Number`


- **Details:**

	The width of the preview
	

### `height`

- **Type:** `Number`


- **Details:**

	The height of the preview


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
			translateX: number;
			translateY: number;
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
