<template>
	<div v-show="!this.hidden || showHidden" class="wrapper" style="position:relative; display:flex; flex-direction:column">
		<div class="header">
			<img v-show="newCustomer" id="lightning" alt="bolt" src="../../png/Untitled-2.png">

			<b>{{name + ((company && company!== null && company!=name) ? ' - ' +company : '') + ' - #'+ orderNumber }}</b>
			<img v-show="newCustomer" id="lightning" alt="bolt" src="../../png/Untitled-3.png">
		</div>
		<img id="printButton" src="../../png/printer-icon.png" v-on:click="printOrder()">
		<div style="display:flex; flex-direction:column; position:relative; width:100%; height:100%">
		<Label
			v-bind:key="name.toString()+item.name"
			v-for="(item, index) in items"
			:name="item.name"
			ref="Label"
			:orderNumber="name.toString()"
			:itemObject="item"
			:quantity="item.quantity"
			@hideOrder="hide"
			@updatePrintedLabels="updatePrintedLabels"
			:last="index === items.length-1"
			:fileLocation="getFileLocations.getItem(item.name)"
			v-on="$listeners"
		
			:printedLabels="getPrintedLabelsFromShipstation()"
		></Label>
		
		</div>
	</div>
</template>


<script>
import Label from "@/components/Label.vue";
import { mapState, mapMutations, mapGetters } from 'vuex';

import http from "http";
import { compress, decompress } from 'lz-string' 





var secret =
	"ZmM4NTRjNmZmNTU1NDg0Zjg3MmE3NjA5NDE4ZTEyYTU6NzVkMTI1ZWJjNjRmNDQzZGE0NmM2NDBlNWYzMGU4YjU=";

const options = {
	hostname: "ssapi.shipstation.com",
	headers: {
		Authorization: "Basic " + secret,
		"Content-Type": "application/json"
	}
};

export default {
	name: "Order",
	props: {
		newCustomer:Boolean,
		msg: String,
		name: String,
		items: Array,
		orderNumber: String,
		orderObject: Object,
		company: String,
	},
	components: {
		Label
	},
	data() {
		return {
			md5sum: "",
			hidden: false,
			printedLabels: "",
		};
	},
	computed: {
		...mapState(['showHidden','fileLocations']),
		//...mapGetters(['getFileLocations']),
		getFileLocations:function(){
			return this.$store.getters.getFileLocations
		}
	
	},

	methods: {
		printOrder: function(){console.log(4);this.$emit('printOrder',this)},
		...mapMutations(['unhide','setFileLocation']),
		getPrintedLabelsFromShipstation: function() {
			
			this.printedLabels = this.verifyThenDecrypt(
				this.orderObject.advancedOptions.customField3
			);
			return this.printedLabels;
		},
		getFileLocation:function(a){

			return window.localStorage.getItem(a)
		},

		hide: function() {
			this.hidden = true;
		},
		encryptThenAuthenticate: function(plainText) {

			
			var compressed = compress(plainText)

			return compressed;
		},
		verifyThenDecrypt: function(encryptedAndAuthenticatedText) {
			if (
				encryptedAndAuthenticatedText === undefined ||
				encryptedAndAuthenticatedText === null
			)
				return "";

		 return  decompress(encryptedAndAuthenticatedText)

		},
		updatePrintedLabels: function(printedLabels) {
			var $this = this;
			this.$queue.add(() => { 
			return new Promise(function(resolve, reject){
				options.path = "/orders/createorder";
				options.method = "POST";
				const req = http.request(options, res => {
					console.debug(`STATUS: ${res.statusCode}`);
					console.debug(`HEADERS: ${JSON.stringify(res.headers)}`);
					res.setEncoding("utf8");
					res.on("data", chunk => {
						console.debug(`BODY: ${chunk}`);
					});
					res.on("end", () => {

						console.debug("No more data in response.");
						resolve();

					
					});
				});

				req.on("error", e => {
					console.error(`problem with request: ${e.message}`);
					resolve();
				});
			
				var current = $this.printedLabels ? $this.printedLabels : "";
				current = $this.encryptThenAuthenticate(printedLabels + current);
				
				$this.orderObject.advancedOptions.customField3 = current;
				if(printedLabels==='reset') 
					$this .orderObject.advancedOptions.customField3 = 'a'

				req.write(JSON.stringify($this.orderObject));
				req.end();

			})
			})
		
		},
		
	}
};
</script>

<style scoped>
.wrapper {
	position:relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	text-transform: uppercase;
	box-sizing: border-box;

	width: 100%;
	padding: 5px 15px;


}

.header {
	display: inline;
	
}

#spacer {
	width: 5px;
}

#lightning{
	height: 12px;
    padding: 0px 7px;

}

#printButton{
	right: 0;
    position: absolute;
    height: 20px;
    float: right;
	padding: 0 5px;

}
</style>