import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const { remote } = window.require('electron')

Vue.config.productionTip = false

import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from "pdf-lib";

Vue.prototype.$rootOfApp = path.join( remote.app.getAppPath(), '..');

//import csv from 'csv-parse/lib/sync'

var inventoryData = String(fs.readFileSync( Vue.prototype.$rootOfApp +'\\inventory.csv'));
var rows = inventoryData.split('\r\n');
var headers = rows[0].split(',');

var inventory = {};
for(let i =1 ; i < rows.length; i++){
  var rowData = rows[i].split(',')
  inventory[rowData[0]] = {};
 
  for(let j = 1; j < headers.length; j++)  
    inventory[rowData[0]][headers[j]] = rowData[j]
  
}


Vue.prototype.$inventory = inventory




import { spawn } from "child_process";
var embedFontAndMeasureText = async function (labelFileName) {


  const url =
    "https://raw.githubusercontent.com/mapzen/open/master/assets/fonts/Gotham-Light.ttf";
  const fontBytes = await fetch(url).then(res => res.arrayBuffer());

  var folder = ''
  if (labelFileName.includes('12oz') && labelFileName.includes('Whole'))
    folder = '12oz Whole'
  if (labelFileName.includes('12oz') && labelFileName.includes('Ground'))
    folder = '12oz Ground'
  if (labelFileName.includes('5lb') && labelFileName.includes('Whole'))
    folder = '5lb Whole'
  if (labelFileName.includes('12oz') && labelFileName.includes('Ground'))
    folder = '5lb Ground'


  const existingPdfBytes = fs.readFileSync(
    path.join(remote.app.getAppPath(), '..', folder, labelFileName + '.pdf')

  );

  // Load a PDFDocument from the existing PDF bytes

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);
  var page = pdfDoc.getPages()[0]


  var color = rgb(0, 0, 0);
  if (labelFileName.includes('Decaf') ||
    labelFileName.includes('Kiunyu') ||
    labelFileName.includes('Javacology House Blend') ||
    labelFileName.includes('Journeys Blend') ||
    labelFileName.includes('Perfect Dark') ||
    labelFileName.includes('Shinola Blend') ||
    labelFileName.includes('DDD Blend') ||
    labelFileName.includes('Creation Espresso 12oz') ||
    labelFileName.includes('Rummel Roast') ||
    labelFileName.includes('Santa Josefita') ||
    labelFileName.includes('Shinola House Blend') ||
    labelFileName.includes('Timberwolves Blend') ||
    labelFileName.includes('Upstream Blend'))
    color = rgb(1, 1, 1);

  if (labelFileName.includes('Iron Grind House Blend'))
    color = rgb(1, 0, 0);


  var text = "Roasted On:";
  if (labelFileName.includes('Best By')) text = 'Best By';

  const textSize = 8;
  const textWidth = customFont.widthOfTextAtSize(text, textSize)
  const textHeight = customFont.heightAtSize(textSize);

  var today = new Date();
  var dd = today.getDate()
  var mm = today.getMonth() + 1
  var yy = today.getFullYear()
  today = mm + '.' + dd + '.' + yy;

  if (labelFileName.includes('Best By')) {
    dd = dd > 30 ? 30 : dd;
    mm = (mm + 3) % 12;
    yy = (mm + 3) > 12 ? yy + 1 : yy;
  }


  today = String(mm) + '.' + String(dd) + '.' + String(yy).slice(2);

  var RoastedOnBrewByX;
  var RoastedOnBrewByY;
  var dateX;
  var dateY
  if (labelFileName.includes('12oz')) {
    RoastedOnBrewByX = 131;
    RoastedOnBrewByY = 166;
    dateX = 186;
    dateY = RoastedOnBrewByY;
  }
  if (labelFileName.includes('5lb')) {
    RoastedOnBrewByX = 198;
    RoastedOnBrewByY = 204.5;
    dateX = 259;
    dateY = RoastedOnBrewByY;
  }
  var textSize2;
  if(labelFileName.includes('Live Oak Blend 5lb')||
  labelFileName.includes('Paddock House Blend 5lb')||
  labelFileName.includes('Timberwolves Blend 5lb') ||
  labelFileName.includes('Reo Joe Custom')||
  labelFileName.includes('Blue Owl Cold Brew')
  ){
    RoastedOnBrewByX = 306;
    RoastedOnBrewByY = 165;
    dateX = RoastedOnBrewByX;
    dateY = 187.5;
    textSize2 = 28;
  }

  page.drawText(text, {
    x: RoastedOnBrewByX - textWidth / 2.0,
    y: (page.getSize()['height'] - RoastedOnBrewByY) - textHeight / 2.0,
    size: textSize,
    font: customFont,
    color: color
  });

  page.drawText(today, {
    x: dateX - textWidth / 2.0,
    y: (page.getSize()['height'] - dateY) - textHeight / 2.0,
    size: textSize2 === undefined ? textSize : textSize2,
    font: customFont,
    color: color
  });



  const pdfBytes = await pdfDoc.save();
  fs.writeFile("test.pdf", pdfBytes, () => { });


   var print = spawn(
      path.join(remote.app.getAppPath(), '..', 'PDFtoPrinter.exe'),
    ["test.pdf", "\\\\SHIPSTATIONPC\\Color Label 500 (Copy 1)"]
  ); 

  print.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  print.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
    //this.addTag(this.orderNumber, ERROR_PRINTING_TAG_ID);
  });

  print.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });
}



Vue.prototype.$print = embedFontAndMeasureText;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
