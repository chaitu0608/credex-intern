import { expect, test } from "@playwright/test";

test("E2E-004 audit page has OG + Twitter card meta", async ({ request, page }) => {
  const audit = await request.post("/api/audit", {
    data: {
      tools: [{ tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    },
  });
  expect(audit.ok()).toBeTruthy();
  const { id } = await audit.json();

  await page.goto(`/audit/${id}`);

  const og = await page.locator('meta[property="og:title"]').getAttribute("content");
  const ogDesc = await page
    .locator('meta[property="og:description"]')
    .getAttribute("content");
  const tw = await page
    .locator('meta[name="twitter:card"]')
    .getAttribute("content");
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  const ogUrl = await page
    .locator('meta[property="og:url"]')
    .getAttribute("content");

  expect(og).toBeTruthy();
  expect(ogDesc).toBeTruthy();
  expect(tw).toBe("summary_large_image");
  expect(ogImage).toContain(`/audit/${id}/opengraph-image`);
  expect(ogImage).toMatch(/^https?:\/\//);
  expect(ogUrl).toContain(`/audit/${id}`);
});
