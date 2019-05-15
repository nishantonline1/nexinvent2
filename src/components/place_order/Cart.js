import React from "react";
import { connect } from "react-redux";
import { CardHeader, CardBody, Row, Col, Card } from "reactstrap";

function Cart({ supplier_map }) {
  const cart_supplier_rows = [];
  for (let supplier_id in supplier_map) {
    cart_supplier_rows.push(
      <CartSupplierRow
        key={supplier_id}
        supplier={supplier_map[supplier_id].supplier}
        cartItems={supplier_map[supplier_id].cart_items}
      />
    );
  }
  return <>{cart_supplier_rows}</>;
}

function mapStateToProps(state) {
  //making a map keyed with supplier
  var supplier_map = state.carts.results.reduce(function(map, obj) {
    map[obj.supplier.id] = { supplier: obj.supplier, cart_items: [] };
    return map;
  }, {});
  // filling each supplier with its cart_items
  state.carts.results.forEach(result => {
    supplier_map[result.supplier.id].cart_items.push(result);
  });

  // supplier map looks like:
  /*
  {
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     <supplier_id> : {
         supplier: <supplier Object>,
         cart_items: <Array of Cart Items>
     },
     ...
  }
  Each Cart Item object loooks like:
  {
      supplier: supplier Object,
      product: product Object,
      restaurant: restaurant Object,
      quantity: <number>,
      note: <String>
  }
  */
  return {
    supplier_map
  };
}

const mapDispatchToProps = {};

function CartSupplierRow({ supplier, cartItems }) {
  const cart_item_rows = [];
  cartItems.forEach(cartItem => {
    let {
      product: { name: product_name, price, unit },
      quantity
    } = cartItem;
    cart_item_rows.push(
      <CartItemRow
        key={cartItem.product.id}
        productName={product_name}
        price={price}
        unit={unit}
        quantity={quantity}
      />
    );
  });
  return (
    <>
      <Card>
        <CardHeader>{supplier.name}</CardHeader>
        {cart_item_rows}
      </Card>
    </>
  );
}

function CartItemRow({ productName, price, unit, quantity }) {
  return (
    <CardBody>
      <Row>
        <Col lg="9">
          <div className="h5">{productName}</div>
          &#8377; {price}/{unit}
          <br />
          <i className="fa fa-edit text-dark" /> Edit &nbsp;
          <i className="fa fa-trash text-danger" /> Remove
        </Col>
        <Col className="p-0" lg="3">
          <h4>{quantity}</h4>
        </Col>
      </Row>
    </CardBody>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
