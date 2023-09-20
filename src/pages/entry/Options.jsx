import axios from "axios";
import { useEffect, useState } from "react";
import ScoopOption from "./ScoopOptions";

const Options = (optionType) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => {
        //handle error response
      });
  }, [optionType]);

  const ItemComponent =
    optionType === "scoops" ? ScoopOption : <div> no available option</div>;

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ));

  return <div>{optionItems}</div>;
};

export default Options;
