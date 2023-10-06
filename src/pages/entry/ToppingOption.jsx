import { Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { useOrderDetails } from "../../contexts/OrderDetails";

const ToppingOption = ({ imagePath, name }) => {
  const { updateItemCount } = useOrderDetails();

  const handleChange = (e) => {
    updateItemCount(name, e.target.checked ? 1 : 0, "toppings");
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <img src={imagePath} alt={`${name} topping`} />
      <Form.Group controlId={`${name}-topping-checkbox`}>
        <Form.Check type="checkbox" onChange={handleChange} label={name} />
      </Form.Group>
    </Col>
  );
};
export default ToppingOption;
