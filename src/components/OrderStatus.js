import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";


export const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("https://ecommerceapis-ro84.onrender.com/api/admin/orders")
        .then((response) => {
          const sortedOrders = response.data.sort((a, b) => {
            return a.shipped === b.shipped ? 0 : a.shipped ? 1 : -1;
          });
          setOrders(sortedOrders);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchOrders(); 
    const interval = setInterval(fetchOrders, 10000); 

    return () => clearInterval(interval); 
  }, []);

  const handleMarkAsShipped = (orderId) => {
    axios
      .put(
        `https://ecommerceapis-ro84.onrender.com/api/admin/orders/${orderId}/ship`
      )
      .then((response) => {
        const updatedOrders = orders
          .map((order) => {
            if (order._id === orderId) {
              return { ...order, shipped: true };
            }
            return order;
          })
          .sort((a, b) => {
            return a.shipped === b.shipped ? 0 : a.shipped ? 1 : -1;
          });
        setOrders(updatedOrders);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            className="mb-3"
            style={{
              backgroundColor: order.shipped ? "#ddd" : "#28a745",
              color: order.shipped ? "black" : "white",
            }}
          >
            <Card.Body>
              <Card.Title>Order ID: {order.orderId}</Card.Title>
              <Card.Subtitle
                className="mb-2"
                style={{
                  color: order.shipped ? "black" : "#ebeddf",
                }}
              >
                Customer Name:{" "}
                <strong style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  {order.user.username}
                </strong>
                <br />
                <span style={{ fontSize: "0.9em" }}>{order.user.email}</span>
              </Card.Subtitle>
              <ListGroup variant="flush">
                {order.items.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{
                      backgroundColor: order.shipped ? "#ddd" : "#28a745",
                      color: order.shipped ? "black" : "white",
                    }}
                  >
                    {item.product ? (
                      <>
                        <strong>{item.product.name}</strong> - $
                        {item.product.price}
                        <br />
                        Category: {item.product.category}
                        <br />
                        Quantity: {item.quantity}
                      </>
                    ) : (
                      "Product details not available"
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant={order.shipped ? "outline-dark" : "primary"}
                onClick={() => !order.shipped && handleMarkAsShipped(order._id)}
                disabled={order.shipped}
                className="mt-2"
              >
                {order.shipped ? "Shipped" : "Mark as Shipped"}
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};
