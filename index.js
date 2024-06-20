const puppeteer = require("puppeteer");

(async () => {
  const url = "https://api.hamsterkombat.io/clicker/tap";
  const token =
    "1718473645362AaDOx8CeJZSo3skqXuVVLavmlpQG0F1V9GtztMnVirAEUMbkNLDKgvKSVI74fiTO619270546";
  const data = {
    count: 500,
    availableTaps: 7500,
    timestamp: new Date().getTime(),
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://hamsterkombat.io");

  await page.evaluate(
    (url, token, data) => {
      const tap = () => {
        fetch(url, {
          method: "POST",
          headers: {
            accept: "application/json",
            "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Android WebView";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-requested-with": "org.telegram.messenger",
          },
          referrer: "https://hamsterkombat.io/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: JSON.stringify(data),
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data.clickerUser.lastSyncUpdate);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };

      setInterval(tap, 5000);
    },
    url,
    token,
    data
  );

  // Keep the Puppeteer script running indefinitely
  await new Promise(() => {});
})();
