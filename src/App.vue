<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div style="width:80%;margin:auto">

    <PlaySoundComponent></PlaySoundComponent>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PlaySoundComponent from './components/PlaySoundComponent.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    PlaySoundComponent
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
