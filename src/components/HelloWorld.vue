<template>
  <div class="hello">
    <Order
      v-bind:key="order.orderNumber +order.billTo.name+ order.advancedOptions.customField3"
      v-for="order in Orders"
      :newCustomer="isNewCustomer(order)"
      :name="order.billTo.name"
      :company="order.billTo.company"
      :items="order.items"
      :orderNumber="order.orderNumber"
      :orderObject="order"
    ></Order> 
  </div>
</template>

<script>
import { remote } from "electron";
const { Tray, Menu } = remote;
import path from 'path';
var trayIcon = null;

// Where you wanna call the child's method:


  









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
      var self = this;
    



        trayIcon = new Tray(
        path.join(
          remote.app.getAppPath(),'..','png',
          "Creation Coffee Diamond Logo_White.png"
        ));

        const trayMenuTemplate = [

      {
        label: "Show Hidden Items",
        type: "checkbox",
        click: function() {
          self.$store.commit('unhide')
        }
      },
      {
        label: "Print Retail Labels",
         click: function(){self.printLabels('12oz')}
      },
      {
        label: "Print Bulk Labels",
        click: function(){self.printLabels('5lb8oz')}
      },
    
      {
        label: "Exit",
        click: function() {
          remote.app.isQuiting = true;
          remote.app.quit()
        }
      }
    ];

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    trayIcon.setContextMenu(trayMenu);
    this.getCustomers();

    
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
      Orders: [],
      Customers:{}
     
     
    };
  },
  methods: {
    refresh: async function(){
      var self = this;
      await this.getOrders("/orders?orderStatus=awaiting_payment", true).then( async function(){
        await self.getOrders("/orders?orderStatus=awaiting_shipment");
      });
      
    },
    isNewCustomer:function(orderObject){
      var self = this;
      for(let i =0; i < this.Customers.length; i++){
        var customer = this.Customers[i];
        if(customer.customerId === orderObject.customerId &&
        customer.createDate.split('T')[0] === orderObject.createDate.split('T')[0]){
              return true;
        }
      }
      return false;
    },
    getCustomers:function(){
        options.path = "/customers?sortBy=CreateDate&sortDir=DESC&pageSize=30";
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
              
              self.Customers = parsedData.customers
              console.log(parsedData)
            } catch (e) {
              console.error(e.message);
           
            }
          });

          req.on("error", e => {
            console.error(`problem with request: ${e.message}`);
 
          });
        });

    },
    printLabels:function(size){
        var self = this;
   
          self.$children.forEach(async function(child){
            var regex = ""
            var promise = new Promise(function(resolve, reject){
              var count = 0;
              child.$children.forEach(async function(label){
                
                  await label.print(size).then(
                    function(result){
                      regex+= result;
                      count +=1; 
                      if(count === child.$children.length){
                        resolve();
                      }
                    },
                    function(fail){
                      count +=1; 
                      if(count === child.$children.length){
                        resolve();
                      }
                    }
                  )
                })

            }) 
            promise.then(function(result){child.updatePrintedLabels(regex)});
          });

        
      
    },

   
    getOrders: async function(path) {
      var self = this;
      return new Promise(async function(resolve, reject){
      if (active) {
        options.path = path;
        options.method = "GET";
        
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

                var key;
                let count = -1;
                var exists = false;
                self.Orders.forEach(function(order){
                  count++;
                  var key = order.orderNumber + order.billTo.name;
                  if(orderObject.orderNumber +orderObject.billTo.name === key){
                      self.Orders.splice(count,1,orderObject)
                      exists = true;
                  }
                })

                if(exists === false)
                  self.Orders.push(parsedData.orders[order]);
       
                }
              resolve();
              
            } catch (e) {
              console.error(e.message);
              reject();
            }
          });

          req.on("error", e => {
            console.error(`problem with request: ${e.message}`);
            reject()
          });
        });
      }
      })
    }
    
    ,

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
.hello{
 width:100%;
 height: auto;
}
</style>
