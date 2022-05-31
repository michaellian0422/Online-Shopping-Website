var express = require('express');
var cookieParser = require("cookie-parser");
const { json } = require('express/lib/response');
const { xml } = require('jade/lib/doctypes');
var router = express.Router();
var monk = require("monk");
router.use(cookieParser());


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Test');
});

router.get('/loadpage', (req, res) => { 
	var db = req.db;
  var category = req.query.category;
  var searchstring = req.query.searchstring;

  console.log("Search String:" +searchstring)
  console.log("Category: " + category)
	var col = db.get('productCollection'); 
  if (category == "all" || category=="" || category =="All"){
    category = { $regex: ".*" + "" + ".*", $options: "i" }
  }
  else{
    category = { $regex: "^" + category+"$", $options: "i" }
  }

	col.find(
    {
      $and: [
        { category: category},
        { name: { $regex: ".*" + searchstring + ".*", $options: "i" } },
      ],
    },
  {fields: {"_id":1, "name":1, "price":1, "productImage":1}})
  .then((docs) => {
    res.json(docs);
	}).catch((error) => {
    res.json({errormsg:error});
  }); 
});

router.get('/loadproduct/:productid', (req, res) => { 
	var db = req.db;
  var productid = req.params.productid;

  console.log("Search productid: " +productid);
	var col = db.get('productCollection'); 

	col.find(
    {
     _id: productid
    },
  {fields: {"manufacturer":1, "description":1}})
  .then((docs) => {
    res.json(docs);
	})
  .catch((error) => {
    res.json({errormsg:error});
  }); 
});

router.post('/signin', (req, res) => {
  var db = req.db;
  var usercol = db.get('userCollection'); 
  var username = req.body.username;
  var password = req.body.password;
  usercol
    .findOne(
      {
        $and: [
          {username: { $regex: "^" + username + "\\b", "$options": "i"}},
          {password: password },
        ],
      },
      )
    .then((userdata) => {
      if (userdata == null) 
      {
        console.log("Login Failed")
        res.send("Login failure");
      } 
      else
      {
        console.log("Login Success")
        console.log(userdata._id)
        res.cookie("userID", userdata._id);
        res.json({totalnum:userdata.totalnum})
      }
  }).catch((error) => 
  {
    res.json({errormsg:error.message});
  });
})

router.get("/signout", (req, res) => {
  res.clearCookie("userID");
  res.send();
});

router.get("/getsessioninfo", (req, res) => {
  var db = req.db;
  var usercol = db.get('userCollection'); 
  console.log("User: " + req.cookies.userID);
  if (req.cookies.userID!= null)
  {
    usercol.findOne({_id:req.cookies.userID},{fields:{username:1, totalnum:1}})
    .then((docs)=>
    {
      res.json(docs);
    }) 
    .catch((error) => {
      res.json({errormsg:error});
    });
  }

  else
  {
    console.log("Not exist")
    res.send();
  }
});

// 要改
router.put("/addtocart", (req, res) => {
  var productId = req.body.productId;
  var quantity = req.body.quantity;
  quantity = parseInt(quantity)
  console.log(quantity)
  var db = req.db;
  var usercol = db.get('userCollection'); 
  var userID = monk.id(req.cookies.userID);
  usercol.findOne({_id:userID})
  .then((docs)=>
  {
    
    var newcart = docs.cart;
    var newtotalnum = docs.totalnum;
    var index = newcart.findIndex(obj => obj.productId==productId);
    if (index == -1)
    {
      newcart.push({productId:productId,quantity:quantity}); 
      newtotalnum += quantity;
    }
    else
    {
      newcart[index].quantity =  newcart[index].quantity + quantity ;
      newtotalnum += quantity;
    }
    console.log(newcart);
    usercol.update( {_id:userID }, {$set:{'cart':newcart, 'totalnum':newtotalnum}},{multi:true})
    .then((data)=>{
      res.json({'totalnum':newtotalnum});
    });

  }).catch((error) => {
    res.json({errormsg:error});
  });
});

//Return [{products:{productId, name, price, productimage, quantity}, totalnums: totalnum}]
router.get("/loadcart", (req, res) => {
  var db = req.db;
  var usercol = db.get('userCollection'); 
  var prodcol = db.get('productCollection'); 
  var userID = req.cookies.userID;
  usercol.findOne({_id:userID})
  .then((docs)=>
  {
    var product_response = []
    var promise_counter = 0
    for (let y in docs.cart)
    {
      product_jsonobj = {'productId':docs.cart[y].productId, 'quantity':docs.cart[y].quantity}
      product_response.push(product_jsonobj)
    }

    for (let x in docs.cart)
    {
      prodcol.findOne({_id:docs.cart[x].productId})
      .then((prod)=>
      {
        product_response[x]["name"] = prod.name;
        product_response[x]["price"] = prod.price;
        product_response[x]["productimage"] = prod.productImage;
        promise_counter += 1;

        if (promise_counter == docs.cart.length)
        {
          var response ={"products":product_response, "totalnums": docs.totalnum};
          res.json(response);
        }
      });
    }
  }).catch((error) => {
    res.json({errormsg:error});
  });
});


router.put("/updatecart", (req, res) => {
  var db = req.db;
  var usercol = db.get('userCollection'); 
  var userid = req.cookies.userID;
  var quantity = req.body.quantity;
  quantity = parseInt(quantity);
  var productId = req.body.productId;
  usercol.findOne({_id:userid})
  .then((userdata)=>
  {
    console.log(userdata);
    console.log("test")
    var index = -1;
    
    var origranl_quantity=0; 
    for (let key in userdata.cart) 
    {
      console.log(key);
      if (userdata.cart[key].productId == productId) 
      {
          origranl_quantity=userdata.cart[key].quantity;
          userdata.cart[key].quantity = quantity;
          index = 1;
          break;
      }
    }

    if (index == -1){
      userdata.cart.push({"productId":productId, "quantity":quantity})
    }

    userdata.totalnum = userdata.totalnum -origranl_quantity + quantity;

    usercol.update( {_id:userid }, {$set:{'cart':userdata.cart, 'totalnum':userdata.totalnum}},{multi:true})
    .then((data) => 
    {
      res.json({totalnum:userdata.totalnum});
    });
  }).catch((error) => {
    res.json({errormsg:error});
  });
});

router.delete('/deletefromcart/:productid', (req, res) => { 
	var db = req.db;
  var productid = req.params.productid;
  var userid = req.cookies.userID;
  var usercol = db.get('userCollection'); 
	usercol.findOne({_id:userid})
  .then((userdata) => 
  {
    console.log("test");
    console.log(userdata);
    var index = -1;
     for (let key in userdata.cart) 
    {
      if (userdata.cart[key].productId == productid) 
      {
          origranl_quantity=userdata.cart[key].quantity;
          index = userdata.cart.indexOf(userdata.cart[key])
          userdata.cart.splice(index, 1);
          userdata.totalnum -= origranl_quantity;
          index = 1;
          console.log(userdata.cart);
          break;
      }
    }
    if (index == -1){
      res.json("product not found on user cart");
    }
    else
    {
      usercol.update( {_id:userid }, {$set:{'cart':userdata.cart, 'totalnum':userdata.totalnum}},{multi:true})
    .then((data) => 
    {
      res.json({totalnum:userdata.totalnum});
    });
    }
  }).catch((error) => {
    res.json({errormsg:error});
  }); 
});


router.get('/checkout', (req, res) => {
  var db = req.db;
  var usercol = db.get('userCollection'); 
  var userid = req.cookies.userID;
  usercol.findOne({_id:userid})
  .then((userdata) => 
  {
    userdata.cart =[]
    userdata.totalnum = 0;
    usercol.update( {_id:userid }, {$set:{'cart':userdata.cart, 'totalnum':userdata.totalnum}},{multi:true})
    .then((data) => 
    {
      res.send();
    });
  }).catch((error) => {
    res.json({errormsg:error});
  });
});

module.exports = router;
