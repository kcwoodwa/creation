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
  height:auto;
  width:250px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 20px;
}

</style>
