<template>
	<div :class="'printed'+alreadyPrinted+' label'" v-show="!hidden" v-on:click="print()">
		{{ quantity + " × " }}
		{{ computedName }}
	</div>
</template>

<script>
export default {
	created() {
		//this.$emit("addToWeight", this.itemObject['sku'].toString());
		this.hidden = true;

		this.parseName(this.name)

	
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
		printedLabels: String
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
			coffee: ""
		};
	},
	methods: {
		parseName : function(name){
			
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
				(this.grindType === "" ? "" : " - " + this.grindType);

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
			
			return this.labelFileName;

			//this.$emit("addToQuantity",  regex );
		}

		//if (false) this.$emit("addToWeight", this.itemObject.sku);

		},
		print: function() {
			var regex = (this.quantity + this.labelFileName).match(/[\dA-Z]/g).join("");
	 
			this.$emit("updatePrintedLabels", regex);
			/* var printerName =
				this.size === " 12oz " ? "RETAIL PRINTER" : "BULK PRINTER";
			var driverName = this.size === " 12oz " ? "RETAIL DRIVEr" : "BULK DRIVER";
			var port = this.size === " 12oz " ? "RETAIL PORT" : "BULK PORT"; */

			for (var i = 0; i < this.quantity; i++) {
				this.$print(this.labelFileName);
			}
			
		}
	}
};
</script>

<style scoped>
.label {
	width: 100%;
	text-align: left;
	padding: 4px;
	margin: 2px;
	border: 1px inset black;
}

.printedtrue{
	border: 1px inset red;

}
</style>
