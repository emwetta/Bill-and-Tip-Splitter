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

    // Add a header
    const header = document.createElement("p");
    header.style.fontSize = "0.85rem";
    header.style.color = "#aaa";
    header.style.marginBottom = "10px";
    header.innerText = "Enter how much tip each person contributes:";
    whoPaysTip.appendChild(header);

    for (let i = 1; i <= people; i++) {
      const nameInput = document.getElementById("person" + i);
      const name = nameInput?.value.trim() || "Person " + i;

      const div = document.createElement("div");
      div.className = "tip-contribution-row";

      const label = document.createElement("label");
      label.textContent = name;

      const input = document.createElement("input");
      input.type = "number";
      input.id = "tipShare" + i; // Unique ID for their tip contribution
      input.className = "tip-contribution-input";
      input.placeholder = "0";
      input.value = 0; // Default to 0

      div.appendChild(label);
      div.appendChild(input);
      whoPaysTip.appendChild(div);
    }
  }
}

function splitBill() {
  const bill = Number(document.getElementById("bill").value);
  const people = Number(document.getElementById("people").value);
  const includeTip = document.getElementById("includeTip").checked;

  // 1. Basic Validation
  if (!bill || bill <= 0) return Swal.fire("ERROR", "Please enter a valid bill amount.", "error");
  if (!people || people < 2) return Swal.fire("ERROR", "Need at least 2 people.", "error");

  let totalTip = 0;
  let individualTips = []; // Array to store each person's tip

  // 2. Advanced Tip Logic
  if (includeTip) {
    totalTip = Number(document.getElementById("tipAmount").value) || 0;
    let calculatedTipSum = 0;

    // Loop through to get everyone's specific tip contribution
    for (let i = 1; i <= people; i++) {
      const contribution = Number(document.getElementById("tipShare" + i).value) || 0;
      individualTips[i] = contribution; // Store it
      calculatedTipSum += contribution;
    }

    // VALIDATION: Does the sum of contributions equal the total tip?
    // Allow a small margin of error (0.1) for decimals
    if (Math.abs(calculatedTipSum - totalTip) > 0.1) {
      return Swal.fire({
        icon: "warning",
        title: "Tip Mismatch",
        text: `Total Tip is ${totalTip}, but contributions add up to ${calculatedTipSum}. Please adjust.`,
        confirmButtonColor: "#f9c400"
      });
    }
  }

  const baseBillShare = bill / people;

  // 3. Build Result HTML
  let resultHTML = '<div style="text-align: left; margin-top: 10px;">';
  let shareText = `*Afrikiko Bill Split* 🧾%0A`;

  for (let i = 1; i <= people; i++) {
    const nameInput = document.getElementById("person" + i);
    const name = nameInput?.value.trim() || "Person " + i;

    // LOGIC: Base Share + Their Specific Tip Contribution
    // If tips are off, individualTips[i] will be undefined, so we use || 0
    const addedTip = individualTips[i] || 0;
    const totalPay = baseBillShare + addedTip;

    resultHTML += `
      <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex; flex-direction:column;">
          <span style="color:#ddd;">${name}</span>
          ${addedTip > 0 ? `<small style="color:#888; font-size:0.8em;">(Bill: ${baseBillShare.toFixed(2)} + Tip: ${addedTip})</small>` : ''}
        </div>
        <strong style="color:#f9c400; font-size:1.1em;">GH₵ ${totalPay.toFixed(2)}</strong>
      </div>`;

    shareText += `${name}: GH₵ ${totalPay.toFixed(2)}%0A`;
  }
  resultHTML += '</div>';

  // 4. Show Popup
  Swal.fire({
    icon: 'success',
    title: 'BILL BREAKDOWN',
    html: resultHTML,
    background: '#1a1a1a',
    color: '#ffffff',
    showDenyButton: true,
    confirmButtonText: 'OK',
    denyButtonText: 'Share WhatsApp',
    confirmButtonColor: '#f9c400',
    denyButtonColor: '#25D366',
    customClass: { popup: 'animate__animated animate__fadeInDown' }
  }).then((result) => {
    if (result.isDenied) window.open(`https://wa.me/?text=${shareText}`, '_blank');
  });
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