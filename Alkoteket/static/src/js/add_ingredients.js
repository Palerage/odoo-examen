var ingredientlistelement = $("#add_ingredients");
var index = 0;

function GenerateHtml(ingredient = "", amount = "", ingredient_id = "") {
  index++;
  var htmlToAdd = `
    <div id="ingredientelement-${index}" class="ingredientelementa">
      <div class="part">  
        <div class="topicselect">
          <input type="text" id="ingredient-${index}" name="ingredient" value="${ingredient}" data-id="${ingredient_id}"/>
        </div>
        <div class="topicselect">
          <input type="text" id="amount-${index}" name="amount" value="${amount}"/>
        </div>
      </div>
      <div class="part">
        <button type="button" id="removebutton-${index}" onclick="removeElement(${index})">Remove</button> 
      </div>
    </div>`;
  ingredientlistelement.prepend(htmlToAdd);
}

$("#drink-form").on("submit", function (event) {
  event.preventDefault();

  var drink_name = $("#drinkname").val();
  // var drink_type = $("#drinktype").val();
  var ingredients = [];
  $("#add_ingredients .ingredientelementa").each(function () {
    var ingredient_id = $(this).find("input[name=ingredient]").data('id');
    var ingredient_amount = $(this).find("input[name=amount]").val();
    ingredients.push({
      ingredient_id: ingredient_id,
      ingredient_amount: ingredient_amount,
    });
  });
  var image = $("#img").val();

  var formData = new FormData();
  formData.append("drink_name", drink_name);
  // formData.append("drink_type", drink_type);
  formData.append("ingredients", JSON.stringify(ingredients));
  formData.append("image", image);

  $.ajax({
    url: "/alkoteket/createdrink",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      console.log("Drink created with ID " + data.drink_id);
    },
    error: function () {
      console.log("Error creating drink");
    },
  });
});

// Load the options for the select element
$.ajax({
  url: "/alkoteket/ingredients?limit=100",
  type: "GET",
  dataType: "json",
  success: function (data) {
    var selectIngredient = $("#select_ingredient");
    $.each(data, function (index, value) {
      selectIngredient.append(
        "<option value='" + value.id + "'>" + value.name + "</option>"
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
  var ingredientInput = document.getElementById("select2-chosen-1");
  var amountInput = document.getElementById("amountelement");
  var ingredientValue = ingredientInput.innerHTML;
  var amountValue = amountInput.value;
  var ingredient_id = $('#select_ingredient').val();
  // ingredientInput.value = "";
  amountInput.value = 4;
  GenerateHtml(ingredientValue, amountValue, ingredient_id);
}

function removeElement(elementindex) {
  var rowToRemove = document.getElementById(
    `ingredientelement-${elementindex}`
  );
  rowToRemove.remove();
}
