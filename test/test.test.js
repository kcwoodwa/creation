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




var grindType =""
var size =""
var grind = "";
var shortenedName =""
var computedName =""
var quantity =  1;
var printedLabels = ""
var hidden = true;

var { spawn } = require( "child_process");
var embedFontAndMeasureText = async function (labelFileName, grindType) {
	return new Promise(async function(resolve, reject){




	
  
	var folder = ''
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
	  path.join(__dirname, '..',folder, labelFileName + '.pdf')
  
	);
  
  } catch (err) {
	  console.error(err)
	  resolve('fail')
  }
  
	// Load a PDFDocument require( the existing PDF bytes
  
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	const url =
		  "https://raw.githubusercontent.com/mapzen/open/master/assets/fonts/Gotham-Light.ttf";
		const fontBytes = await fetch(url).then(res => res.arrayBuffer());
  
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
	  labelFileName.includes('Blend for Shinola') ||
	  labelFileName.includes('DDD Blend') ||
	  labelFileName.includes('Creation Espresso 12oz') ||
	  (labelFileName.includes('Rummel Roast') && labelFileName.includes('12oz')) ||
	  labelFileName.includes('Santa Josefita') ||
	  labelFileName.includes('Shinola House Blend') ||
	  labelFileName.includes('Timberwolves Blend') ||
	  labelFileName.includes('Upstream Blend'))
	  color = rgb(1, 1, 1);
  
	if (labelFileName.includes('Iron Grind House Blend'))
	  color = rgb(1, 0, 0);

	//disable date
	var drawText = true;
  	if(labelFileName.includes("Minus 320")){
		  drawText = false;
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
		if(labelFileName.includes('Harvest')){
			RoastedOnBrewByX = 198 ;
			RoastedOnBrewByY = 162;
			dateX = 259;
			dateY = RoastedOnBrewByY;
		}

	  if(grindType  && grindType.toLowerCase()==='espresso'){
		  grindX = 148-2;
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
	var tempName = labelFileName+Date.now().toString()+".pdf";
	fs.writeFile(tempName, pdfBytes, () => {
	   /* var print = spawn(
		path.join(remote.app.getAppPath(), '..', 'PDFtoPrinter.exe'),
		true ? [tempName, "5lb Label Printer"]: [tempName, "Retail Printer"]
	  );
  
	  print.stdout.on("data", data => {
		console.log(`stdout: ${data}`);
	  });
  
	  print.stderr.on("data", data => {
		console.error(`stderr: ${data}`);
		//addTag(orderNumber, ERROR_PRINTING_TAG_ID);
	  });
  
	  print.on("close", code => {
		  resolve("success")
		console.log(`child process exited with code ${code}`);
	  }); */
   

  
  });


});
}

var parseName = function(name){
						
			
				

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


	grindType = name.includes('Coarse') ?   'Coarse': grindType;
	grindType = name.includes('Fine') ?     'Fine': grindType;
	grindType = name.includes('Espresso') ?     'Espresso': grindType;

	if(name.includes('Diamond Espresso') || name.includes('Creation Espresso')){
		grindType  = (name.toLowerCase().match(/espresso/g) || []).length >= 2 ? 'Espresso' : '';
	}

	


	if (name.includes("Subscription") ) {
		hidden = false;

		grind = name.includes('Whole') ? 'Whole': grind;
		grind = name.includes('Ground') ? 'Ground' : grind
		

		coffee = name.split('Subscription')[0].trim();
		size = "12oz";

	}
	else if(name.includes("Subscription")){
		hidden = false;

		grind = itemObject.options[0].value.includes("Yes")
			? "Ground"
			: "Whole";
		grindType = grind === "Ground"
				? itemObject.options[0].value.split("–")[1]
				: "";
		coffee = itemObject.options[1] ? itemObject.options[1].value: name;
		size = "12oz";

		computedName =
			"Subscription: " +
			coffee +
			" - " +
			size +
			" - "
			grind +
			(grindType === "" ? "" : " - " + grindType);


	}
	else if (name.includes("Grind:")) {
		hidden = false;

		//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
		coffee = name.split("Size")[0].trim();
		size = name.indexOf("12oz") != -1 ? "12oz" : "";
		size = name.indexOf("5lb") != -1 ? "5lb" : size;
		grind = name.split("Grind:")[1].trim();
	} else if (
		name.includes("Ground") ||
		name.includes("Whole Bean")
	) {
		hidden = false;

		//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
		coffee = name.split("-")[0].trim();
		size = name.includes("5 lb") ? "5lb" : "12oz";
		grind = name.includes("Ground") ? "Ground" : "Whole";

		computedName =
			coffee +
			" - " +
			size +
			" - " +
			grind +
			(grindType === "" ? "" : " - " + grindType);
	
	} else if (
		name.includes("Size: 5lb") ||
		name.includes("Size: 12oz")
	) {
	hidden = false;

	//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
	coffee = name.split("Size: ")[0].trim();
	size = name.includes("5 lb") ? "5lb" : "12oz";
	grind = name.includes("Ground") ? "Ground" : "Whole";
	}
	if (hidden === false) {
		labelFileName = coffee +' '+ size +' '+ grind;

		shortenedName = (quantity + labelFileName)
			.match(/[\dA-Z]/g)
			.join("");
		if (printedLabels && printedLabels.includes(shortenedName))
			alreadyPrinted = true;

		return {'labelFileName':labelFileName, 'grindType': grindType}

	//$emit("addToQuantity",  regex );
	}

	//if (false) $emit("addToWeight", itemObject.sku);

};

for (let row in rows) {
    
   
	var name = rows[row]
	
	var stuff =parseName(name);
	
	
	
      
            embedFontAndMeasureText(stuff['labelFileName'], stuff['grindType'])



	
}


