var mysql = require("mysql");
var inquirer = require("inquirer");

const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Connected to bAnimals!');
  start();
});

 function start() {
   inquirer
     .prompt({
       name: "search",
       type: "list",
      message: "Would you like to search bAnimals inventory?",
      choices: ["Search inventory","EXIT"]
     })
     .then(function(answer) {
        if (answer.search === "Search inventory") {
          startSearch();
        }
        else{
          conn.end();
        }
      });
   }
// console.log(this);
  function startSearch() {
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to search?",
      choices: [
        "Find item by ID",
        "Find item by Name",
        "Find item by specific $ range",
        "EXIT"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Find item by ID":
        idSearch();
        break;

      case "Find item by Name":
        itemSearch();
        break;

      case "Find item by specific $ range":
        priceSearch();
        break;

      case "EXIT":
        conn.end();
        break;
      }
    });
}

 function idSearch() {
   inquirer
    .prompt({
      name: "itemId",
      type: "input",
      message: "Search by item Id:"
    })
    .then(function(answer) {
      var sql = `SELECT item_name, item_id 
                    FROM products 
                    WHERE 1=1 
                    AND item_id LIKE '%${answer.itemId}%'
                    AND qty IS NOT NULL;`;
     // console.log(sql);
      conn.query(sql, function(err, res) {
        if (err) throw err;
      //
   //   console.log(answer);
  //      for (var i = 0; i < res.length; i++) {
          console.log("Id: " + res.item_id + " || Item: " + res.item_name);
   //    }
        addToCart();
      });
     });
 }
 function itemSearch() {
    inquirer
     .prompt({
       name: "item_name",
       type: "input",
       message: "Search by Item Name:"
     })
      .then(function(answer) {
        var sql = `SELECT item_name, item_id 
                      FROM products 
                      WHERE 1=1 
                      AND item_name LIKE '%${answer.item_name}%' 
                      AND qty IS NOT NULL;`;
        console.log(sql);
        console.log(answer);
        conn.query(sql, function(err, res) {
          if (err) throw err;
        //
        
       // console.log(answer);
          for (var i = 0; i < res.length; i++) {
           console.log("Id: " + res[i].item_id + " || Item: " + res[i].item_name);
         }
          addToCart();
        });
      });
  }
    function priceSearch() {
        inquirer
        .prompt({
        name: "item_cost",
        type: "input",
        message: "Search by Price Range?"
        })
        .then(function(answer) {
          var sql = `SELECT item_name, item_id 
                        FROM products 
                        WHERE 1=1 
                        AND item_cost LIKE '%${answer.item_cost}%' 
                        AND qty IS NOT NULL;`;
          //console.log(sql);
          conn.query(sql, function(err, res) {
            if (err) throw err;
          //
         // console.log(answer);
            for (var i = 0; i < res.length; i++) {
             console.log("Id: " + res[i].item_id + " || Item: " + res[i].item_cost);
           }
            addToCart();
          });
        });
    }

    function addToCart() {
        inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "Would you like to add this bAnimal to your cart?",
          choices: [
            "Yes",
            "I'd rather not",
            "Search another bAnimal",
            "EXIT"
          ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Yes":
                   updateTable();
                   break;
          
                case "I'd rather not":
                  start();
                  break;
          
                case "Search another bAnimal":
                   startSearch();
                   break;
          
                case "EXIT":
                  conn.end();
                  break;
                }
              });
          }
      function updateTable() {
        inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "Buy now?",
          choices: [
            "Yes",
            "EXIT"
          ]
        })
        .then(function(answer){
            var sql = `UPDATE products 
                        SET qty = qty - 1
                        WHERE 1=1
                        AND id IS NOT NULL
                        AND item_id LIKE '%${answer.item_id}%'
                        AND qty IS NOT NULL;`;
            console.log(sql)
            conn.query(sql, function(err, sql) {
            if (err) throw err;
        console.log("You've proceeded to check out successfully!")
        });
        conn.end();
     })
    };
//     let sql = `UPDATE todos
//     SET completed = ?
//     WHERE id = ?`;

// let data = [false, 1];

// // execute the UPDATE statement
// connection.query(sql, data, (error, results, fields) => {
// if (error){
// return console.error(error.message);
// }
// console.log('Rows affected:', results.affectedRows);
// });