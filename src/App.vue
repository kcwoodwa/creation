<template>
  <div id="app">
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
  
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>

import path from 'path';


export default {
  name: 'App'
};
const { remote } = require("electron");
const { Tray, Menu } = remote;






let trayIcon = new Tray(
  path.join(
    remote.app.getAppPath(),'..','png',
    "Creation Coffee Diamond Logo_White.png"
  )
);

const trayMenuTemplate = [
  {
    label: "Empty Application",
    enabled: false
  },

  {
    label: "Settings",
    click: function() {
      console.log("Clicked on settings");
    }
  },

  {
    label: "Help",
    click: function() {
      console.log("Clicked on Help");
    }
  }
];

let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);





// For example, `pdfBytes` can be:
//   • Written to a file in Node
//   • Downloaded from the browser
//   • Rendered in an <iframe>
</script>
