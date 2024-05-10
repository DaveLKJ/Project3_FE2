import React from "react";
import { OrderStatus } from "./OrderStatus";

const Home = () => {
  return (
    <div className="mx-4 mt-3">
      <h1>Orders</h1>
      <OrderStatus />
    </div>
  );
};

export default Home;
