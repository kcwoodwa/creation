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

export default {
  name: 'App',
  data(){
    return {
      

    }
  },
  created(){
    trayIcon = new Tray(
    path.join(
      remote.app.getAppPath(),'..','png',
      "Creation Coffee Diamond Logo_White.png"
    )
);

var self = this;
const trayMenuTemplate = [

  {
    label: "Show Hidden Items",
    type: "checkbox",
    click: function() {
      self.$store.commit('unhide')
    }
  },

  {
    label: "Exit",
    click: function() {
      remote.app.isQuiting = true;
      remote.app.quit()
    }
  }
];

let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);


  }
};














// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>
</script>
