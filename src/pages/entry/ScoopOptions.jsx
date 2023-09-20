import Col from "react-bootstrap/Col";

const ScoopOptions = ({ name, imagePath }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <img src={imagePath} alt={`${name} scoop`} />
    </Col>
  );
};

export default ScoopOptions;
