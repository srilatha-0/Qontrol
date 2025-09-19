async function updateWaitTime() {
  const service = document.getElementById("service").value;
  if (!service) return;

  // Fetch data from backend API
  const response = await fetch(`/api/queue/status?service=${service}`);
  const data = await response.json();

  document.getElementById("waitInfo").innerHTML = 
    `<strong>${service}</strong><br>
     Queue Length: ${data.queueLength}<br>
     Estimated Wait: ~${data.waitTime} mins`;
}

async function joinQueue() {
  const service = document.getElementById("service").value;
  if (!service) {
    alert("Please select a service first!");
    return;
  }

  // Send join request to backend
  const response = await fetch(`/api/queue/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service })
  });
  const data = await response.json();

  document.getElementById("ticketInfo").innerText = 
    `Your Ticket: #${data.ticketNo} (${service})`;
  document.getElementById("timeInfo").innerText = 
    `You’re #${data.position} in line | Estimated Wait: ~${data.waitTime} mins`;

  document.getElementById("confirmation").style.display = "block";
}
