var conn = new Mongo();

var db = conn.getDB("assignment2");

db.productCollection.insert({name: 'iPhone 13', 'category': 'Phones', 'price': 8000,
manufacturer: 'Apple Inc.', 'productImage': 'images/iPhone13.jpg', 'description': 'Most advanced dual‑camera system ever.'})

db.userCollection.insert({'username': 'Jack', 'password': '654321', 'cart':[{'productId': 'xxx','quantity': 1}, {'productId': 'xxx', 'quantity': 2}], 'totalnum': 3})