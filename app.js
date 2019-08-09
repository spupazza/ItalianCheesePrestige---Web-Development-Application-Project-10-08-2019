var express = require("express"); // call the express module which is default provded by Node

var app = express(); // now we need to declare our app which is the envoked express application
app.set('view engine', 'ejs');

var fs = require('fs')
var bodyParser = require("body-parser") // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));

var contact = require("./model/contact.json"); // allow the app to access the contact.json 
var mysql = require('mysql');

app.use(express.static("views"));
app.use(express.static("scripts"));
app.use(express.static("images"));
// set up simple hello world application using the request and response function


app.get('/', function(req, res) {
res.render("index.ejs"); // we set the response to send back the index page
console.log("Hello World"); // used to output activity in the console
});

app.get('/contacts', function(req, res) {
res.render("contacts", {contact}); // we use the res.render command to on the response object to display the jade page as html
console.log("contacts page has been displayed"); // used to output activity in the console
});
// this code provides the server port for our application to run on

app.get('/add', function(req, res) {
res.render("add"); // we use the res.render command to on the response object to display the jade page as html
console.log("Contact us page has been displayed"); // used to output activity in the console
});


// post request to send JSON data to server

app.post("/add", function(req,res){

    // Stp 1 is to find the largest id in the JSON file
    
            function getMax(contacts, id){ // function is called getMax
            var max // the max variable is declared here but still unknown
    
                for(var i=0; i<contacts.length; i++){ // loop through the contacts in the json fil as long as there are contcats to read
                    if(!max || parseInt(contact[i][id])> parseInt(max[id]))
                    max = contacts[i];
                        }
    
            return max;
             }

             
             // make a new ID for the next item in the JSON file
             
              maxCid = getMax(contact, "id") // calls the gstMax function from above and passes in parameters 
             
             var newId = maxCid.id + 1; // add 1 to old largest to make ne largest
             
             // show the result in the console
             console.log("new Id is " + newId)
             
             
             // we need to get access to what the user types in the form
             // and pass it to our JSON file as the new data
             
             var contactsx = {
                 
                 
                 id: newId,
                 name: req.body.name,
                 Comment: req.body.Comment,
                 email: req.body.email
                 
                 
             }
             
             
    fs.readFile('./model/contact.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            contact.push(contactsx); // add the new data to the JSON file
            json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./model/contact.json',json, 'utf8', function(){})
            
        }
        
    })         
             
     res.redirect('/contacts') ;
    
});

// Now we code for the edit JSON data 

// *** get page to edit 
app.get('/editcontact/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user 
   function chooseContact(indOne){
       return indOne.id === parseInt(req.params.id)
       }


  var indOne = contact.filter(chooseContact)
    
   res.render('editcontact', {res:indOne}); 
    
});

// ** Perform the edit
app.post('/editcontact/:id', function(req,res){
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(contact)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    
    // the next three lines get the content from the body where the user fills in the form
    
    var z = parseInt(req.params.id);
    var x = req.body.name
    var y = req.body.Comment

   // The next section pushes the new data into the json file in place of the data to be updated  

    contact.splice(index, 1, {name: x, Comment: y, email: req.body.email, id: z })
    
  
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
})

app.get('/deletecontact/:id', function(req, res) {
  var json = JSON.stringify(contact);
var keyToFind = parseInt(req.params.id); // call name from the url
    var data = contact; //this declares data = str2
    var index = data.map(function(contact) {return contact.id;}).indexOf(keyToFind)
    contact.splice(index ,1); // deletes one item from position represented by index  (its position) from above
json = JSON.stringify(contact, null, 4);
fs.writeFile('./model/contact.json', json, 'utf8', function(){}); // Writing the data back to the file
            console.log("RContact Deleted");
   

res.redirect("/contacts");
});

             
          
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {

console.log("Yippee its running");

  
});  

// ******************************** Start of SQL **************************************** //

// First we need to tell the application where to find the database

const db = mysql.createConnection({
host: 'den1.mysql1.gear.host',
    user: 'cheeseita',
    password: 'Lg7GT_y52tv_',
    database: 'cheeseita'
 });
// Next we need to create a connection to the database

db.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.")
        // throw(err)
    } 
     else{
        
        console.log('Looking good the database connected')
    }
    
    
})

// this route will create a database table

//app.get('/createtable', function(req,res){
     // Create a table that will show product Id, name, price, image and description
  //  let sql = 'CREATE TABLE cheese (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Description varchar(255))';
    
    //let query = db.query(sql, (err,res) => {
      //          if(err) throw err;
        //     console.log(res);
        //});
    //res.send("You created your first DB Table")
    //})
    
    // This route will create a product 


//app.get('/insert', function(req,res){
    // Create a table that will show product Id, name, price, image and description
  //  let sql = 'INSERT INTO cheese (Name, Price, Image, Description) VALUES ("Parmiggiano Reggiano", 36, "parmiggiano.jpg", "36 months mature") ';
    
    //let query = db.query(sql, (err,res) => {
        
      //  if(err) throw err;
        
    //    console.log(res);
        
//    });
    
  //   res.send("You created your first Product")
    
 //})
 
 // Url to get the products
 

app.get('/products', function(req,res){
    // Create a table that will show product Id, name, price, image and description
    let sql = 'SELECT * FROM cheese';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('products', {result})
        
    });
    
    //res.send("You created your first Product")
    
})

// URL to get the add product page
app.get('/addproduct', function(req,res){
        res.render('addproduct')
        
})
// post request to write info to the database


app.post('/addproduct', function(req, res){
  let sql = 'INSERT INTO cheese (Name, Price, Image, Description) VALUES ("'+req.body.name+'", '+req.body.price+', "'+req.body.image+'", "'+req.body.description+'")'
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);

  });
  res.redirect("/products");
  });


// URL to get the edit product page 

app.get('/editproduct/:id', function(req,res){
    
        let sql = 'SELECT * FROM cheese WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editproduct', {result})
        
    });
    
})

// URL to edit product


app.post('/editproduct/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and description
    let sql = 'UPDATE cheese SET Name = "   '+req.body.name+'   ", Price = '+req.body.price+', Image = "'+req.body.image+'", Description = "'+req.body.description+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/products')
    //res.send("You created your first Product")
    
})

// URL TO delete a product

app.get('/delete/:id', function(req,res){
    
        let sql = 'DELETE FROM cheese WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
  
    });
    
    res.redirect('/products')
    
    
})
 
 
// Url to see individual product
app.get('/product/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM cheese WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(res);
        res.render('products', {result})
    });
    
   // res.redirect('/products')
    //res.send("You created your first Product")
    
})

// this route will create a database table

app.get('/createtable', function(req,res){
     // Create a table that will show product Id, name, price, image and description
   let sql = 'CREATE TABLE feedback (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Description varchar(255))';
    
    let query = db.query(sql, (err,res) => {
                if(err) throw err;
             console.log(res);
        });
    res.send("You created your first DB Table")
    })
    
    // This route will create a product 

// ******************************** End of SQL **************************************** //

// Search

app.post('/search', function(req,res){
    
        let sql = 'SELECT * FROM cheese WHERE Name LIKE  "%'+req.body.search+'%" ';
            let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        console.log(req.body.search);
        res.render('products', {result})
        
    });
    
    
    
    
})



// Search End