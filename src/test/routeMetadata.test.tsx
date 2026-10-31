import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Link, MemoryRouter } from "react-router-dom";
import RouteMetadata from "@/components/RouteMetadata";

it("replaces prerendered metadata across service, legal and home navigation", async () => {
  // Simulate the managed tags received in the initial static HTML response.
  document.head.innerHTML = '<link rel="canonical" href="https://blesk123.ru/" data-rh="true"><meta name="description" content="home" data-rh="true"><meta name="robots" content="index, follow" data-rh="true">';
  render(
    <HelmetProvider>
      <MemoryRouter>
        <RouteMetadata />
        <Link to="/uborka-kvartir-sochi?utm_source=yandex">service</Link>
        <Link to="/privacy">privacy</Link>
        <Link to="/calc">internal</Link>
        <Link to="/">home</Link>
      </MemoryRouter>
    </HelmetProvider>,
  );
  for (const [name, path, robots] of [
    ["service", "/uborka-kvartir-sochi", "index, follow"],
    ["privacy", "/privacy", "noindex, follow"],
    ["internal", "/calc", "noindex, follow"],
    ["home", "/", "index, follow"],
  ]) {
    fireEvent.click(screen.getByText(name));
    await waitFor(() => {
      const links = document.head.querySelectorAll('link[rel="canonical"]');
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute("href")).toBe(`https://blesk123.ru${path}`);
      expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe(robots);
      expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(`https://blesk123.ru${path}`);
    });
  }
});
