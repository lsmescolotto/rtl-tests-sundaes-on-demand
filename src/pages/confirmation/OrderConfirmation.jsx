import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";

export default function OrderConfirmation({ setOrderPhase }) {
  const { resetOrder } = useOrderDetails();
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    axios
      // in a real app we would get order details from context
      // and send with POST
      .post(`http://localhost:3030/order`, { signal: controller.signal })
      .then((response) => {
        setOrderNumber(response.data.orderNumber);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") setError(true);
      });

    //abort axios call on component unmount
    return () => {
      controller.abort();
    };
  }, []);

  function handleClick() {
    // clear the order details
    resetOrder();

    // send back to order page
    setOrderPhase("inProgress");
  }

  const newOrderButton = <Button onClick={handleClick}>New order</Button>;

  if (error) {
    return (
      <>
        <AlertBanner message={null} variant={null} />
        {newOrderButton}
      </>
    );
  }

  if (orderNumber) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Thank You!</h1>
        <p>Your order number is {orderNumber}</p>
        <p style={{ fontSize: "25%" }}>
          as per our terms and conditions, nothing will happen now
        </p>
        {newOrderButton}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}
