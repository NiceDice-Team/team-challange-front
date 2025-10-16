import { CustomButton } from "@/components/shared/CustomButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


test("renders button and handles click", async () => {
  const user = userEvent.setup();
  render(<CustomButton>Click me</CustomButton>);
  const btn = screen.getByRole("button", { name: /click me/i });
  await user.click(btn);
  expect(btn).toBeInTheDocument();
});