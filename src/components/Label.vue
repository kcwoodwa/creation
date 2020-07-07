<template>
	<div v-show="!hidden || showHidden" style="padding:5px">

		<div :class="'printed'+alreadyPrinted+' button '"  v-on:click.left="print(undefined)" v-on:click.right="openMenu">
			<span id="warn" v-if="!this.$store.getters.getFileLocations.getItem(name)" >&#9940;</span>
			{{ quantity + " × " }}
			{{ computedName }}
			
			
			 <ul id="right-click-menu" tabindex="-1" ref="right" v-show="viewMenu"  @blur="closeMenu"  v-bind:style="{top:top, left:left}">
				<li v-on:click="print(undefined, true)">Print Once</li>
				<li v-on:click="print(undefined, true)"><label :for="'file-upload'" class="custom-file-upload" >Custom Upload</label></li>
			</ul>
		</div>
		
	</div>
	
</template>


<script>

import { mapState, mapMutations, mapGetters  } from 'vuex';
import {bus} from '../main.js';
// Add this to the mounted() method in your component options object:


export default {
	
	mounted(){
	
	
		
	
	},
	created() {
		
	
		//this.$emit("addToWeight", this.itemObject['sku'].toString());
		this.hidden = true;

		this.parseName(this.name)
		this.validPDF = this.$checkIfPrintable(this.labelFileName)
		

	
		if (
			this.last &&
			this.$parent.$children.length ===
				this.$parent.$children.filter(function(child) {
					return child.alreadyPrinted || child.hidden;
				}).length
		) {
			this.$emit("hideOrder");
		}
		

	},
	name: "Label",
	props: {
		msg: String,
		name: String,
		itemObject: Object,
		orderNumber: String,
		quantity: Number,
		last: Boolean,
		printedLabels: String,
		fileLocation: String
	},
	data: function() {
		return {
			hidden: true,
			alreadyPrinted: false,
			computedName: this.name,
			labelFileName: "",
			size: "",
			grind: "",
			grindType: "",
			coffee: "",
			bestBy: true,
			viewMenu: false,
			shortenedName: '',
        	top: '0px',
			left: '0px',
			validPDF: false
		};
	},
	computed: {
		...mapState([
		'showHidden',
		'fileLocations'
	]),
	 ...mapGetters(['getFileLocations'])
	}
	,

	methods: {
	

		setMenu: function(top, left) {
          
         /*    var largestHeight = window.innerHeight - this.$refs.right.offsetHeight - 25;
            var largestWidth = window.innerWidth - this.$refs.right.offsetWidth - 25;

            if (top > largestHeight) top = largestHeight;

            if (left > largestWidth) left = largestWidth;
 */
            this.top = top-15+ 'px';
            this.left = left-25 + 'px';
        },

        closeMenu: function() {
            this.viewMenu = false;
        },

        openMenu: function(e) {
			e.preventDefault();
			e.stopPropagation();
            this.viewMenu = true;

            this.$nextTick(function() {
                this.$refs.right.focus();

                this.setMenu(e.y, e.x)
            }.bind(this));
            e.preventDefault();
        },
		...mapMutations(['unhide','setFileLocation']),
		parseName :function(name){
						
			
				
/* 
			name = name.includes("REO Joe Custom")
			? name + " Size: 5lb"
			: name;
			name = name.includes("Paddock House Blend - 5 lb")
			? name.replace("- 5 lb", "Size: 5lb")
			: name;
			name = name.includes("Blend for Shinola")
			? name + " Size: 12oz"
			: name; */



			
			//name.includes("Cold Brew Coffee Size: 3 L - 5:1 Concentrate BIB
			//name.includes("Cold Brew Coffee Size: 7 Gallon - Ready to Drink
			//name.includes("Harvest 8 oz. Bags Type: Costa Rica La Pastora"
	

			this.grindType = name.includes('Coarse') ?   'Coarse': this.grindType;
			this.grindType = name.includes('Fine') ?     'Fine': this.grindType;
			this.grindType = name.includes('Espresso') ?     'Espresso': this.grindType;

			if(this.name.includes('Diamond Espresso') || this.name.includes('Creation Espresso') || this.name.includes('Iron Grind Espresso')){
				this.grindType  = (name.toLowerCase().match(/espresso/g) || []).length >= 2 ? 'Espresso' : '';
			}

			
		

			
			if (name.includes("Subscription") && this.itemObject.sku.startsWith('SQ')) {
				this.hidden = false;

				this.grind = this.name.includes('Whole') ? 'Whole': this.grind;
				this.grind = this.name.includes('Ground') ? 'Ground' : this.grind
				
	
				this.coffee = this.name.split('Subscription')[0].trim();
				this.coffee = this.coffee.toLowerCase().includes('decaf') ? 'Santa Barbara Decaf' : this.coffee;
				this.size = "12oz";

			}
			else if(name.includes("Subscription")){
				this.hidden = false;

				this.grind = this.itemObject.options[0].value.includes("Yes")
					? "Ground"
					: "Whole";
				this.grindType = this.grind === "Ground"
						? this.itemObject.options[0].value.split("–")[1]
						: "";
				this.coffee = this.itemObject.options[1] ? this.itemObject.options[1].value.replace(/,/g, '')
					: this.name;
				this.size = "12oz";

				this.computedName =
					"Subscription: " +
					this.coffee +
					" - " +
					this.size +
					" - " +
					this.grind +
					(this.grindType === "" ? "" : " - " + this.grindType);

	
			}
			else if (name.includes("Grind:")) {
				this.hidden = false;

				//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
				this.coffee = name.split("Size")[0].trim();
				this.size = name.includes("5lb") ? "5lb" : this.size;
				this.size = name.includes("5 lb") ? "5lb" : this.size;
				this.size = name.includes("12oz") ? "12oz" : this.size;
				this.size = name.includes("12 oz") ? "12oz" : this.size;
				this.size = name.indexOf("8oz") != -1 ? "8oz" : this.size;
				this.size = name.indexOf("8 oz") != -1 ? "8oz" : this.size;
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

				this.computedName =
					this.coffee +
					" - " +
					this.size +
					" - " +
					this.grind +
					(this.grindType === "" ? "" : " - " + this.grindType);
			
			} else if (
				name.includes("Size: 5 lb") ||
				name.includes("Size: 5lb") ||
				name.includes("Size: 12oz") ||
				name.includes("Size: 12 oz") 
			) {
			this.hidden = false;

			//Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
			this.coffee = name.split("Size: ")[0].trim();
			this.size = name.includes("5lb") ? "5lb" : this.size;
			this.size = name.includes("5 lb") ? "5lb" : this.size;
			this.size = name.includes("12oz") ? "12oz" : this.size;
			this.size = name.includes("12 oz") ? "12oz" : this.size;
			this.grind = name.includes("Ground") ? "Ground" : "Whole";
			this.grind = name.includes("DDD House Blend") ? "Whole" : this.grind;
			}
			if (this.hidden === false) {
				this.labelFileName = this.coffee +' '+ this.size +' '+ this.grind;

				this.shortenedName = (this.quantity + this.labelFileName)
					.match(/[\dA-Z]/g)
					.join("");
				if (this.printedLabels && this.printedLabels.includes(this.shortenedName))
					this.alreadyPrinted = true;

				return {'labelFileName':this.labelFileName, 'grindType': this.grindType}

			//this.$emit("addToQuantity",  regex );
			}

			//if (false) this.$emit("addToWeight", this.itemObject.sku);

		},

		print: async function(retailOrBulk, forcePrintSingle) {
			var $this = this;
			if(!this.validPDF)
				return;


			return new Promise(async function(resolve, reject){

			var count = forcePrintSingle ?  1 :$this.quantity;
			
	
		
			if(($this.alreadyPrinted === false || forcePrintSingle) && ( retailOrBulk === undefined || (retailOrBulk && retailOrBulk.includes($this.size)))){
			
			

					$this.alreadyPrinted = true;
					//if(forcePrintSingle) $this.$emit("updatePrintedLabels", 'reset')
					
					
					for (var i = 0; i < count; i++) {
						await $this.$print($this.labelFileName, $this.grindType).then(result=>{
							
							if(retailOrBulk === undefined) $this.$emit("updatePrintedLabels", $this.shortenedName);
							resolve( $this.shortenedName);
						}, fail=>{
							reject('Error Printing ' +$this.labelFileName )
							 alert('Error Printing ' +$this.labelFileName );
							console.error($this.labelFileName)
						});
					}
					
				}
			
			else{
				resolve('')
			}
			
		})
		}
	}
};
</script>

<style lang="scss">

#right-click-menu{
	font-size: 10px;
    background: #FAFAFA;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: fixed;
    width: 130px;
    z-index: 999999;
	color:black;
}

#right-click-menu li {
    border-bottom: 1px solid #E0E0E0;
    margin: 0;
    padding: 3px 20px;
}

#right-click-menu li:last-child {
    border-bottom: none;
}

#right-click-menu li:hover {
    background: #1E88E5;
    color: #FAFAFA;
}

.d{
  display:flex;
  flex-direction:column;
}
.c{
  display:block;
  position:relative;
  height:1100%;
  width: auto;
  
}

%test {
  position: absolute;
	content: '';
	transition: all .22s ;
}

$buttonPressInDistance:3px;
.button {
	display: block; 
	padding: 5px 5px;
	color: white;
	position: relative;
	left: 5px;
	line-height: 1.5;
	height:17px;
	width:99%;
	cursor: pointer;


	font-size: 12px;
  //	box-shadow: inset 0 0 0 1px white;
	transition: all .22s;
	background-color:lighten(black,60%);

	$buttonThickness:8px;
	$buttonPressPercentage:1/2.0; //how far button will be pressed in
	&::before {
		@extend %test;
		//box-shadow: inset 0 0 0 1px white;
		bottom: -$buttonThickness;
		height: $buttonThickness;
		width: 100%;
		left: -$buttonThickness/2.0;
		transform: skewX(-45deg);
		background-color: lighten(black,35%);
	}

	&::after {
		@extend %test;
	//	box-shadow: inset 0 0 0 1px white;
		left: -$buttonThickness;
		width: $buttonThickness;
		bottom: -$buttonThickness/2.0;
		height: 100%;
    
		transform: skewY(-45deg);
		background-color: black;
	}
	//&:active,
	&.printedtrue{
	
    color: lighten(black,80%);
		margin-left: -$buttonThickness/2.0;
		margin-top: $buttonThickness/2.0;
		margin-bottom: -$buttonThickness/2.0;
    	background-color:lighten(black,85%);
		color: white;

		&::before {
			bottom: -$buttonThickness/2.0;
			height: $buttonThickness/2.0;
			left: -$buttonThickness/2.0/2.0;
      		background-color: lighten(black, 70%);
		}
		
    &::after {
			left: -$buttonThickness/2.0;
			width: $buttonThickness/2.0;
			bottom: -$buttonThickness/2.0/2.0;
      		background-color: lighten(black, 50%);

		}	
	}
}


#warn{
	display:inline
}

.custom-file-upload {

    display: inline-block;
    cursor: pointer;
}
</style>
