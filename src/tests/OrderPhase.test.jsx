import { render, screen } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  //Render app
  const { unmount } = render(<App />);
  const user = userEvent.setup();

  //Rdd ice cream scoops and toppings
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: /chocolate$/i,
  });
  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "2");
  //do not neeed to await, because both chocolate and vanilla come in the same request
  const vanillaScoop = screen.getByRole("spinbutton", {
    name: /vanilla$/i,
  });
  await user.clear(vanillaScoop);
  await user.type(vanillaScoop, "1");

  const mAndMsTopping = await screen.findByRole("checkbox", { name: /m&ms$/i });
  await user.click(mAndMsTopping);

  //Find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae!$/i });
  await user.click(orderButton);

  //Check summary information based on order
  //subtotals
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  //option items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("M&Ms")).toBeInTheDocument();

  //Accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);

  //Click "confirm order"
  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  //Expect loading to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  //Check confirmation page text
  //async because there is a request between summary and confirmation pages
  const thankYouHeading = await screen.findByRole("heading", {
    name: "Thank You!",
  });
  expect(thankYouHeading).toBeInTheDocument();

  //Expect that loading has disappeared
  //queryBy...: Returns the matching node for a query, and return null if no elements match. This is useful for asserting an element that is not present. Throws an error if more than one match is found (use queryAllBy instead if this is OK). (RTL docs)

  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  //Check order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  //Click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", { name: /new order$/i });
  await user.click(newOrderButton);

  //Check that scoops and toppings subtotals have been reset
  const scoopsSubtotal = await screen.findByText("Scoops: $0.00");
  expect(scoopsSubtotal).toBeInTheDocument();

  const toppingsSubtotal = await screen.findByText("Toppings: $0.00");
  expect(toppingsSubtotal).toBeInTheDocument();

  //Unmount the compoent to trigger cleanuo and avoid "not wrapped in act()" error
  unmount();
});
