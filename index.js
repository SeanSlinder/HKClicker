require("dotenv").config();
const puppeteer = require("puppeteer");

(async () => {
  const url = "https://api.hamsterkombat.io/clicker/tap";
  const token = process.env.TOKEN;
  const data = {
    count: 600,
    availableTaps: 8000,
    timestamp: new Date().getTime(),
  };

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  try {
    await page.goto("https://hamsterkombat.io", {
      timeout: 15000, // 15 seconds
      waitUntil: "networkidle0", // Wait until there are no more than 0 network connections for at least 500 ms
    });
    console.log("Success: site navigation");

    const tap = async () => {
      try {
        await page.evaluate(() => {
          fetch("https://api.hamsterkombat.io/clicker/buy-boost", {
            headers: {
              accept: "application/json",
              "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
              authorization:
                "Bearer 1719156520425OXQDjyEGhHDvsavuH7xRpTh4VVW3CagUJZyqFUQeASNdVi62mf6G0MSKbLQgnwda619270546",
              "content-type": "application/json",
              "sec-ch-ua":
                '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
              "sec-ch-ua-mobile": "?1",
              "sec-ch-ua-platform": '"Android"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "x-requested-with": "org.telegram.messenger",
            },
            referrer: "https://hamsterkombat.io/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: '{"boostId":"BoostFullAvailableTaps","timestamp":1719568982}',
            method: "POST",
            mode: "cors",
          });
        });
        await page.evaluate(
          (url, token, data) => {
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
            });
          },
          url,
          token,
          data
        );
        console.log(`Coins claimed at ${new Date()}`);
      } catch (error) {
        console.error("Tap error:", error);
      }
    };

    setInterval(tap, 60000);

    // Keep the Puppeteer script running indefinitely
    await new Promise(() => {});
  } catch (error) {
    console.error("Navigation error:", error);
  } finally {
    await browser.close();
  }
})();
