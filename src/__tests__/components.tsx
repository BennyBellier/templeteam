import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactBar from "../components/contact_bar";
import { ThemeButton } from "../components/elements";

describe("Contact Section", () => {
  it("Should render contact text", () => {
    render(<ContactBar />);
    expect(screen.getByText("CONTACT")).toBeInTheDocument();
    expect(screen.getByText(/UNE DEMANDE D'INFOS?/)).toBeInTheDocument();
    expect(screen.getByText(/DES RENSEIGNEMENTS?/)).toBeInTheDocument();
  });
  it("Should render some contact links", () => {
    render(<ContactBar />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});

describe("Theme button", () => {
  it("Should render the theme button", () => {
    render(<ThemeButton type={0} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it("Should render the theme button", () => {
    render(<ThemeButton type={0} />);
    expect(screen.getByTestId('moon-theme')).toBeInTheDocument();
    expect(screen.getByTestId('moon')).toBeInTheDocument();
  });

  it("Should render the theme button with the right text", () => {
    render(<ThemeButton type={0} />);
    expect(screen.getByText("Thème sombre")).toBeInTheDocument();
  });
  it("Should render the theme button with the right text", () => {
    render(<ThemeButton type={0} />);
    expect(screen.getByText("Thème sombre")).toBeInTheDocument();
  });
});
