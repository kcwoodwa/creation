<template>
  <div class="home">
    <img id="CreationLogo" alt="Creation" src="../../png/Creation Coffee Full Logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
#CreationLogo{
  height:100px;
  width:auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

</style>
