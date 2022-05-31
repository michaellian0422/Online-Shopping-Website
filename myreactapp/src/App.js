import React from 'react';
import $ from 'jquery';
import './App.css';

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state =
    {
      catagory: "All",
      keyword: "",
      nav_keyword: "",
      nav_catagory: "All"
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatekeyword = this.updatekeyword.bind(this);
    this.selectchange = this.selectchange.bind(this);
    this.click_phones = this.click_phones.bind(this);
    this.click_tablets = this.click_tablets.bind(this);
    this.click_laptops = this.click_laptops.bind(this);
  }

  //search_submit(catagory, keyword)
  handleSubmit() {
    this.setState({ catagory: this.state.nav_catagory, keyword: this.state.nav_keyword }, () => {
      this.props.search_submit(this.state.catagory, this.state.keyword);
    });
  }

  updatekeyword(event) {
    this.setState({ nav_keyword: event.target.value })
  }

  selectchange(event) {
    this.setState({ nav_catagory: event.target.value })
  }
  click_phones() {
    this.setState({ keyword:"", catagory: "Phones" }, () => {
      this.props.search_submit(this.state.catagory, this.state.keyword);
    });
  }
  click_tablets() {
    this.setState({ keyword:"", catagory: "Tablets" }, () => {
      this.props.search_submit(this.state.catagory, this.state.keyword);
    });
  }
  click_laptops() {
    this.setState({ keyword:"", catagory: "Laptops" }, () => {
      this.props.search_submit(this.state.catagory, this.state.keyword);
    });
  }


  render() {
    if (this.props.username == null) {
      return (
        <div >
          <ul>
            <li>
              <a href="#" onClick={() => this.click_phones()}>Phones</a>
            </li>

            <li>
              <a href="#" onClick={() => this.click_tablets()}>Tablets</a>

            </li>
            <li>
              <a href="#" onClick={() => this.click_laptops()}>Laptops</a>

            </li>

            <li>
              <select className="nav_catagory" name="category" id="category" onChange={this.selectchange} value={this.state.nav_catagory}>
                <option value="All">All</option>
                <option value="Phones">Phones</option>
                <option value="Tablets">Tablets</option>
                <option value="Laptops">Laptops</option>
              </select>
            </li>

            <li>
              <input type="text" id="search" name="search" value={this.state.nav_keyword} onChange={this.updatekeyword} />
              <input type="submit" name="submit" value="Submit" onClick={() => this.handleSubmit()}></input>
            </li>

            <li className="nav_login">
              <a href="#" onClick={this.props.nav_onClick}>Sign in</a>

            </li>

          </ul>



        </div>
      );
    }
    else {
      return (

        <div className="Nav">

          <div >
            <ul>
              <li>
                <a href="#" onClick={() => this.click_phones()}>Phones</a>
              </li>

              <li>
                <a href="#" onClick={() => this.click_tablets()}>Tablets</a>

              </li>
              <li>
                <a href="#" onClick={() => this.click_laptops()}>Laptops</a>

              </li>

              <li>
                <select className="nav_catagory" name="category" id="category" onChange={this.selectchange} value={this.state.catagory}>
                  <option value="All">All</option>
                  <option value="Phones">Phones</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Laptops">Laptops</option>
                </select>
              </li>

              <li>
                <input type="text" id="search" name="search" value={this.state.keyword} onChange={this.updatekeyword} />
                <input type="submit" name="submit" value="Submit" onClick={() => this.handleSubmit()}></input>
              </li>

              <li>
                <a className="nav_cart" href="#" onClick={() => this.props.cart_click()}>🛒 {this.props.totalprod} in Cart</a>
              </li>

              <li className="nav_logout">
                <a href="#" onClick={this.props.logout}>(Logout)</a>


              </li>

              <li className="nav_logout">
                <div className="nav_user">Hello, {this.props.username}</div>


              </li>

            </ul>

          </div>
        </div>
      )
    }
  }
}

class Productpage extends React.Component {
  constructor(props) {
    super(props)
    this.state =
    {
      productinfo: [{ manufacturer: null, description: null }],
      purchase_quantity: 1,
      purchase_success: null
    }
    this.showTargetProduct = this.showTargetProduct.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handle_continue = this.handle_continue.bind(this);
  }

  componentDidMount() {
    this.showTargetProduct();
  }


  showTargetProduct() {
    $.getJSON("http://localhost:3001/loadproduct/" + this.props.targetproduct.id, function (docs) {
      this.setState({ productinfo: docs })
    }.bind(this))
  }

  updateInput(event) {
    this.setState({ purchase_quantity: event.target.value })
  }

  handleSubmit() {
    $.ajax
      ({
        url: 'http://localhost:3001/addtocart',
        type: 'PUT',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { "productId": this.props.targetproduct.id, "quantity": this.state.purchase_quantity },
        success: function (data) {
          this.props.check_login();
          this.setState({ purchase_success: 1 });
        }.bind(this),
      });
  }

  handle_continue() {
    this.setState({ purchase_success: null })
    this.setState({ purchase_quantity: 1 })
  }
  render() {
    if (this.state.purchase_success == 1) {
      return (
        <div className="✓ added_to_cart">
          <img src={this.props.targetproduct.image}></img>
          <p>Added to cart </p>
          <a href="#" onClick={() => this.handle_continue()}>continue browsing&gt;</a>
        </div>
      )
    }
    else {
      if (this.props.username == null) {
        return (
          <div className="product_view" id="container">
            <img className="prodcut_image" src={this.props.targetproduct.image}></img>
            <div className="product_data">
            <div className="product_name">Name: {this.props.targetproduct.name}</div>
            <div className="product_price">Price: {this.props.targetproduct.price}</div>
            <div className="product_manufacturer">Manufacturer: {this.state.productinfo[0].manufacturer}</div>
            <div className="prodcut_desc">Description: {this.state.productinfo[0].description}</div>
          </div>
          <div className="product_buy_cart">
            <div className="addtocart"><label for="prod_quan">Quantity: </label><input id={this.props.targetproduct.id} className="prod_quan" type="number" min="0" defaultValue="1"></input></div>
            <input className="product_submit" type="submit" onClick={() => this.props.nav_onClick()} ></input>
          </div>
          <footer id="footer">
            <a className="product_goback" href="#" onClick={() => this.props.goback()}>Go back</a>
            </footer>
          </div>
        );
      }
      else {
        return (
          <div className="product_view" id="container">
            <img className="prodcut_image" src={this.props.targetproduct.image}></img>
            <div className="product_data">
            <div className="prodcut_name">Name: {this.props.targetproduct.name}</div>
            <div className="prodcut_price">Price: {this.props.targetproduct.price}</div>
            <div className="prodcut_manufacturer">Manufacturere: {this.state.productinfo[0].manufacturer}</div>
            <div className="prodcut_desc">Description: {this.state.productinfo[0].description}</div>
          </div>
          <div className="product_buy_cart">
            <div className="product_addtocart"><label for="prod_quan">Quantity: </label><input id={this.props.targetproduct.id} onChange={this.updateInput} className="prod_quan" type="number" min="0" defaultValue="1"></input></div>
            <input className="product_submit" type="submit" onClick={() => this.handleSubmit()} ></input>
          </div>
            <footer id="footer">
            <a className="product_goback" href="#" onClick={() => this.props.goback()}>Go back</a>
            </footer>
          </div>
        )
      }
    }
  }

}


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "" }
    this.handle_username_Change = this.handle_username_Change.bind(this)
    this.handle_pw_Change = this.handle_pw_Change.bind(this);
    this.message = " ";
  }

  handle_username_Change(event) {
    this.setState
      (
        { username: event.target.value }
      );
  }

  handle_pw_Change(event) {
    this.setState
      (
        { password: event.target.value }
      );
  }

  login() {
    if (this.state.username =="")
    {
      this.setState({message: "You must enter username and password"})
    }
    else{
    $.ajax
      ({
        url: 'http://localhost:3001/signin',
        type: 'POST',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data:
        {
          'username': this.state.username,
          'password': this.state.password
        },
        success: function (data) {
          if (data.totalnum != null) {
            this.setState({ loginsuccessful: true });
            this.props.login_goback();
          }
          else {
            this.setState({ message: data })
          }
        }.bind(this),
      });
    }
  }


  render() {
    return (
      
      <div>
        <div className="login_message" id="login_message">{this.state.message}</div>
      <div className="loginbody">
        <div className="login_part">
          <div className="login_ui">
            <label htmlFor="username">User Name:</label>
            <input type="text" id="username" name="username" value={this.state.username} onChange={this.handle_username_Change} /></div>

          <div className="login_ui">
            <label htmlFor="password">Password:  </label>
            <input type="password" id="password" name="password" value={this.state.password} onChange={this.handle_pw_Change} />
          </div>

          <div className="submit_button">
            <input className="login_submit" type="submit" value="Submit" onClick={() => this.login()} />
          </div>
          <div id="login_back"><a href="#" onClick={() => this.props.login_goback()}>Go back</a></div></div>
        </div>
      </div>
    );
  }

}

class Shopping_cart extends React.Component {
  constructor(props) {
    super(props)
    this.state =
    {
      success: null,
      cart: null,
      sum: 0
    }
    this.check_cart = this.check_cart.bind(this);
    this.cal = this.cal.bind(this);
    this.handle_value_change = this.handle_value_change.bind(this);
    this.pre_check_login = this.pre_check_login.bind(this);
    this.pre_cart_unclick = this.pre_cart_unclick.bind(this);
  }

  componentDidMount() {
    this.check_cart()
    this.cal()
  }

  cal() {
    var tempsum = 0;
    if (this.state.cart != null) {
      {
        this.state.cart.products.map((data) => {
          tempsum += data.price * data.quantity;
          this.setState({ sum: tempsum });
        })
      }
    }
    else {
      this.setState({ sum: 0 })
    };
  }

  handle_value_change(event) {
    if (event.target.value == 0) {
      {
        $.ajax
          ({
            url: 'http://localhost:3001/deletefromcart/' + event.target.id,
            type: 'DELETE',
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (data) {
              this.check_cart()
              this.props.check_login();
            }.bind(this),
          });

      }
    }

    else {
      $.ajax
        ({
          url: 'http://localhost:3001/updatecart',
          type: 'PUT',
          xhrFields: { withCredentials: true },
          crossDomain: true,
          data: { "productId": event.target.id, "quantity": event.target.value },
          success: function (data) {
            this.props.check_login();
            this.check_cart()
          }.bind(this),
        });

    }
  }
  checkout() {
    $.ajax
      ({
        url: 'http://localhost:3001/checkout',
        type: 'GET',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (data) {
          if (data == "") {
            this.setState({ success: 1 });
            this.props.check_login();
          }
        }.bind(this),
      });
  }
  check_cart() {
    $.ajax
      ({
        url: 'http://localhost:3001/loadcart',
        type: 'GET',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (data) {
          if (data == "") {
            this.setState({ cart: null })
          }
          else {
            this.setState({ cart: data })
            var tempsum = 0;
            if (this.state.cart != null) {
              {
                this.state.cart.products.map((data) => {
                  tempsum += data.price * data.quantity;
                  this.setState({ sum: tempsum });
                })
              }
            }
            else {
              this.setState({ sum: 0 })
            };
          }
        }.bind(this),
      });
  }


  pre_check_login() {
    this.props.check_login();
    this.checkout();
  }

  pre_cart_unclick() {
    this.setState({ cart: null });
    this.props.cart_unclick();
  }

  render() {
    if (this.state.success != null && this.state.cart != null) {
      return <div className="purchase_success">
        <p className="success_msg">✓You have successfully placed order for {this.state.cart.totalnums} item(s)</p>
        <p className="success_msg">${this.state.sum} paid</p>
        <a className="cart_go_back" href="#" onClick={() => this.pre_cart_unclick()}>continue browsing&gt;</a></div>
    }
    else if (this.state.cart == null) {
      return <p>You car is empty</p>
    }
    else {
      var total_sum = 0;
      return (
        <div className="product_view" >
          <h1 className="cart_title" >Shopping cart</h1>
        
          {this.state.cart.products.map((data) =>
          (
            <div className="prod_preview_div">
            <div id={data.productId} key={data.productId}>

              <img className="prod_cart_image" src={data.productimage} />
              <div className="prod_cart_data">
              <p className="prod_cart_name">Item: {data.name}</p>
              <p className="prod_cart_price">Price: {data.price}</p>
              <input id={data.productId} className="prod_cart_quan" type="number" min="0" defaultValue={data.quantity} onChange={this.handle_value_change}></input>
              </div>
            </div>
            </div>
          ))}
          <p ClassName="cart_message">Cart subtotal ({this.state.cart.totalnums} item(s)): ${this.state.sum} </p>
          <button className="cart_submit" onClick={() => this.pre_check_login()}>Proceed to check out</button>
        </div>
      )
    }
  }
}


class Homepage extends React.Component {
  constructor(props) {
    super(props)
    this.state =
    {
      products: [],
      test: "",
    }
  }

  render() {
    return (
      <div className="prod_preview_div" >
        {this.props.productlist.map((product) =>
        (
          <div className="prod_preview_container" key={product._id}>

            <a href="#" className="prod_preview_link">
              <img className="prod_preview_image" onClick={() => this.props.imageClick(product._id, product.name, product.price, product.productImage)} src={product.productImage} />
            </a>
            <p className="prod_preview_name">{product.name}</p>
            <p className="prod_preview_price">Price: {product.price}</p>
          </div>
        ))}

      </div>
    );
  }
}

class Content extends React.Component {
  constructor(props) {
    super(props)

    this.state =
    {
      username: null,
      test: "",
      loginclick: null,
      productclick: null,
      cartclick: null,
      targetproduct: null,
      targetcategory: "All",
      totalprod: null,
      keyword: "",
      catagory: "All",
      productlist: []
    }
    this.checklogin = this.checklogin.bind(this);
    this.nav_clicklogin = this.nav_clicklogin.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.goback = this.goback.bind(this);
    this.login_goback = this.login_goback.bind(this);
    this.logout = this.logout.bind(this);
    this.cart_click = this.cart_click.bind(this);
    this.cart_unclick = this.cart_unclick.bind(this);
    this.search_submit = this.search_submit.bind(this);
    this.showAllProducts = this.showAllProducts.bind(this);
  }

  showAllProducts() {
    if (this.props.keyword == "All" && this.props.catagory == "") {
      $.getJSON("http://localhost:3001/loadpage?category=&searchstring=", function (docs) {
        this.setState({ productlist: docs })
      }.bind(this))
    }
    else {
      $.getJSON("http://localhost:3001/loadpage?category=" + this.state.catagory + "&searchstring=" + this.state.keyword, function (docs) {
        this.setState({ productlist: docs })
      }.bind(this))
    }
  }

  checklogin() {
    $.ajax
      ({
        url: 'http://localhost:3001/getsessioninfo',
        type: 'GET',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (data) {
          if (data == "") {
            this.setState({ userid: null })
          }
          else {
            this.setState({ username: data.username })
            this.setState({ totalprod: data.totalnum })
          }
        }.bind(this),
      });
  }

  search_submit(catagory, keyword) {
    this.setState({ targetproduct: null });
    this.setState({ cartclick: null });
    this.setState({ catagory: catagory });
    this.setState({ keyword: keyword }, () => {
      this.showAllProducts();
    });
  }
  componentDidMount() {
    this.checklogin();
    this.showAllProducts();
  }

  nav_clicklogin() {
    this.setState({ loginclick: 1 });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  cart_click() {
    this.setState({ targetproduct: null });
    this.setState({ cartclick: 1 });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  cart_unclick() {
    this.setState({ cartclick: null });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  handleChange = (event) => {
    this.setState({ targetcategory: event.target.value });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  };

  imageClick(id, name, price, image) {
    this.setState({ targetproduct: { id: id, name: name, price: price, image: image } });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  goback() {
    this.setState({ targetproduct: null });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  login_goback() {
    this.checklogin();
    this.setState({ loginclick: null });
    this.setState({ catagory: "All", keyword: "" });
    this.showAllProducts()
  }

  logout() {
    $.ajax
      ({
        url: 'http://localhost:3001/signout',
        type: 'GET',
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (data) {
          this.setState({ username: null })
          this.setState({ cartclick: null })
        }.bind(this),
      });
  }


  render() {
    if (this.state.loginclick == 1) {
      return (
        <React.Fragment>
          <Login login_goback={this.login_goback} />
        </React.Fragment>
      );
    }
    else if (this.state.targetproduct != null) {
      return (
        <React.Fragment>
          <Nav search_submit={this.search_submit} cart_unclick={this.cart_unclick} nav_onChange={this.handleChange} nav_onClick={this.nav_clicklogin} username={this.state.username} logout={this.logout} totalprod={this.state.totalprod} cart_click={this.cart_click} />
          <Productpage targetproduct={this.state.targetproduct} goback={this.goback} nav_onClick={this.nav_clicklogin} username={this.state.username} check_login={this.checklogin} />
        </React.Fragment>

      );
    }
    else if (this.state.cartclick != null) {
      return (
        <React.Fragment>
          <Nav search_submit={this.search_submit} cart_unclick={this.cart_unclick} nav_onChange={this.handleChange} nav_onClick={this.nav_clicklogin} username={this.state.username} logout={this.logout} totalprod={this.state.totalprod} cart_click={this.cart_click} />
          <Shopping_cart check_login={this.checklogin} cart_unclick={this.cart_unclick} />
        </React.Fragment>
      );
    }
    else {
      return (
        <React.Fragment>
          <Nav search_submit={this.search_submit} cart_unclick={this.cart_unclick} nav_onChange={this.handleChange} nav_onClick={this.nav_clicklogin} username={this.state.username} logout={this.logout} totalprod={this.state.totalprod} cart_click={this.cart_click} />
          <Homepage productlist={this.state.productlist} catagory={this.state.catagory} keyword={this.state.keyword} products={this.state.products} productclick={this.state.productclick} imageClick={this.imageClick} />
        </React.Fragment>
      );



    }
  }
}

class Initialpageweb extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {

    }
  }

  render() {

    return (
      <React.Fragment>
        <Content />
      </React.Fragment>
    );

  }

}

export default Initialpageweb;
