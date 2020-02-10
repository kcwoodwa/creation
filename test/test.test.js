/* import { shallowMount } from '@vue/test-utils'
import MyComponent from '../src/components/Label.vue'

// Mount the component
const wrapper = shallowMount(MyComponent) */



var count = 0;
var path = require('path');
var fs =require( 'fs')
var fetch =require( 'node-fetch')
var fontkit =require( '@pdf-lib/fontkit')
var { PDFDocument, rgb } =require( "pdf-lib");





var inventoryData = String(fs.readFileSync('..\\inventory - inventory.csv'));
var rows = inventoryData.split('\r\n');







var { spawn } = require( "child_process");
var embedFontAndMeasureText = async function (labelFileName, grindType) {
	console.log(grindType)


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
  if (labelFileName.includes('5lb') && labelFileName.includes('Ground'))
	folder = '5lb Ground'


  const existingPdfBytes = fs.readFileSync(
	path.join(__dirname, '..',folder, labelFileName + '.pdf')

  );

  // Load a PDFDocument require( the existing PDF bytes

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

  var textSize = 8;
  var textWidth = customFont.widthOfTextAtSize(text, textSize)
  var textHeight = customFont.heightAtSize(textSize);

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
  var dateY;
  var grindX = 1000;
  var grindY = 1000;

  

  if (labelFileName.includes('12oz')) {
	RoastedOnBrewByX = 131;
	RoastedOnBrewByY = 166;
	dateX = 186;
	dateY = RoastedOnBrewByY;
	if(grindType && grindType.toLowerCase()== 'espresso'){
		grindX = 63+5;
		grindY = 177-1;
	  }
	  if(grindType  && grindType.toLowerCase()=='fine'){
		grindX = 63+10;
		grindY = 177-1;
	  }
	  if(grindType  && grindType.toLowerCase() == 'coarse'){
		grindX = 63+7;
		grindY = 177-1;
	  }
	
  }
  if (labelFileName.includes('5lb')) {
	RoastedOnBrewByX = 198 +30;
	RoastedOnBrewByY = 204.5;
	dateX = 259+30;
	dateY = RoastedOnBrewByY;
	if(grindType  && grindType.toLowerCase()==='espresso'){
		grindX = 148-3;
		grindY = 214;
	}
	if(grindType  && grindType.toLowerCase()==='coarse'){
		grindX = 148;
		grindY = 214;
	}
	if(grindType && grindType.toLowerCase()==='fine'){
		grindX = 152;
		grindY = 214;
	}
  }
  var textSize2;
  if (labelFileName.includes('Live Oak Blend 5lb') ||
	labelFileName.includes('Paddock House Blend 5lb') ||
	labelFileName.includes('Timberwolves Blend 5lb') ||
	labelFileName.includes('Reo Joe Custom') ||
	labelFileName.includes('Blue Owl Cold Brew')
  ) {
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

  if(grindType==='Coarse'||grindType==='Espresso'||grindType==='Fine'){
	  grindType = grindType.toLowerCase();
	  textSize = 5;
 	textWidth = customFont.widthOfTextAtSize(text, textSize)
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
  fs.writeFile(labelFileName+".pdf", pdfBytes, () => {
	/* var print = spawn(
	  path.join(remote.app.getAppPath(), '..', 'PDFtoPrinter.exe'),
	  ["test.pdf", "OneNote"]
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
 */
  });

}

var parseName = function(name){
			
	//test block

/* 
var orderNames = fs.readFileSync(this.$rootOfApp+'\\test.txt').toString().split('\r\n');
for(var order in orderNames){
this.name = orderNames[order];
this.hidden = true;
	this.coffee = ''
this.size = ''
this.grind =''  */

name = name.includes("REO Joe Custom")
? name + " Size: 5lb"
: name;
name = name.includes("Paddock House Blend - 5 lb")
? name.replace("- 5 lb", "Size: 5lb")
: name;
name = name.includes("Blend for Shinola")
? name + " Size: 12oz"
: name;

name = name.includes("Blue Owl Cold Brew")
? name + " Size: 5lb"
: name;
//name.includes("Cold Brew Coffee Size: 3 L - 5:1 Concentrate BIB
//name.includes("Cold Brew Coffee Size: 7 Gallon - Ready to Drink
//name.includes("Harvest 8 oz. Bags Type: Costa Rica La Pastora"

this.grindType = name.includes('Coarse') ?   'Coarse': this.grindType;
this.grindType = name.includes('Espresso') ? 'Espresso': this.grindType;
this.grindType = name.includes('Fine') ?     'Fine': this.grindType;


if (name.includes("Grind:")) {
this.hidden = false;

//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
this.coffee = name.split("Size")[0].trim();
this.size = name.indexOf("12oz") != -1 ? "12oz" : "";
this.size = name.indexOf("5lb") != -1 ? "5lb" : this.size;
this.grind = name.split("Grind:")[1].trim();
} else if (
name.includes("Ground") ||
name.includes("Whole Bean")
) {
this.hidden = false;

//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
this.coffee = name.split("-")[0].trim();
this.size = name.includes("5 lb") ? "5lb" : "12oz";
this.grind = name.includes("Ground") ? "Ground" : "Whole";
} else if (name.includes("Subscription")) {
this.hidden = false;

this.grind = this.itemObject.options[0].value.includes("Yes")
	? "Ground"
	: "Whole";
this.grindType =
	this.grind === "Ground"
		? this.itemObject.options[0].value.split("–")[1]
		: "";
this.coffee = this.itemObject.options[1].value;
this.size = "12oz";

this.computedName =
	"Subscription: " +
	this.coffee +
	" - " +
	this.grind +
	(grindType === "" ? "" : " - " + grindType);

//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
this.coffee = name.split("-")[0].trim();
this.size = name.includes("5 lb") ? "5lb" : "12oz";
this.grind = name.includes("Ground") ? "Ground" : "Whole";
} else if (
name.includes("Size: 5lb") ||
name.includes("Size: 12oz")
) {
this.hidden = false;

//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
this.coffee = name.split("Size: ")[0].trim();
this.size = name.includes("5 lb") ? "5lb" : "12oz";
this.grind = name.includes("Ground") ? "Ground" : "Whole";
}
if (this.hidden === false) {
this.labelFileName = this.coffee +' '+ this.size +' '+ this.grind;

var regex = (this.quantity + this.labelFileName)
	.match(/[\dA-Z]/g)
	.join("");
if (this.printedLabels && this.printedLabels.includes(regex))
	this.alreadyPrinted = true;

return {'labelFileName':this.labelFileName, 'grindType': this.grindType}

//this.$emit("addToQuantity",  regex );
}

//if (false) this.$emit("addToWeight", this.itemObject.sku);

}

for (let row in rows) {
    
   
	var name = rows[row]
	
	var stuff =parseName(name);
	
	
	
      
            embedFontAndMeasureText(stuff['labelFileName'], stuff['grindType'])



	
}

