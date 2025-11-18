function createNameInputs() {
  const people = Number(document.getElementById("people").value);
  const container = document.getElementById("names-container");
  const tipSection = document.getElementById("tip-section");

  container.innerHTML = "";

  // We no longer need to hide result-card because we are using a popup
  // but we keep this check to prevent errors if the element is missing
  const resultCard = document.getElementById("result-card");
  if (resultCard) resultCard.style.display = "none";

  if (people > 50) return Swal.fire("Warning", "Maximum 50 people allowed", "warning");

  if (people >= 2) {
    for (let i = 1; i <= people; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "person" + i;
      input.placeholder = "Name of person " + i;
      input.className = "name-input";
      input.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
      });
      container.appendChild(input);
    }
    tipSection.style.display = "block";
  } else {
    tipSection.style.display = "none";
  }
}

function toggleTipOptions() {
  const includeTip = document.getElementById("includeTip").checked;
  const tipOptions = document.getElementById("tip-options");
  const whoPaysTip = document.getElementById("whoPaysTip");

  tipOptions.style.display = includeTip ? "block" : "none";
  whoPaysTip.innerHTML = "";

  if (includeTip) {
    const people = Number(document.getElementById("people").value);
    for (let i = 1; i <= people; i++) {
      const nameInput = document.getElementById("person" + i);
      const name = nameInput?.value.trim() || "Person " + i;

      const div = document.createElement("div");
      div.className = "tip-payer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "tipPayer" + i;
      checkbox.value = name;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = name;

      div.appendChild(checkbox);
      div.appendChild(label);
      whoPaysTip.appendChild(div);
    }
  }
}

function setTipPercent(percent) {
  const bill = parseFloat(document.getElementById("bill").value);
  if (!bill) return Swal.fire("Oops", "Enter bill amount first", "warning");
  document.getElementById("tipAmount").value = (bill * percent).toFixed(2);
}

function splitBill() {
  const bill = Number(document.getElementById("bill").value);
  const people = Number(document.getElementById("people").value);
  const includeTip = document.getElementById("includeTip").checked;

  if (!bill || bill <= 0) return Swal.fire("Error", "Please enter a valid bill amount.", "error");
  if (!people || people < 2) return Swal.fire("Error", "Need at least 2 people.", "error");

  let tip = 0;
  let tipPayers = [];

  if (includeTip) {
    tip = Number(document.getElementById("tipAmount").value) || 0;
    const checkboxes = document.querySelectorAll("#whoPaysTip input[type='checkbox']:checked");
    tipPayers = Array.from(checkboxes).map(cb => cb.value);

    if (tip > 0 && tipPayers.length === 0) {
      return Swal.fire("Warning", "Who is paying the tip? Please select someone.", "warning");
    }
  }

  const eachBill = bill / people;
  const tipShare = tipPayers.length > 0 ? tip / tipPayers.length : 0;

  // --- NEW LOGIC: BUILD HTML STRING FOR POPUP ---
  let resultHTML = '<div style="text-align: left; font-size: 0.95rem;">';
  let shareText = `*Afrikiko Bill Split* 🧾%0A`; // %0A is newline for WhatsApp

  for (let i = 1; i <= people; i++) {
    const nameInput = document.getElementById("person" + i);
    const name = nameInput?.value.trim() || "Person " + i;

    const totalPay = tipPayers.includes(name) ? eachBill + tipShare : eachBill;

    // Add row to the Popup HTML
    resultHTML += `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.2);">
        <span style="color:#ccc;">${name}</span>
        <strong style="color:#f9c400;">GH₵ ${totalPay.toFixed(2)}</strong>
      </div>`;

    // Add line to the WhatsApp Message
    shareText += `${name}: GH₵ ${totalPay.toFixed(2)}%0A`;
  }
  resultHTML += '</div>';

  // --- FIRE THE CUSTOM POPUP ---
  Swal.fire({
    title: 'Bill Breakdown',
    html: resultHTML,
    background: '#1a1a1a',
    color: '#fff',
    showDenyButton: true, // This acts as our WhatsApp button
    confirmButtonText: 'Close',
    denyButtonText: 'Share on WhatsApp',
    denyButtonColor: '#25D366', // WhatsApp Green
    confirmButtonColor: '#444', // Dark Grey for Close
    customClass: {
      popup: 'animate__animated animate__fadeInUp' // Slide up animation
    }
  }).then((result) => {
    if (result.isDenied) {
      // If they clicked the Green "Share" button
      shareToWhatsApp(shareText);
    }
  });
}

// Updated to accept text directly from the function above
function shareToWhatsApp(text) {
  if (text) window.open(`https://wa.me/?text=${text}`, '_blank');
}

function clearFields() {
  document.getElementById("bill").value = "";
  document.getElementById("people").value = "";
  document.getElementById("names-container").innerHTML = "";
  document.getElementById("tip-section").style.display = "none";
  document.getElementById("includeTip").checked = false;

  // Clear result card if it still exists in HTML
  const resultCard = document.getElementById("result-card");
  if (resultCard) resultCard.style.display = "none";
}