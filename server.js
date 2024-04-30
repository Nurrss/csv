const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app.get("/get-csv-data", (req, res) => {
  fs.readFile("localfile.csv", (err, data) => {
    if (err) {
      console.error("Failed to read data from file:", err);
      return res.status(500).send("Error reading CSV file");
    }
    const lines = data
      .toString()
      .split("\n")
      .filter((line) => line);
    res.json(lines); // Send data as JSON
  });
});

app.post("/delete-csv-data", (req, res) => {
  fs.writeFile("localfile.csv", "", function (err) {
    if (err) {
      console.error("Failed to clear CSV file:", err);
      return res.status(500).send("Error clearing CSV file");
    }
    res.send("CSV file cleared successfully");
  });
});

// Delete a specific line from CSV
app.post("/delete-line", (req, res) => {
  const index = parseInt(req.body.index);
  fs.readFile("localfile.csv", (err, data) => {
    if (err) {
      console.error("Failed to read data from file:", err);
      return res.status(500).send("Error reading CSV file");
    }
    let lines = data.toString().split("\n");
    if (index >= 0 && index < lines.length) {
      lines.splice(index, 1); // Remove the line at the specified index
      fs.writeFile("localfile.csv", lines.join("\n"), (err) => {
        if (err) {
          console.error("Failed to write updated data to file:", err);
          return res.status(500).send("Error updating CSV file");
        }
        res.send("Line deleted successfully");
      });
    } else {
      res.status(400).send("Invalid line index");
    }
  });
});

// Update a specific line in CSV
app.post("/update-line", (req, res) => {
  const index = parseInt(req.body.index);
  const newText = req.body.newText;
  fs.readFile("localfile.csv", (err, data) => {
    if (err) {
      console.error("Failed to read data from file:", err);
      return res.status(500).send("Error reading CSV file");
    }
    let lines = data.toString().split("\n");
    if (index >= 0 && index < lines.length) {
      lines[index] = newText; // Replace the line at the specified index
      fs.writeFile("localfile.csv", lines.join("\n"), (err) => {
        if (err) {
          console.error("Failed to write updated data to file:", err);
          return res.status(500).send("Error updating CSV file");
        }
        res.send("Line updated successfully");
      });
    } else {
      res.status(400).send("Invalid line index");
    }
  });
});

function createHtmlFile(filename, content) {
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File created successfully");
    }
  });
}

const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
</body>
</html>`;

createHtmlFile("example.html", htmlContent);

app.listen(3000, () => console.log("Server running on port 3000"));
