import { render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  it("renders the product name", () => {
    render(<SiteHeader />);
    expect(screen.getByText("THE MEN'S FORMULA")).toBeInTheDocument();
  });
});
