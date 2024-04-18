const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.post("/save-to-csv", (req, res) => {
  const inputText = req.body.inputText;
  const newLine = `${inputText}\n`;

  fs.appendFile("localfile.csv", newLine, (err) => {
    if (err) {
      console.error("Failed to append data to file:", err);
      return res.status(500).send("Error writing to CSV");
    }
    res.send("Data was appended to CSV successfully");
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
