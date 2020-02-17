<template>
  <div id="app" style="display:flex; flex-direction:column" >
    <router-view />
  </div>
</template>

<style>
@font-face {
  font-family: gothamLight;
  src: url('https://raw.githubusercontent.com/mapzen/open/master/assets/fonts/Gotham-Book.ttf');
}



#app {
  font-family: gothamLight, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
  width:100%;
  height: 100%;
  position: relative;
   position: relative;
  display: flex;
  flex-direction: column;
  height: 5000px;
  width: 100%
  
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

div{
  flex-direction: column;
  display:flex;
  width: 100%;
  height: auto;
  position: relative;
}
</style>

<script>
import { remote } from "electron";
const { Tray, Menu } = remote;
import path from 'path';
var trayIcon = null;

import {bus} from "../src/main.js"
// Where you wanna call the child's method:


export default {
  name: 'App'
};














// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>
</script>
