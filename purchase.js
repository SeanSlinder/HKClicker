const API_URL = "https://api.hamsterkombat.io";
const AUTH_TOKEN =
  "1719156520425OXQDjyEGhHDvsavuH7xRpTh4VVW3CagUJZyqFUQeASNdVi62mf6G0MSKbLQgnwda619270546";

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
  Connection: "keep-alive",
  Host: "api.hamsterkombat.io",
  Origin: "https://hamsterkombat.io",
  Referer: "https://hamsterkombat.io/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 13; Pixel 4a Build/TQ3A.230805.001.S1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36",
  "X-Requested-With": "org.telegram.messenger",
  "sec-ch-ua":
    '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"Android"',
  accept: "application/json",
  "content-type": "application/json",
};

// Check balance
async function checkBalance() {
  try {
    const response = await fetch(`${API_URL}/clicker/sync`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return data.clickerUser.balanceCoins;
  } catch {
    console.error("Error checking balance:", error);
    return 0;
  }
}

// Fetch upgrades available for purchase
async function fetchUpgrades() {
  try {
    const response = await fetch(`${API_URL}/clicker/upgrades-for-buy`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return data.upgradesForBuy;
  } catch (error) {
    console.error("Error fetching upgrades:", error);
    return [];
  }
}

// Buy an upgrade
async function buyUpgrade(upgradeId) {
  try {
    const response = await fetch(`${API_URL}/clicker/buy-upgrade`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        upgradeId: upgradeId,
        timestamp: new Date().getTime(),
      }),
    });
    const data = await response.json();
    if (response.status == 200)
      console.log(`Successfully bought upgrade: ${upgradeId}`);
    else console.log(`Couldn't purchase upgrade: ${upgradeId}`);
    return data;
  } catch (error) {
    console.error(`Error buying upgrade ${upgradeId}:`, error);
  }
}

// Main function to find and buy the best upgrade
async function findAndBuyBestUpgrade() {
  const balance = await checkBalance();
  const upgrades = await fetchUpgrades();

  if (upgrades.length === 0) {
    console.log("No upgrades available for purchase.");
    return;
  }

  // Filter upgrades to only include those that are available and have no cooldown
  const availableUpgrades = upgrades.filter(
    (upgrade) =>
      upgrade.isAvailable &&
      (upgrade.cooldownSeconds === undefined ||
        upgrade.cooldownSeconds === 0) &&
      !upgrade.isExpired &&
      upgrade.price <= balance
  );

  if (availableUpgrades.length === 0) {
    console.log("No upgrades available for purchase without cooldown.");
    return;
  }

  // Calculate the best upgrade based on profitPerHourDelta/price ratio
  const bestUpgrade = availableUpgrades.reduce((best, current) => {
    const currentRatio = current.profitPerHourDelta / current.price;
    const bestRatio = best.profitPerHourDelta / best.price;
    return currentRatio > bestRatio ? current : best;
  });

  console.log(
    `Balance: ${balance}\nBest upgrade to buy: ${bestUpgrade.name} (Price: ${
      bestUpgrade.price
    }, Ratio: ${bestUpgrade.profitPerHourDelta / bestUpgrade.price})`
  );

  // Buy the best upgrade
  await buyUpgrade(bestUpgrade.id);
}

findAndBuyBestUpgrade();
