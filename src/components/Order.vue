<template>
	<div v-show="!this.hidden" class="wrapper">
		<div class="header">
			<div id="spacer"></div>
			<b>{{name + ((company && company!== null) ? ' - ' +company : '') + ' - #'+ orderNumber }}</b>
		</div>
		<Label
			v-bind:key="name.toString()+item.name"
			v-for="(item, index) in items"
			:name="item.name"
			:orderNumber="name.toString()"
			:itemObject="item"
			:quantity="item.quantity"
			@hideOrder="hide"
			@updatePrintedLabels="updatePrintedLabels"
			:last="index === items.length-1"
			:printedLabels="getPrintedLabelsFromShipstation()"
		></Label>
	</div>
</template>


<script>
import Label from "@/components/Label.vue";

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
	methods: {
		getPrintedLabelsFromShipstation: function() {
			
			this.printedLabels = this.verifyThenDecrypt(
				this.orderObject.advancedOptions.customField1
			);
			return this.printedLabels;
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

				 
				});
			});

			req.on("error", e => {
				console.error(`problem with request: ${e.message}`);
			});
		 
			var current = this.printedLabels ? this.printedLabels : "";
			current = this.encryptThenAuthenticate(printedLabels + current);
			
			this.orderObject.advancedOptions.customField1 = current;

			req.write(JSON.stringify(this.orderObject));
			req.end();
		},
		
	}
};
</script>

<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	text-transform: uppercase;

	width: 95%;
	padding: 6px 10px;

	margin: 4px;
}

.header {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	text-transform: uppercase;
	padding: 2px;
}

#spacer {
	width: 5px;
}
</style>