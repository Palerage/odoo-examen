var ingredientlistelement = $("#add_ingredients");
var index = 0;

function GenerateHtml(ingredient = "", amount = "") {
  index++;
  var htmlToAdd = `
    <div id="ingredientelement-${index}" class="ingredientelementa">
      <div class="part">
        <h4>Ingredient</h4>
        <p>${ingredient}</p>
      </div>
      <div class="part">
        <h4>Amount</h4>
        <p>${amount}</p>
      </div>
      <div class="part">
        <button type="button" id="removebutton-${index}" onclick="removeElement(${index})">Remove</button> 
      </div>
    </div>`;
  ingredientlistelement.prepend(htmlToAdd);
}

// Load the options for the select element
$.ajax({
  url: "/alkoteket/ingredients",
  type: "GET",
  dataType: "json",
  success: function (data) {
    var selectIngredient = $("#select_ingredient");
    $.each(data, function (index, value) {
      selectIngredient.append(
        "<option value='" + value + "'>" + value + "</option>"
      );
    });

    // Initialize the select2 plugin
    selectIngredient.select2();
  },
  error: function () {
    console.log("Error fetching ingredients");
  },
});

function addElement() {
  var ingredientInput = document.getElementById("select_ingredient");
  var amountInput = document.getElementById("amountelement");
  var ingredientValue = ingredientInput.value;
  var amountValue = amountInput.value;
  ingredientInput.value = "";
  amountInput.value = 4;
  GenerateHtml(ingredientValue, amountValue);
}

function removeElement(elementindex) {
  var rowToRemove = document.getElementById(
    `ingredientelement-${elementindex}`
  );
  rowToRemove.remove();
}
