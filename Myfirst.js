document.addEventListener('DOMContentLoaded', function () {
  // 1. Restrict Momo Number Input
  const momoInput = document.getElementById("momoNumber");
  if (momoInput) {
    momoInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // 2. Load Saved Data on Startup
  loadState();

  // 3. Auto-Save on ANY change
  document.addEventListener('input', saveState);
  document.addEventListener('change', saveState);
});

/* --- CORE APP LOGIC --- */

function createNameInputs() {
  const peopleInput = document.getElementById("people");
  const people = Number(peopleInput.value);
  const container = document.getElementById("names-container");
  const tipSection = document.getElementById("tip-section");

  // Don't wipe the container if we are just reloading state, 
  // but here we assume this is called on change.
  container.innerHTML = "";

  if (people > 50) {
    peopleInput.value = "";
    return Swal.fire("Warning", "Maximum 50 people allowed", "warning");
  }

  if (people >= 2) {
    for (let i = 1; i <= people; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "person" + i;
      input.placeholder = "Name of person " + i;
      input.className = "name-input";

      input.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
        if (document.getElementById("includeTip").checked) {
          const tipLabel = document.querySelector(`#whoPaysTip div:nth-child(${i + 1}) label`);
          if (tipLabel) tipLabel.textContent = this.value || "Person " + i;
        }
      });

      container.appendChild(input);
    }
    tipSection.style.display = "block";

    // Refresh Tip Section if active
    if (document.getElementById("includeTip").checked) {
      toggleTipOptions();
    }
  } else {
    tipSection.style.display = "none";
    document.getElementById("includeTip").checked = false;
    document.getElementById("tip-options").style.display = "none";
  }
}

function togglePaymentInput() {
  const method = document.getElementById("paymentMethod").value;
  const momoDiv = document.getElementById("momoInputDiv");
  if (method === "momo") {
    momoDiv.style.display = "block";
  } else {
    momoDiv.style.display = "none";
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
    const header = document.createElement("p");
    header.style.fontSize = "0.85rem";
    header.style.color = "#aaa";
    header.style.marginBottom = "10px";
    header.innerText = "Enter contribution amount for each person:";
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
      input.id = "tipShare" + i;
      input.className = "tip-contribution-input";
      input.placeholder = "0";
      input.value = 0;

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

  const payMethod = document.getElementById("paymentMethod").value;
  const momoName = document.getElementById("momoName").value.trim();
  const momoNumber = document.getElementById("momoNumber").value.trim();

  if (!bill || bill <= 0) return Swal.fire("ERROR", "Please enter a valid bill amount.", "error");
  if (!people || people < 2) return Swal.fire("ERROR", "Need at least 2 people.", "error");

  if (payMethod === "momo") {
    const ghanaRegex = /^0(2|5)\d{8}$/;
    if (!momoName) return Swal.fire("Missing Name", "Please enter the collector's name.", "warning");
    if (!ghanaRegex.test(momoNumber)) {
      return Swal.fire({ icon: "error", title: "Invalid Number", text: "Please enter a valid 10-digit Ghana number (02... or 05...)", confirmButtonColor: "#f9c400" });
    }
  }

  let totalTip = 0;
  let individualTips = [];

  if (includeTip) {
    totalTip = Number(document.getElementById("tipAmount").value) || 0;
    let calculatedTipSum = 0;
    for (let i = 1; i <= people; i++) {
      const contribution = Number(document.getElementById("tipShare" + i).value) || 0;
      individualTips[i] = contribution;
      calculatedTipSum += contribution;
    }

    if (Math.abs(calculatedTipSum - totalTip) > 0.1) {
      return Swal.fire({ icon: "warning", title: "Tip Mismatch", text: `Total Tip is ${totalTip}, but contributions add up to ${calculatedTipSum}.`, confirmButtonColor: "#f9c400" });
    }
  }

  const baseBillShare = bill / people;
  let resultHTML = '<div style="text-align: left; margin-top: 10px;">';
  let shareText = `*Afrikiko Bill Split* 🧾%0A`;

  if (payMethod === "momo") shareText += `*Pay to: ${momoName} (${momoNumber})*%0A------------------%0A`;
  else shareText += `*Please pay in CASH 💵*%0A------------------%0A`;

  for (let i = 1; i <= people; i++) {
    const nameInput = document.getElementById("person" + i);
    const name = nameInput?.value.trim() || "Person " + i;
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

  if (payMethod === "momo") {
    resultHTML += `<div style="margin-top:15px; padding:10px; background:rgba(37, 211, 102, 0.1); border:1px dashed #25D366; border-radius:5px; color:#ccc; font-size:0.85rem; text-align:center;">
      Pay to: <strong style="color:#fff;">${momoName}</strong><br><strong style="color:#f9c400; font-size:1.1rem;">${momoNumber}</strong>
    </div>`;
  } else {
    resultHTML += `<div style="margin-top:15px; padding:10px; background:rgba(255, 255, 255, 0.1); border:1px dashed #ccc; border-radius:5px; color:#ccc; font-size:0.85rem; text-align:center;">Payment Method: <strong style="color:#fff;">CASH 💵</strong></div>`;
  }
  resultHTML += '</div>';

  Swal.fire({
    icon: 'success', title: 'BILL BREAKDOWN', html: resultHTML, background: '#1a1a1a', color: '#ffffff', showDenyButton: true, confirmButtonText: 'OK', denyButtonText: 'Share WhatsApp', confirmButtonColor: '#f9c400', denyButtonColor: '#25D366',
    customClass: { popup: 'animate__animated animate__fadeInDown' }
  }).then((result) => {
    if (result.isDenied) window.open(`https://wa.me/?text=${shareText}`, '_blank');
  });
}

function clearFields() {
  localStorage.clear(); // WIPE MEMORY
  location.reload();    // Reload page to reset fresh
}

/* ========================================= */
/* ---   LOCAL STORAGE LOGIC (SAVE/LOAD) --- */
/* ========================================= */

function saveState() {
  const state = {
    bill: document.getElementById("bill").value,
    people: document.getElementById("people").value,
    includeTip: document.getElementById("includeTip").checked,
    tipAmount: document.getElementById("tipAmount").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    momoName: document.getElementById("momoName").value,
    momoNumber: document.getElementById("momoNumber").value,
    names: [],
    tipShares: []
  };

  // Save Names
  const peopleCount = Number(state.people);
  if (peopleCount >= 2) {
    for (let i = 1; i <= peopleCount; i++) {
      const el = document.getElementById("person" + i);
      state.names.push(el ? el.value : "");

      const tipEl = document.getElementById("tipShare" + i);
      state.tipShares.push(tipEl ? tipEl.value : "");
    }
  }

  localStorage.setItem("equalPayState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("equalPayState");
  if (!saved) return; // Nothing saved, do nothing

  const state = JSON.parse(saved);

  // 1. Restore Basic Fields
  document.getElementById("bill").value = state.bill;
  document.getElementById("people").value = state.people;
  document.getElementById("includeTip").checked = state.includeTip;
  document.getElementById("tipAmount").value = state.tipAmount;
  document.getElementById("paymentMethod").value = state.paymentMethod;
  document.getElementById("momoName").value = state.momoName;
  document.getElementById("momoNumber").value = state.momoNumber;

  // 2. Trigger UI Updates based on restored data
  if (state.people >= 2) {
    createNameInputs(); // This rebuilds the inputs

    // Fill names back in
    state.names.forEach((name, index) => {
      const el = document.getElementById("person" + (index + 1));
      if (el) el.value = name;
    });
  }

  togglePaymentInput(); // Show/Hide Momo box

  // 3. Restore Tips if needed
  if (state.includeTip) {
    toggleTipOptions(); // Show tip section

    // Fill tip shares back in
    state.tipShares.forEach((amt, index) => {
      const el = document.getElementById("tipShare" + (index + 1));
      if (el) el.value = amt;

      // Also fix the labels in the tip section to match names
      const tipLabel = document.querySelector(`#whoPaysTip div:nth-child(${index + 2}) label`);
      if (tipLabel && state.names[index]) tipLabel.textContent = state.names[index];
    });
  }
}