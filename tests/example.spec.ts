import { test, expect } from "../support";

test.describe("Map Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("map should display Honduras", async ({ mapLocator }) => {
    const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);

    await expect(hondurasLocator).toBeVisibleOnMap();
  });

  test("map should display popup after click on Honduras label", async ({ mapLocator, page }) => {
    const hondurasCountryLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);
    const hondurasLabelLocator = mapLocator(`map[id=mainMap] layer[id=countries-label] filter["all", ["==", ["get", "ABBREV"], "Hond."]]`);

    //Fit map to Honduras country bbox
    await hondurasCountryLocator.fitMap();
    await hondurasLabelLocator.click();

    await expect(page.locator(".info-popup__country")).toContainText("Honduras");
  });

  test("map should display country labels", async ({ mapLocator }) => {
    const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);

    // Fit map to Honduras and add padding do display other countries labels
    await hondurasLocator.fitMap({ padding: { left: 50, right: 50, top: 50, bottom: 50} });

    const countriesLabels = mapLocator(`map[id=mainMap] layer[id=countries-label]`).merge(); //merge all elements bbox;

    await expect(await countriesLabels.screnshoot({ expose: { backgroundColor: "red" } })).toMatchSnapshot("country-label.png")
  });

  test("map should display dot on map when 'Show dot' button clicked", async ({ mapLocator, mapController, page }) => {
    const dotLocator = mapLocator(`map[id=mainMap] layer[id=center-dot]`);
    const controller = mapController('mainMap');

    await controller.waitToMapLoaded();

    await page.locator('#showDotButton').click()

    await expect(await dotLocator.screnshoot({ expose: { backgroundColor: "blue" }, padding: 20 })).toMatchSnapshot("display-dot.png");
  });

  // Test simulating loading server data, this demonstrate how waitToMapRepaint() wait to map repaint (repaint + stable)
  test("map should display dot on map when 'Show dot delayed' button clicked", async ({ mapLocator, mapController, page }) => {
    test.slow();
    
    const dotLocator = mapLocator(`map[id=mainMap] layer[id=center-dot]`);
    const controller = mapController('mainMap');

    // Wait to first map paint done
    await controller.waitToMapStable();

    await Promise.all([
      // Wait to map repaint (second paint) after dot added to map
      controller.waitToMapRepaint(),
      page.locator('#showDotDelayButton').click(),
    ]);

    await expect(await dotLocator.screnshoot({ expose: { backgroundColor: "blue" }, padding: 20 })).toMatchSnapshot("display-dot.png");
  });
});
