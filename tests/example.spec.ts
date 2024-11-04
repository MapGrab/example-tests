import { test, expect } from "../support";

test.describe("Map Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200");
  });

  test("map should display Honduras", async ({ mapLocator }) => {
    const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries] filter['==', ['get', 'fid'], 11]`);

    await expect(hondurasLocator).toBeVisibleOnMap();
  });

  test("map should display popup after click on Honduras", async ({ mapLocator, page }) => {
    const hondurasLocator = mapLocator(`map[id=mainMap] layer[id=countries] filter['==', ['get', 'fid'], 11]`);

    await hondurasLocator.click();

    await expect(page.locator("#info-popup")).toContainText("Honduras");
  });

  test("map should display cities dots", async ({ mapLocator }) => {
    const countryDots = mapLocator(`map[id=mainMap] layer[id=countries-dots]`).merge(); //merge all elements bbox;

    await expect(await countryDots.screnshoot({ expose: { backgroundColor: "red" } })).toMatchSnapshot("cities-dots.png");
  });

  test("map should display cities icons after button clicked", async ({ mapLocator, mapController, page }) => {
    const citiesIcons = mapLocator(`map[id=mainMap] layer[id=cities-icons]`).merge(); //merge all elements bbox;
    const controller = mapController('mainMap');

    await controller.waitToMapStable();
    
    await Promise.all([
      controller.waitToMapRepaint(),
      page.locator('#showCitiesButton').click()
    ]);

    await expect(await citiesIcons.screnshoot({ expose: { backgroundColor: "red" } })).toMatchSnapshot("cities-dots.png");
  });
});
