// Fetch and populate the table with data from the JSON file
async function fetchData() {
  const url = "https://compute.samford.edu/zohauth/clients/datajson";
  try {
    const response = await fetch(url);
    const data = await response.json();

    const tableBody = document.getElementById("data-table");

    // Populate table with data
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.speed}</td>
        <td>${item.result}</td>
        <td>${item.datetime}</td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listeners for sorting
    enableSorting(data);

    // Perform statistical calculations
    calculateStatistics(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Enable sorting for table columns
function enableSorting(data) {
  const headers = document.querySelectorAll("th");
  headers.forEach((header, index) => {
    header.addEventListener("click", () => {
      // Sort the data by the clicked column
      const sortedData = [...data].sort((a, b) => {
        const key = header.textContent.toLowerCase();
        if (typeof a[key] === "string") {
          return a[key].localeCompare(b[key]);
        } else {
          return a[key] - b[key];
        }
      });

      // Clear the table and repopulate it with sorted data
      const tableBody = document.getElementById("data-table");
      tableBody.innerHTML = "";
      sortedData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.speed}</td>
          <td>${item.result}</td>
          <td>${item.datetime}</td>
        `;
        tableBody.appendChild(row);
      });
    });
  });
}

// Calculate and display mean, median, and mode for the 'speed' column
function calculateStatistics(data) {
  const speeds = data.map((item) => item.speed);

  // Calculate mean
  const mean = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2);

  // Calculate median
  const sortedSpeeds = speeds.sort((a, b) => a - b);
  const mid = Math.floor(sortedSpeeds.length / 2);
  const median =
    sortedSpeeds.length % 2 === 0
      ? ((sortedSpeeds[mid - 1] + sortedSpeeds[mid]) / 2).toFixed(2)
      : sortedSpeeds[mid].toFixed(2);

  // Calculate mode
  const frequency = {};
  speeds.forEach((speed) => {
    frequency[speed] = (frequency[speed] || 0) + 1;
  });
  const maxFrequency = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency).find(
    (key) => frequency[key] === maxFrequency
  );

  // Display statistics
  const statsContainer = document.getElementById("stats");
  statsContainer.innerHTML = `
    <p><strong>Statistics:</strong></p>
    <p>Mean Speed: ${mean} mph</p>
    <p>Median Speed: ${median} mph</p>
    <p>Mode Speed: ${mode} mph</p>
  `;
}

// Call fetchData when the page loads
fetchData();
