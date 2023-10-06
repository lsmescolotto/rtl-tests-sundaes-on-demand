import axios from "axios";
import { useEffect, useState } from "react";
import ScoopOption from "./ScoopOptions";
import ToppingOption from "./ToppingOption";
import Row from "react-bootstrap/Row";
import { pricePerItem } from "../../constants";
import { formatCurrency } from "../../utilities";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";

const Options = ({ optionType }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);

  const { totals } = useOrderDetails();

  useEffect(() => {
    //create an abort controller to attach to network request
    const controller = new AbortController();
    axios
      .get(`http://localhost:3030/${optionType}`, { signal: controller.signal })
      .then((response) => {
        return setItems(response?.data);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") setError(true);
      });
    //handle error response

    //abort axios call on component unmount
    return () => {
      controller.abort();
    };
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent =
    optionType === "scoops" ? (
      ScoopOption
    ) : optionType === "toppings" ? (
      ToppingOption
    ) : (
      <div> no available option</div>
    );

  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {formatCurrency(totals[optionType])}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
};

export default Options;
