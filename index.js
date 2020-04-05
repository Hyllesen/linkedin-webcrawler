const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function main() {
  let linksToVisit = ["/in/stefanhyltoft"];
  const visitedLinks = [];
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/uas/login");
  await page.type("#username", "stefanhyltoft@gmail.com");
  await page.type("#password", "************");
  await page.click(".btn__primary--large.from__button--floating");

  while (linksToVisit.length > 0) {
    const currentUrl = linksToVisit.pop();
    if (visitedLinks.includes(currentUrl)) continue;
    await page.goto("https://www.linkedin.com" + currentUrl);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const newLinksToVisit = $(".pv-browsemap-section__member")
      .map((index, element) => $(element).attr("href"))
      .get();
    console.log(newLinksToVisit);
    linksToVisit = [...linksToVisit, ...newLinksToVisit];
    visitedLinks.push(currentUrl);
    await sleep(5000);
  }
}

async function sleep(miliseconds) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

main();
