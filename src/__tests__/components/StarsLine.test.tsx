import React from "react";
import { render, screen } from "@testing-library/react";
import StarsLine from "@/components/layout/StarsLine";

jest.mock("@/svgs/icons", () => ({
  StarEmptyIcon16: "/icons/star-empty-16.svg",
  StarFilledIcon16: "/icons/star-filled-16.svg",
}));

describe("StarsLine", () => {
  test("renders full, half, and empty stars", () => {
    render(<StarsLine rating={4.5} />);

    expect(screen.getAllByAltText("filled star")).toHaveLength(4);
    expect(screen.getByAltText("half star")).toBeInTheDocument();
    expect(screen.queryAllByAltText("empty star")).toHaveLength(0);
  });
});
