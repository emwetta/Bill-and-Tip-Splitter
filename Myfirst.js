function createNameInputs() {
  const peopleInput = document.getElementById("people");
  const people = Number(peopleInput.value);
  const container = document.getElementById("names-container");
  const tipSection = document.getElementById("tip-section");
  container.innerHTML = "";
  document.getElementById("result").innerHTML = "";
  tipSection.style.display = "none";

  if (people < 0 || people > 50) {
    Swal.fire({
      icon: "warning",
      title: "Invalid number",
      text: "Please enter a valid number of people (1-50).",
      confirmButtonColor: "#000",
      confirmButtonText: "OK",
    });
    peopleInput.value = "";
    return;
  }

  if (people >= 2) {
    for (let i = 1; i <= people; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "person" + i;
      input.placeholder = "Enter name of person " + i;
      input.className = "name-input";


      input.addEventListener("input", function () {
        const validPattern = /^[A-Za-z\s]*$/;

        if (!validPattern.test(input.value)) {
          Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Names can only contain letters and spaces.",
            confirmButtonColor: "#000",
            confirmButtonText: "OK",
          });


          input.value = input.value.replace(/[^A-Za-z\s]/g, "");
        }
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


function splitBill() {
  const bill = Number(document.getElementById("bill").value);
  const people = Number(document.getElementById("people").value);
  const includeTip = document.getElementById("includeTip").checked;
  const resultArea = document.getElementById("result");

  resultArea.innerHTML = "";

  if (bill <= 0 || isNaN(bill)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Bill",
      text: "Please enter a valid bill amount.",
      confirmButtonColor: "#000",
      confirmButtonText: "OK",
    });
    return;
  }

  if (people < 2 || isNaN(people)) {
    Swal.fire({
      icon: "warning",
      title: "Not enough people",
      text: "Enter 2 persons and above to split the bill.",
      confirmButtonColor: "#000",
      confirmButtonText: "OK",
    });
    return;
  }

  let allNamesValid = true;
  const names = [];
  for (let i = 1; i <= people; i++) {
    const nameInput = document.getElementById("person" + i);
    const name = nameInput?.value.trim();


    if (!name || /[^A-Za-z\s]/.test(name)) {
      allNamesValid = false;
      break;
    }

    names.push(name);
  }

  if (!allNamesValid) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Names",
      text: "Please make sure all names only contain letters and spaces.",
      confirmButtonColor: "#000",
      confirmButtonText: "OK",
    });
    return;
  }

  let tip = 0;
  let tipPayers = [];
  if (includeTip) {
    tip = Number(document.getElementById("tipAmount").value) || 0;
    if (tip < 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Tip",
        text: "Please enter a valid tip amount.",
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
      });
      return;
    }
    const checkboxes = document.querySelectorAll("#whoPaysTip input[type='checkbox']:checked");
    tipPayers = Array.from(checkboxes).map((cb) => cb.value);

    if (tipPayers.length === 0 && tip > 0) {
      Swal.fire({
        icon: "warning",
        title: "No Tip Payers",
        text: "Please select who will pay the tip.",
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
      });
      return;
    }
  }

  const eachBill = bill / people;
  const tipShare = tipPayers.length > 0 ? tip / tipPayers.length : 0;

  for (let i = 1; i <= people; i++) {
    const nameInput = document.getElementById("person" + i);
    const name = nameInput?.value.trim() || "Person " + i;
    const totalPay = tipPayers.includes(name) ? eachBill + tipShare : eachBill;

    const p = document.createElement("p");
    p.innerHTML = `<strong>${name}</strong> should pay: $${totalPay.toFixed(2)}`;
    resultArea.appendChild(p);
  }

  Swal.fire({
    title: "Bill Split Complete!",
    html: "Your Total is below",
    icon: "success",
    confirmButtonText: "OK",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
  });
}

// Clear all fields
function clearFields() {
  document.getElementById("bill").value = "";
  document.getElementById("people").value = "";
  document.getElementById("names-container").innerHTML = "";
  document.getElementById("tip-section").style.display = "none";
  document.getElementById("tip-options").style.display = "none";
  document.getElementById("tipAmount").value = "";
  document.getElementById("whoPaysTip").innerHTML = "";
  document.getElementById("includeTip").checked = false;
  document.getElementById("result").innerHTML = "";

  Swal.fire({
    icon: "info",
    title: "Cleared",
    text: "All fields have been reset.",
    confirmButtonColor: "#000",
    confirmButtonText: "OK",
  });
}


document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        splitBill();
      }
    });
  });
});
