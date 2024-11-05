import { test, expect } from "../support";

test.describe("Map Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("map should display Honduras", async ({ mapLocator }) => {
    const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);

    await expect(hondurasLocator).toBeVisibleOnMap();
  });

  // test("map should display popup after click on Honduras label", async ({ mapLocator, page }) => {
  //   const hondurasCountryLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);
  //   const hondurasLabelLocator = mapLocator(`map[id=mainMap] layer[id=countries-label] filter["all", ["==", ["get", "ABBREV"], "Hond."]]`);

  //   //Fit map to Honduras country fill
  //   await hondurasCountryLocator.fitMap();
  //   await hondurasLabelLocator.click();

  //   await expect(page.locator(".info-popup__country")).toContainText("Honduras");
  // });

  // test("map should display country labels", async ({ mapLocator }) => {
  //   const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries-fill] filter["all", ["==", ["get", "fid"], 136]]`);

  //   await hondurasLocator.fitMap({ padding: { left: 50, right: 50, top: 50, bottom: 50} });

  //   const countryDots = mapLocator(`map[id=mainMap] layer[id=countries-label]`).merge(); //merge all elements bbox;

  //   await expect(await countryDots.screnshoot({ expose: { backgroundColor: "red" } })).toMatchSnapshot("country-label.png");
  // });

  // test("map should display cities icons after button clicked", async ({ mapLocator, mapController, page }) => {
  //   const citiesIcons = mapLocator(`map[id=mainMap] layer[id=center-dot]`);
  //   const controller = mapController('mainMap');

  //   await controller.waitToMapStable();
    
  //   await Promise.all([
  //     controller.waitToMapRepaint(),
  //     page.locator('#showDotButton').click()
  //   ]);

  //   await expect(await citiesIcons.screnshoot({ expose: { backgroundColor: "blue" }, padding: 20 })).toMatchSnapshot("display-dot.png");
  // });
});
