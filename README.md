# Vue Advanced Cropper

> The advanced library to create your own croppers suited fow any website design

[![NPM](https://img.shields.io/npm/v/vue-advanced-cropper.svg)](https://www.npmjs.com/package/vue-advanced-cropper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Welcome to journey!

![](https://github.com/norserium/vue-advanced-cropper/blob/master/example/demo.gif?raw=true)

Try it yourself! Go to [demo website](https://norserium.github.io/vue-advanced-cropper/).

## Install

```bash
npm install --save vue-advanced-cropper
```

```bash
yarn add vue-advanced-cropper
```

## Usage

```jsx
import React, { Component } from 'react'

import ScrollContainer from 'vue-advanced-cropper'

class Example extends Component {
  render () {
    return (
      <ScrollContainer className="scroll-container">
        { ... }
      </ScrollContainer>
    )
  }
}
```

## Component properties

| Prop                   | Type             | Description                                                    | Default
| ---------------------- | ---------------- | -------------------------------------------------------------- | ---------------
| vertical               | Bool             | Allow vertical drag scrolling                                  | true
| horizontal             | Bool             | Allow horizontal drag scrolling                                | true
| hideScrollbars         | Bool             | Hide the scrollbals                                            | true
| activationDistance     | Number           | The distance that distinguish click and drag start             | 10
| children               | Node             | The content of scrolling container                             |
| onScroll               | Function         | Invoked when user scrolling container                          |
| onEndScroll            | Function         | Invoked when user ends scrolling container                     |
| onStartScroll          | Function         | Invoked when user starts scrolling container                   |
| className              | String           | The custom classname for container                             |        
| style                  | Number           | The custom styles for container                                |  

## License

The source code is licensed under MIT, all images (except [hieroglyphs](https://www.freepik.com/free-vector/ancient-egypt-hieroglyphics-background-with-flat-design_2754100.htm)) are copyrighted to their respective owner © [Norserium](https://github.com/norserium)
