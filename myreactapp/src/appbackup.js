import React from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import './App.css';

function Header() {
  return (
    <header>
      <h1>HKU<br/>Computer Science<br/>Course Management</h1>
    </header>
  );
}

function Nav() 
{
  return <nav><div>Welcome administrator</div></nav>
}

function Footer() {
  return <footer><div><a href="#top">Back to top</a></div></footer>
}

function PrintProduct(props) {
  return (
    <div >
      <button onClick={() => props.test}>Testing</button>

      {props.products.map((product) => 
      (
       <div key={product._id}>
        
        <img className="prod_preview_image" src={product.productImage}/>
        <p className="prod_preview_name">Item: {product.name}</p>
        <p className="prod_preview_price">Price: {product.price}</p>
        </div> 
      ))}
  </div>
  );
}

class Initialpageweb extends React.Component 
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      products:[],
      loginstatus:[],
      test:"home"
    }
    this.showAllProducts = this.showAllProducts.bind(this);
    this.checklogin = this.showAllProducts.bind(this);
  }

  showAllProducts() 
  {
    $.getJSON("http://localhost:3001/loadpage?category=&searchstring=", function(loginstatus)
    {
      this.setState({products:loginstatus})
    }.bind(this))
  }

  checklogin()
  {
    $.getJSON("http://localhost:3001/getsessioninfo", function(product)
    {
      this.setState({products:product})
    }.bind(this))
  }

  componentDidMount() {
    this.showAllProducts()
    this.checklogin()
  }

  toggleShow(){
    console.log("clicked");
  }

  render() 
  {
    console.log(this.state.loginstatus);
    if (this.state.test =="home")
    {
      return (
        <React.Fragment>
          <Nav loginstatus={this.state.loginstatus}/>
          <PrintProduct products={this.state.products} test={this.toggleShow}/>
        </React.Fragment>
      );
    }

    else
    {
      return 
      (
        <React.Fragment>
          <p>testing</p>
        </React.Fragment>
      );
    }
  }

}

export default Initialpageweb;
