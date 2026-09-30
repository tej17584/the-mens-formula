import { render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  it("renders the product name", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: /The Men's Formula, inicio/i }),
    ).toBeInTheDocument();
  });
});
