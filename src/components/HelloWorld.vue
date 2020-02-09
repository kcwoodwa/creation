<template>
  <div class="hello">
    <Order
      v-bind:key="order.orderNumber +order.billTo.name+ order.advancedOptions.customField1"
      v-for="order in Orders"
      :name="order.billTo.name"
      :company="order.billTo.company"
      :items="order.items"
      :orderNumber="order.orderNumber"
      :orderObject="order"
    ></Order> 
  </div>
</template>

<script>
//const LABELS_PRINTED_TAG_ID = 89655;
const ERROR_PRINTING_TAG_ID = 91038;

 var secret =
  "ZmM4NTRjNmZmNTU1NDg0Zjg3MmE3NjA5NDE4ZTEyYTU6NzVkMTI1ZWJjNjRmNDQzZGE0NmM2NDBlNWYzMGU4YjU=";

const options = {
  hostname: "ssapi.shipstation.com",
  headers: {
    Authorization: "Basic " + secret,
    "Content-Type": "application/json"
  }
}; 

var active = true;

import Order from "@/components/Order.vue";
import http from 'http'

export default {
  created() {
    
    this.refresh();
    
    setInterval(this.refresh, 10000);
  },
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    Order
  },
  
  data: function() {
    return {
      Orders: []
     
     
    };
  },
  methods: {
    refresh: async function(){
      
      await this.getOrders("/orders?orderStatus=awaiting_payment", true)
      await this.getOrders("/orders?orderStatus=awaiting_shipment");
    },
   
    getOrders: async function(path) {
      if (active) {
        options.path = path;
        options.method = "GET";
        var self = this;
        const req = http.get(options, res => {
          console.debug(`STATUS: ${res.sttausCode}`);
          console.debug(`HEADERS: ${JSON.stringify(res.headers)}`);
          res.setEncoding("utf8");

          let rawData = "";
          res.on("data", chunk => {
            rawData += chunk;
          });
          res.on("end", () => {
            try {
              console.debug(rawData)
              const parsedData = JSON.parse(rawData);
              
              //if(first)this.Orders = [];
              for (var order in parsedData.orders) {
                var orderObject = parsedData.orders[order];

                
                let count = 0;
                if(this.$children.filter(function(child){
                  if(child.$vnode.key !== orderObject.orderNumber +orderObject.billTo.name + orderObject.advancedOptions.customField1
                   && child.$vnode.key.includes(orderObject.orderNumber +orderObject.billTo.name)){
                    self.Orders.splice(count++,1,parsedData.orders[order])
                    return true;
                   }



                  return child.$vnode.key === orderObject.orderNumber +orderObject.billTo.name + orderObject.advancedOptions.customField1
                }).length === 0)
                  self.Orders.push(parsedData.orders[order]);
       
                }
              return;
              
            } catch (e) {
              console.error(e.message);
            }
          });

          req.on("error", e => {
            console.error(`problem with request: ${e.message}`);
          });
        });
      }
    },

    /*  parseOrders(order) {
      order.coffeeItems = [];
       {
        for (var item in order.items) {
    
          var itemInOrder = order.items[item];

          if (itemInOrder.name.indexOf("Grind:") === -1){
            continue;
          } 
      
          


          //Ethiopia Yirgacheffe Size: 12oz, Grind: Whole
          var name = itemInOrder.name.split("Size")[0].trim();
          var size = itemInOrder.name.indexOf("12oz") != -1 ? " 12oz " : "";
          size = itemInOrder.name.indexOf("5lb") != -1 ? " 5lb " : size;
          var grind = itemInOrder.name.split("Grind:")[1].trim();

          var labelFileName = name + size + grind;


          //	const PATH_TO_LABELS = "C:\\"
          var printerName =
            size === " 12oz " ? "RETAIL PRINTER" : "BULK PRINTER";
          var driverName = size === " 12oz " ? "RETAIL DRIVEr" : "BULK DRIVER";
          var port = size === " 12oz " ? "RETAIL PORT" : "BULK PORT";

          for (var i = 0; i < itemInOrder.quantity; i++) {
            var print = spawn(
              `AcroRd32.exe`,
              ["/h", "/t", labelFileName, printerName, driverName, port],
              {
                cwd: `C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader`
              }
            );

            print.stdout.on("data", data => {
              console.log(`stdout: ${data}`);
            });

            print.stderr.on("data", data => {
              console.error(`stderr: ${data}`);
              this.addTag(order.orderId, ERROR_PRINTING_TAG_ID);
            });

            print.on("close", code => {
              console.log(`child process exited with code ${code}`);
            });
          }
        }

        //addTag(order.orderId, LABELS_PRINTED_TAG_ID);
      }
    }, */
    addTag: function(orderId, labelId) {
      options.path = "/orders/addtag";
      options.method = "POST";
      const postData = {
        orderId: orderId,
        tagId: labelId
      };

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
        this.addTag(orderId, ERROR_PRINTING_TAG_ID);
      });

      req.write(JSON.stringify(postData));
      req.end();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  float: left;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
