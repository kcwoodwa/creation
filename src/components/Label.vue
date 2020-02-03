<template>
  <div class="label" v-show="!hidden && !alreadyPrinted" v-on:click="print()">
    {{quantity +" × "}}
    {{computedName }}
  </div>
</template>


<script>


export default {
  created() {
    this.$emit("addToWeight", this.itemObject['sku'].toString());
    this.hidden = true;
  
    this.labelFileName;
    if (this.name.includes("Grind:")) {
      this.hidden = false;

      //Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
      this.coffee = this.name.split("Size")[0].trim();
      this.size = this.name.indexOf("12oz") != -1 ? " 12oz " : "";
      this.size = this.name.indexOf("5lb") != -1 ? " 5lb " : this.size;
      this.grind = this.name.split("Grind:")[1].trim();
    } else if (
      this.name.includes("Ground") ||
      this.name.includes("Whole Bean")
    ) {
      this.hidden = false;

      //Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
      this.coffee = this.name.split("-")[0].trim();
      this.size = this.name.includes("5 lb") ? "5lb" : "12oz";
      this.grind = this.name.includes("Ground") ? "Ground" : "Whole";
    } else if (this.name.includes("Subscription")) {
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
      this.coffee = this.name.split("-")[0].trim();
      this.size = this.name.includes("5 lb") ? "5lb" : "12oz";
      this.grind = this.name.includes("Ground") ? "Ground" : "Whole";
    }
    if (this.hidden === false) {
      this.labelFileName = this.coffee + this.size + this.grind;

       var regex =  (this.quantity + this.labelFileName).match( /[\dA-Z]/g).join('');
      if (
        this.printedLabels &&
        this.printedLabels.includes(regex)
      )
        this.alreadyPrinted = true;
       
        
        console.debug(regex)
        this.$emit("addToQuantity",  regex );
       
        
    }
    
    //if (false) this.$emit("addToWeight", this.itemObject.sku);
   
    if(this.last && 
        this.$parent.$children.length === 
        this.$parent.$children.filter( function(child){return (child.alreadyPrinted || child.hidden)}).length){
          this.$emit('hideOrder')
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
    print: function() {
      /* var printerName =
        this.size === " 12oz " ? "RETAIL PRINTER" : "BULK PRINTER";
      var driverName = this.size === " 12oz " ? "RETAIL DRIVEr" : "BULK DRIVER";
      var port = this.size === " 12oz " ? "RETAIL PORT" : "BULK PORT"; */

      for (var i = 0; i < this.quantity; i++) {
        this.$print(this.labelFileName);


       
      }
      var regex =  (this.quantity + this.labelFileName).match( /[\dA-Z]/g).join('');
      regex;
      this.$emit("updatePrintedLabels", regex);

     
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
</style>