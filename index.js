window.onload = function () {
  loadCSVData();
};

function loadCSVData() {
  fetch("http://localhost:3000/get-csv-data")
    .then((response) => response.json())
    .then((data) => {
      const list = document.getElementById("csvList");
      list.innerHTML = ""; // Clear previous list
      data.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteLine(index);

        const updateInput = document.createElement("input");
        updateInput.type = "text";
        updateInput.value = item;

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.onclick = () => updateLine(index, updateInput.value);

        listItem.appendChild(deleteButton);
        listItem.appendChild(updateInput);
        listItem.appendChild(updateButton);
        list.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching CSV data:", error));
}

function deleteLine(index) {
  fetch("http://localhost:3000/delete-line", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `index=${index}`,
  })
    .then((response) => response.text())
    .then(() => loadCSVData())
    .catch((error) => console.error("Error deleting line:", error));
}

function updateLine(index, newText) {
  fetch("http://localhost:3000/update-line", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `index=${index}&newText=${encodeURIComponent(newText)}`,
  })
    .then((response) => response.text())
    .then(() => loadCSVData())
    .catch((error) => console.error("Error updating line:", error));
}
