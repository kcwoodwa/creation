import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.prototype.$eventHub = new Vue();

var count = 0;
const { remote } = window.require('electron')

Vue.config.productionTip = false

import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from "pdf-lib";

import PromiseQueue from 'easy-promise-queue';



Vue.prototype.$rootOfApp = path.join(remote.app.getAppPath(), '..');
Vue.prototype.$showHidden = false;
Vue.prototype.$queue = new PromiseQueue({concurrency: 1});

var url ;
	var fontBytes;

const request = async () => {
    url = "https://raw.githubusercontent.com/mapzen/open/master/assets/fonts/Gotham-Light.ttf";
	fontBytes = await fetch(url).then(res => res.arrayBuffer());
}

request();



/* 
var inventoryData = String(fs.readFileSync(Vue.prototype.$rootOfApp + '\\inventory.csv'));
var rows = inventoryData.split('\r\n');
var headers = rows[0].split(',');

var inventory = {};
for (let i = 1; i < rows.length; i++) {
  var rowData = rows[i].split(',')
  inventory[rowData[0]] = {};

  for (let j = 1; j < headers.length; j++)
	inventory[rowData[0]][headers[j]] = rowData[j]

}


Vue.prototype.$inventory = inventory

 */


import { spawn } from "child_process";

var checkIfPrintable = function(labelFileName){
	  
	var folder = ''
	if(labelFileName.includes('8oz') && labelFileName.includes('Harvest'))
		folder = '5lb Whole'
	if (labelFileName.includes('12oz') && labelFileName.includes('Whole'))
	  folder = '12oz Whole'
	if (labelFileName.includes('12oz') && labelFileName.includes('Ground'))
	  folder = '12oz Ground'
	if (labelFileName.includes('5lb') && labelFileName.includes('Whole'))
	  folder = '5lb Whole'
	if (labelFileName.includes('5lb') && labelFileName.includes('Ground'))
	  folder = '5lb Ground'
		
	  var existingPdfBytes;
  try{
	 existingPdfBytes = fs.readFileSync(
	  path.join(Vue.prototype.$rootOfApp,folder, labelFileName + '.pdf'));

	  return true;
	 }catch(err){
		 return false;
	 }

}




	var embedFontAndMeasureText = async function (labelFileName, grindType) {
		return new Promise(async function(resolve, reject){

			



		
	  
		var folder = ''
		if(labelFileName.includes('8oz') && labelFileName.includes('Harvest'))
			folder = '5lb Whole'
		if (labelFileName.includes('12oz') && labelFileName.includes('Whole'))
		  folder = '12oz Whole'
		if (labelFileName.includes('12oz') && labelFileName.includes('Ground'))
		  folder = '12oz Ground'
		if (labelFileName.includes('5lb') && labelFileName.includes('Whole'))
		  folder = '5lb Whole'
		if (labelFileName.includes('5lb') && labelFileName.includes('Ground'))
		  folder = '5lb Ground'
			
		  var existingPdfBytes;
	  try{
		 existingPdfBytes = fs.readFileSync(
		  path.join(Vue.prototype.$rootOfApp,folder, labelFileName + '.pdf')
	  
		);
	  
	
	  
		// Load a PDFDocument require( the existing PDF bytes
	  
		const pdfDoc = await PDFDocument.load(existingPdfBytes);
	  
		pdfDoc.registerFontkit(fontkit);

	//	const url = Vue.prototype.$rootOfApp + '\\Gotham Extra Light.otf'
	//	const fontBytes = await fetch(url).then(res => res.arrayBuffer());
	//	const fontBytes = fs.readFileSync(Vue.prototype.$rootOfApp + '\\Gotham Extra Light.otf');

	const customFont = await pdfDoc.embedFont(fontBytes);
	var page = pdfDoc.getPages()[0]
  
  
	var color = rgb(35/256.0, 35/256.0, 35/256.0);
	if (labelFileName.includes('Decaf') ||
	  labelFileName.includes('Kiunyu') ||
	  labelFileName.includes('Javacology House Blend') ||
	  labelFileName.includes('Journeys Blend') ||
	  labelFileName.includes('Perfect Dark') ||
	  labelFileName.includes('Shinola Blend') ||
	  labelFileName.includes('Blend for Shinola') ||
	  labelFileName.includes('DDD Blend') ||
	  labelFileName.includes('Creation Espresso 12oz') ||
	  (labelFileName.includes('Rummel Roast') && labelFileName.includes('12oz')) ||
	  labelFileName.includes('Santa Josefita') ||
	  labelFileName.includes('Shinola House Blend') ||
	  labelFileName.includes('Timberwolves Blend') ||
	  labelFileName.includes('Upstream Blend'))
	  color = rgb(1, 1, 1);
  
	if (labelFileName.includes('Iron Grind House Blend') &&  labelFileName.includes('12oz'))
	  color = rgb(199/256.0, 51/256.0, 44/256.0);

	//disable date
	var drawDate = true;
  	if(labelFileName.includes("Minus 320")){
		  drawDate = false;
	}
  
  
	var text = "Roasted On:";
	if (labelFileName.includes('Best By')) text = 'Best By';
  
	var textSize = 8;
	var textWidth = customFont.widthOfTextAtSize(text, textSize)
	var textHeight = customFont.heightAtSize(textSize);
  
	var today = new Date();
	var dd = today.getDate()
	var mm = today.getMonth() + 1
	var yy = today.getFullYear()
	today = mm + '.' +  + dd + '.' + yy;
  
	if (labelFileName.includes('Best By')) {
	  dd = dd > 30 ? 30 : dd;
	  mm = (mm + 3) % 12;
	  yy = (mm + 3) > 12 ? yy + 1 : yy;
	}
  
  
	today = String(mm) + '.' + (dd < 10 ? '0': '')+ String(dd) + '.' + String(yy).slice(2);
  
	var RoastedOnBrewByX;
	var RoastedOnBrewByY;
	var dateX;
	var dateY;
	var grindX = 1000;
	var grindY = 1000;


  
	if (labelFileName.includes('12oz')) {
	  RoastedOnBrewByX = 131;
	  RoastedOnBrewByY = 166;
	  dateX = 186;
	  dateY = RoastedOnBrewByY;
		if(labelFileName.includes('Iron Grind House')){
			RoastedOnBrewByX = 85 ;
			RoastedOnBrewByY = 164;
			dateX = 138;
			dateY = RoastedOnBrewByY;
		}
	
		  grindX = 63;
		  grindY = 177-1;

	  
	}
	if (labelFileName.includes('5lb')) {
	  RoastedOnBrewByX = 198 +30;
	  RoastedOnBrewByY = 204.5;
	  dateX = 259+15;
	  dateY = RoastedOnBrewByY;
		if(labelFileName.includes('Harvest')){
			RoastedOnBrewByX = 198 ;
			RoastedOnBrewByY = 162;
			dateX = 259;
			dateY = RoastedOnBrewByY;
		}

	 
		  grindX = 148-2;
		  grindY = 214;
	 
	}

	if (labelFileName.includes('8oz') && labelFileName.includes('Harvest')) {
		RoastedOnBrewByX = 82;
		RoastedOnBrewByY = 260;
		dateX = 144;
		dateY = RoastedOnBrewByY;
	}

	var textSize2;
	if (labelFileName.includes('Live Oak Blend 5lb') ||
	  labelFileName.includes('Paddock House Blend 5lb') ||
	  labelFileName.includes('Timberwolves Blend 5lb') ||
	  labelFileName.includes('Reo Joe Custom') ||
	  labelFileName.includes('Blue Owl Cold Brew')
	) {
	  RoastedOnBrewByX = 306+5;
	  RoastedOnBrewByY = 165;
	  dateX = RoastedOnBrewByX;
	  dateY = 187.5+5;
	  textSize2 = 28;
	  today = today.split('.')[0] + '/' + today.split('.')[1] 	
	}
  
	if(drawDate){
		page.drawText(text, {
		x: RoastedOnBrewByX - textWidth / 2.0,
		y: (page.getSize()['height'] - RoastedOnBrewByY) - textHeight / 2.0,
		size: textSize,
		font: customFont,
		color: color
		});
	
		textWidth = customFont.widthOfTextAtSize(today, textSize2 === undefined ? textSize : textSize2)
	page.drawText(today, {
		x: dateX - textWidth / 2.0,
		y: (page.getSize()['height'] - dateY) - textHeight / 2.0,
		size: textSize2 === undefined ? textSize : textSize2,
		font: customFont,
		color: color
		});
	}
  
	if(grindType==='Coarse'||grindType==='Espresso'||grindType==='Fine'){
		grindType = grindType.toLowerCase();
		textSize = 5;
	   	textWidth = customFont.widthOfTextAtSize(grindType, textSize)
	  	textHeight = customFont.heightAtSize(textSize);
	  	page.drawText(grindType, {
		  x: grindX - textWidth / 2.0,
		  y: (page.getSize()['height'] - grindY) - textHeight / 2.0,
		  size:  textSize,
		  font: customFont,
		  color: color
		});
	}
  
  
	
	const pdfBytes = await pdfDoc.save();
		var tempName = labelFileName+Date.now().toString()+".pdf";
		fs.writeFile(tempName, pdfBytes, () => {
		   var print = spawn(
			path.join(remote.app.getAppPath(), '..', 'PDFtoPrinter.exe'),
			folder.includes('5lb') ? [tempName, "Bulk Printer"]: [tempName, "Retail Printer"]
		  );
	  
		  print.stdout.on("data", data => {
			console.debug(`stdout: ${data}`);
		  });
	  
		  print.stderr.on("data", data => {
			console.error(`stderr: ${data}`);
			//this.addTag(this.orderNumber, ERROR_PRINTING_TAG_ID);
		  });
	  
		  print.on("close", code => {
			  resolve("success")
			console.debug(`child process exited with code ${code}`);
		  });
	   
	
	  
	  });
	} catch (err) {
		console.error(err)
		reject('fail')
	}

});
	}




Vue.prototype.$print = embedFontAndMeasureText;
Vue.prototype.$checkIfPrintable = checkIfPrintable;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
