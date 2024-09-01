const Axios = require("axios");
var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const symbol = "AAPL";
  const result = await Axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.API_KEY}`
  );
  const lastRefreshed = result.data["Meta Data"]["3. Last Refreshed"];
  const lastClose =
    result.data["Time Series (Daily)"][lastRefreshed]["4. close"];

  await Axios.post(
    // this is where we would put our channel web hook url,
    {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Alert! Alert! *${symbol}* is now $${lastClose}. <https://www.google.com/search?q=NYSE:+${symbol}|View on Google Finance>`,
          },
        },
      ],
    }
  );

  res.json({
    lastClose,
    date: new Date().toISOString(),
  });
});

module.exports = router;
