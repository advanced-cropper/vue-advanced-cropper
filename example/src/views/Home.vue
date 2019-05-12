<template>
  <div class="home">
    <div class="presentation">
      <div class="container container--centered">
        <img class="presentation__logo" src="../assets/home/logo.svg" alt="">
        <div class="presentation__title-wrapper">
          <h1 class="presentation__title">
            Advanced Cropper
            <div class="presentation__version">
              1.1
            </div>
          </h1>
        </div>
        <div class="presentation__subtitle">
          The really flexible cropper that gives you opportunity to create almost any cropper that you desire
        </div>
        <div class="presentation__buttons">
          <a class="presentation__button" href="http://github.com/Norserium/vue-advanced-cropper/">
            <home-button
              :icon="require('../assets/home/github.svg')"
              text="Github"
              caption="Sources / Development"
              action
            />
          </a>
          <a class="presentation__button" href="">
            <home-button
              :icon="require('../assets/home/npm.svg')"
              text="NPM"
              caption="Library / Publishing"
            />
          </a>

        </div>
      </div>
      <div class="presentation__border">
        <img  src="../assets/home/presentation-bottom-border.svg" alt="">
      </div>
    </div>

    <div class="demo-section">
      <div class="container container--centered">
        <Cropper 
          :src="require('../assets/test.jpeg')"
          classname="demo-cropper"
          image-classname="demo-cropper__image"
          :min-width="20"
          :min-height="20"
          :stencil-props="{
            maxAspectRatio: 16/9,
            minAspectRatio: 9/16,
            linesClassnames: {
              default: 'demo-cropper__line',
              hover: 'demo-cropper__line--hover',
            },
            handlersClassnames: {
              default: 'demo-cropper__handler',
              hover: 'demo-cropper__handler--hover',
            } 
          }"
          @change="change"
        />
      </div>
      <div class="section-border section-border--hide-mobile">
        <img  src="../assets/home/gray-bottom-border.svg" alt="">
      </div>
    </div>

    <div class="feature-section">
      <div class="container container--narrow">
        <h1 class="title">
          Features
        </h1>
        <div class="row">
          <div class="feature">
            <div class="feature__title">
              Fully customisable
            </div>
            <div class="feature__text">
              On the one hand you able to customize almost every aspect of cropper, but on other you can use it from a box right now
            </div>
          </div>
          <div class="feature">
            <div class="feature__title">
              Mobile support
            </div>
            <div class="feature__text">
              Cropper is created to support mobile devices just like desktop one, and supports touch events, cropper resizing and etc.
            </div>
          </div>
        </div>
        <div class="row">
          <div class="feature">
            <div class="feature__title">
              Canvas and coordinates
            </div>
            <div class="feature__text">
              Cropper can be used to get canvas with cropped area or just coordinates relative to original image to crop it at your server lately
            </div>
          </div>
          <div class="feature">
            <div class="feature__title">
              Advanced features
            </div>
            <div class="feature__text">
              Set minimum and maximum aspect ratios, customizie minimum and maximum height and width (in percents of area) and etc.
            </div>
          </div>
        </div>
      </div>
      <div class="section-border">
        <img  src="../assets/home/white-bottom-border.svg" alt="">
      </div>

    </div>

    <div class="concept-section">
      <div class="container container--narrow">
        <h1 class="title">
          Concept
        </h1>
        <div class="row">
          <p>
            The goal of this library to give a developer opportunity create any cropper 
            easily and effortless. To achieve it the croper is divided to two parts: 
            broadly customizable <b>cropper</b> and arbitrary component <b>stencil</b>.
          </p>
        </div>
        
        <h2 class="subtitle">
          What is cropper?
        </h2>

        <div class="row">
          <div class="col">
             <div class="example-cropper">
              <img :src="require('../assets/home/example-cropper.svg')"/>
             </div>
          </div>
          <div class="col">
            <p>
              <b>Cropper</b> is the root component of this library. It contains coordinates of current cropped area (left, top, width, height) relative to original image coordinates. This coordinates can be imagined like <b>box</b>.
            </p>
            <p>
              It responsible for:
            </p>
            <ul>
              <li> resizing and moving box </li>
              <li> displaying the cropping image and fitting it to container </li>
              <li> setting default coordinates </li>
              <li> cropping canvas area </li>
            </ul>
          </div>
        </div>
       
        <h2 class="subtitle">
          What is stencil?
        </h2>

        <div class="row">
          <p>
            Cropper operates the abstract box that represents current cropped area. 
            But it just abstract couple of coordinates, to visualize the cropped area and 
            give the possibility to interact with cropper there is a <b>stencil</b> component.
          </p>
        </div>

        <div class="shift"></div>

        <div class="row">
          <div class="col">
            <div class="example-stencil">
              <img :src="require('../assets/home/example-stencil.svg')"/>
            </div>
          </div>
          <div class="col">
            <p>
              Stencil can be literally any arbitrary component, but to make sense there are some requirements to it:
            </p>
            <ul>
              <li> it should be inscibed to box is represented by coordinates (<b>width</b>, <b>height</b>, <b>left</b>, <b>top</b>) </li>
              <li> if stencil has aspect ratios it should has <b>aspectRatios</b> method to inform the cropper resize algorithm about it (this method should return object with minimum and maximum aspect ratio values) </li>
              <li> it should emit <b>resize</b> and <b>move</b> events </li>
              <li> it should display the cropped part of a image </li>
            </ul>
          </div>
        </div>

        <div class="row">
          <p>
            Resize and move events are very flexible and allow you to create almost any moving and especially resizng logic (read <a class="link">here</a> detaily)
          </p>
        </div>


        <div class="row">
          <div class="col">
            <div class="example-event">
              <img :src="require('../assets/home/resize-event.svg')"/>
            </div>
          </div>
          <div class="col">
            <div class="example-event">
              <img :src="require('../assets/home/move-event.svg')"/>
            </div>
          </div>
        </div>

        <div class="row">
          <p>
            The typical stencil components are represented below. They includes handlers that emit resize events, movable area that emits move event and cropped image preview
          </p>
        </div>

        <div class="row">
          <div class="example-stencil-elements">
            <img :src="require('../assets/home/example-stencil-elements.svg')"/>
          </div>
        </div>

        <div class="row">
          <p>
            There are default customizable components from a box that allow you to create your first cropper in five minutes.
          </p>
        </div>

        <pre class="source-code"><code class="language-js">{{stencilExample}}</code></pre>

        <div class="row">
          <p>
            That’s almost all (you can find detailed tutorials <a class="link">here</a>). There are different stencils below as examples of different stencils that you can create
          </p>
        </div>


      </div>
    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import HomeButton from "@/components/HomeButton.vue";
import Cropper from "vue-advanced-cropper";

export default {
  name: "home",
  components: {
    HelloWorld,
    HomeButton,
    Cropper,
  },
  methods: {
    change(coordinates) {
      //console.log("CHANGE!", coordinates)
    }
  },
  data() {
    return {
      stencilExample:
`\<script\>
import {
  PreviewImage, 
  BoundingBox, 
  MoveableArea
} from 'vue-advanced-cropper/service';

export default {
  name: "MyStencil",
  components: {
    PreviewImage, BoundingBox, MoveableArea
  },
  props: [
    // Image src
    'img',
    // Coordinates of box relative to original image size
    'height', 'width', 'left', 'top',
    // Stencil size desired by cropper 
    'stencilHeight', 'stencilWidth',
    // Aspect ratios
    'aspectRatio', 'minAspectRatio', 'maxAspectRatio',
  ],
  methods: {
    onMove(moveEvent) {
      this.$emit('move', moveEvent)
    },
    onResize(resizeEvent) {
      this.$emit('resize', resizeEvent)
    },
    aspectRatios() {
      return {
          minimum: this.aspectRatio || this.minAspectRatio,
          maximum: this.aspectRatio || this.maxAspectRatio,
        }
    }
  },
};
\<\/script\>

<template>
  <div class="my-stencil">
    <BoundingBox @resize="onResize">
      <MoveableArea @move="onMove">
        <PreviewImage 
          :img="img"
          :previewWidth="stencilWidth" 
          :previewHeight="stencilHeight"
          :width="width"
          :height="height"
          :left="left"
          :top="top"
        />
      </MoveableArea>
    </BoundingBox>    
  </div>
</template>`
    }
  }
};
</script>

<style lang="scss">
@import "../styles/constants";
@import "../styles/grid";

.home {
  .presentation {
    background: url("../assets/home/background.png");
    background-size: auto 100%;
    background-color: $vue-color;
    background-size: cover;
    padding-top: 104px;
    color: white;
    position: relative;

    &:before {
      content: "";
      height: 100px;
      width: 100%;
      background: linear-gradient(
        180deg,
        rgba(54, 170, 118, 0) 0%,
        rgba(54, 170, 118, 1) 100%
      );
      bottom: 0;
      position: absolute;
    }
  

    &__title {
      font-size: 44px;
      font-family: ArBerkley;
      position: relative;
      display: inline-block;
      margin-bottom: 27px;
      margin-top: 10px;
      font-weight: normal;
    }
    &__version {
      position: absolute;
      font-family: Open Sans;
      font-size: 10px;
      right: 22px;
      bottom: -2px;
    }
    &__subtitle {
      max-width: 467px;
      font-weight: lighter;
      font-size: 18px;
      line-height: 32px;
    }
    &__buttons {
      width: 412px;
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      margin-bottom: 50px;
      @media (max-width: $screen-xs) {
        width: 100%;        
        display: block;
        padding-left: 30px;
        padding-right: 30px;
      }
    }
    &__button {
      width: 100%;
      text-decoration: none;
      margin-bottom: 20px;
      display: inline-block;
      &:not(:last-child) {
        margin-right: 25px;
      }
      @media (max-width: $screen-xs) {
        margin-right: 0;
      }
    }
    &__border {
      overflow: hidden;
      width: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      height: 94px;
      z-index: 1;
      display: flex;
      justify-content: center;
      transition: transform 0.5s;
      transform-origin: center top;
      @media (max-width: $screen-xs) {
        transform: translate(-50%) scaleY(0);
      }
    }
  }

  .demo-section {
    position: relative;
    background: url("../assets/home/demo-background.png");
    background-size: auto 100%;
    background-color: #0d0d0d;
    width: 100%;
    padding-top: 125px;
    padding-bottom: 125px;
    transition: padding 0.5s, border 0.5s;
    //border-top: solid 5px transparent;
    //border-bottom: solid 5px transparent;
    @media (max-width: $screen-xs) {
      transition: padding 0.5s, border 0.5s 0.1s;
      padding-top: 5%;
      padding-bottom: 5%;
      //border-top: solid 5px #2A9264;
      //border-bottom: solid 5px #F2F2F2;
    }
  }

  .demo-cropper {
    width: 100%;
    max-height: 400px;
    &__line {
      border-style: dashed;
      border-color: $vue-color;
      &--hover {
        border-color: #36cc89;
      }
    }
    &__handler {
      background: #36cc89;
      border: solid 1px $vue-color;
    }
  }

  .section-border {
    overflow: hidden;
    width: 100%;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -100%);
    height: 51px;
    z-index: 1;
    display: flex;
    justify-content: center;
    transform-origin: center top;
    transition: transform 0.5s;
    &--hide-mobile {
      @media (max-width: $screen-xs) {
        transform: translateX(-50%) scaleY(0);
      }
    }
  }

  .feature-section {
    background: #f9f9f9;
    text-align: center;
    position: relative;
    padding-bottom: 50px;
  }

  .concept-section {
    text-align: center;
  }

  .row {
    display: flex;
    text-align: left;
    flex-wrap: wrap;
  }

  .col {
    width: 50%;
    &:not(:first-child) {
      padding-left: 25px;
    }
    &:not(:last-child) {
      padding-right: 25px;
    }

    @media (max-width: $screen-sm) {
      width: 100%;
      & + .col {
        margin-top: 30px;
      }
      &, &:not(:first-child), &:not(:last-child) {
        padding: 0px;
      }
    }
  }

  .example-cropper {
    margin-top: -15px;
    text-align: center;
  }

  .example-stencil {
    margin-top: -15px;
    text-align: center;
  }

  .example-event {
    text-align: center;
  }

  .example-stencil-elements {
    text-align: center;
    width: 100%;
    img {
      max-width: 100%;
    }
  }

  .link {
    color: $vue-color;
    text-decoration: underline;
    cursor: pointer;
  }

  p {
    line-height: 32px;
    font-weight: lighter;
  }
  p + ul {
    margin-top: -1em;
  }

  ul {
    padding-left: 15px;
    line-height: 32px;
    font-weight: lighter;
    li {

      list-style: none;
      position: relative;
      &:before {
        content: "–";
        position: absolute;
        left: -15px;
      }
    }
  }

  .container {
    @include container();
    height: 100%;
    &--narrow {
      max-width: 780px;
      margin: 0 auto;
    }
    &--centered {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      position: relative;
    }
  }


  .feature {
    font-weight: lighter;
    text-align: left;
    width: 50%;
    padding-left: 37px;
    padding-right: 37px;
    margin-top: 35px;
    margin-bottom: 35px;
    &:last-child {
      padding-right: 0;
    }
    &:first-child {
      padding-left: 0;
    }
    &__title {
      font-size: 30px;
      line-height: 32px;
      margin-bottom: 15px;
    }
    &__text {
      font-size: 16px;
      line-height: 32px;
    }
    @media (max-width: $screen-sm) {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
      margin-bottom: 50px;
      text-align: center;
    }
  }

  .shift {
    margin-top: 20px;
  }
  
  .title {
    font-size: 45px;
    font-family: ArBerkley;
    color: $gray-color;
    position: relative;
    display: inline-block;
    margin-bottom: 40px;
    margin-top: 40px;
    font-weight: normal;

    &:after {
      content: "";
      position: absolute;
      width: calc(100% + 20px);
      bottom: -15px;
      background: $vue-color;
      left: 50%;
      height: 2px;
      transform: translateX(-50%);
      font-family: normal;
    }
  }

  .subtitle {
    font-size: 30px;
    color: #8f8f8f;
    font-weight: 600;
  }
}

</style>

