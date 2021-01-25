


var  express = require('express')
var authController = require("./controllers/AuthController").authController;

const PORT = 3000

const app = express()


var MongoClient = require('mongodb').MongoClient;
var DB;
const dbName = "facechal"
const dbUrl = "mongodb://localhost:27017"

MongoClient.connect( dbUrl + "/" + dbName , function(err, db) {
  if (err) {
    throw err;
  }
  DB = db.db(dbName);
  DB.collection("users").find().toArray()
    .then(rows => {
      console.log("Les resultats");
      console.log(rows);
    })
});

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
 
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  collection: 'mySessions'
});
 
// Catch errors
store.on('error', function(error) {
  console.log(error);
});
 
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


//console.log(authController);
app.use(express.json())

app.post("/api/sign-up", (req, res)=>{
  //console.log(req.body);
  authController.check(req.body, DB)
    .then((user)=>{
      req.session.user = user
      console.log(req.session.user);
      res.json(user)
    })
    .catch(err => {
      if(err){
        console.log(err);
        res.json({})
      }
    })
})

app.post("/api/sign-in", (req, res)=>{
  //console.log(req.body);
  authController.register(req.body, DB)
    .then( state => res.json(state))
    .catch ( err => {
      console.log(err);
      res.json(false)
    })

})


app.listen( PORT, ()=>{
    console.log("Server Node Red is running !!");
});


