<template>
  <ElementLayout>
    <template #element>
      <div class="tristate-radio-group" :id="name + '-tristate-wrapper'">        
        <label :for="name + '-yes'" class="yes-lbl">Y</label>
        <input type="radio" value="yes" :name="name" :id="name + '-yes'" title="Yes" @change="onValueChange">
        <label :for="name + '-unset'" class="unset-lbl">-</label>
        <input type="radio" value="unset" :name="name" :id="name + '-unset'" title="Not answered yet" @change="onValueChange">
        <label :for="name + '-no'" class="no-lbl">N</label>
        <input type="radio" value="no" :name="name" :id="name + '-no'" title="No" @change="onValueChange">        
        <div class="toggle"></div>
      </div>
    </template>    
  </ElementLayout>  
</template>

<script>

import { defineElement } from '@vueform/vueform'

export default defineElement ({
  name: 'TriStateInputElement',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      wrapperDiv: null,
      value: 'unset'
    }
  },
  methods: {
    onValueChange(evt) {
      console.group('onValueChange()')
      console.debug('Tristate radio change event', evt)
      this.value = evt.target.value
      this.wrapperDiv.querySelectorAll('label').forEach(lbl => {
        lbl.classList.toggle('active', lbl.className.includes(this.value))
      })
      console.groupEnd()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperDiv = document.querySelector(`#${this.name}-tristate-wrapper`)
    })    
  }
})

</script>

<style lang="scss" scoped>

@import "../assets/scss/variables.scss";

/* Modified version of https://codepen.io/Davide_sd/pen/XWGOxZ */
/* height */
$h: 2rem;
/* width */
$w: $h * 3;
/* toggle dimensions */
$tw: 0.8 * $h;
/* font size */
$fs: 0.9rem;
/* toggle's border thickness */
$bt: 0.1rem;
/* toggle box shadow */
$bs: $bt * 2;
/* labels animation time */
$ta: 6s;
/* label text colour */
$text-color: $dark;
/* active label text colour */
$active-text-color: white;
/* switch area colours */
$colors: $primary, #adb5bd, $primary;

@mixin borderColor($i) {
  background: nth($colors, $i);
}

@mixin animationDelay($time) {
  -webkit-animation-delay: $time;
  -o-animation-delay: $time;
  -moz-animation-delay: $time;
  animation-delay: $time;
}

@mixin animation($time) {
  -webkit-animation: $time rot-label ease-in-out infinite;
  -moz-animation: $time rot-label ease-in-out infinite;
  -o-animation: $time rot-label ease-in-out infinite;
  animation: $time rot-label ease-in-out infinite;
}

.tristate-radio-group {
  width: $w;
  height: $h;
  position: relative;
  border-radius: calc($h/2);
  background: $light;
  margin-top: 0.5rem;

  & .toggle {
    width: $tw;
    height: $tw;
    position: absolute;
    left: calc($w / 3 - ($tw - $h) / 2);
    top: calc(($h - $tw) / 2);
    border-radius: 50%;
    box-sizing: border-box;
    @include borderColor(2);
    transition:
      all .3s cubic-bezier(
        0.175, 0.885, 0.320, 1.275
      );
  }

  & label {
    cursor: pointer;
    width: $h;
    height: $h;
    position: absolute;
    margin: 0;
    padding: 0;
    z-index: 1;
    display: inline-block;  
    
    text-align: center;
    line-height: $h;
    text-transform: uppercase;
    font-size: $fs;
    color: $text-color;
    @include animation($ta);
  }

  & label.active {
    color: $active-text-color;
  }
  
  & input {
    position: absolute;
    left: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
  }
}

input[type="radio"][value="yes"]:checked {
  background: $success;  
  ~ .toggle {
    @include borderColor(1);
    left: calc(($h - $tw) / 2);
  }
}

input[type="radio"][value="no"]:checked {
  background: $danger;  
  ~ .toggle {
    @include borderColor(3);
    left: calc($w * 2 / 3 - ($tw - $h) / 2);
  }
}

input[type="radio"][value="unset"], .unset-lbl {
  left: 33%;
}

input[type="radio"][value="no"], .no-lbl {
  left: 66%;
}

.unset-lbl {
  @include animationDelay(calc($ta / 3));
}

.no-lbl {
  @include animationDelay(calc($ta * 2 / 3));
}

</style>