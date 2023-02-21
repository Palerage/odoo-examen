if (window.location.pathname === "/create") {
  var ingredientlistelement = $("#add_ingredients");
  var index = 0;

  var ingredientcounter = document.getElementById("ingredientcounter");
  ingredientcounter.innerText = "0";
  var counter = 0;

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
    ingredientcounter.innerText = counter;
  }

  $("#drink-form").on("submit", function (event) {
    event.preventDefault();

    var drink_name = $("#drinkname").val();
    var note = $("#subject").val();
    // var drink_type = $("#drinktype").val();
    var ingredients = [];
    $("#add_ingredients .ingredientelementa").each(function () {
      var ingredient_id = $(this).find("input[name=ingredient]").data("id");
      var ingredient_amount = $(this).find("input[name=amount]").val();
      ingredients.push({
        ingredient_id: ingredient_id,
        ingredient_amount: ingredient_amount,
      });
    });

    // read the contents of the file and convert to base64 string
    var reader = new FileReader();
    reader.onload = function () {
      var image = reader.result.split(",")[1];

      var formData = new FormData();
      formData.append("drink_name", drink_name);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("image", image);
      formData.append("note", note);

      $.ajax({
        url: "/alkoteket/createdrink",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          console.log("Drink created with ID " + data.drink_id);
          window.location.href = "/drinkview?" + data.drink_id; // replace with your desired URL
        },
        error: function () {
          console.log("Error creating drink");
        },
      });
    };
    reader.readAsDataURL($("#img")[0].files[0]);
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
    var ingredient_id = $("#select_ingredient").val();
    amountInput.value = 4;
    GenerateHtml(ingredientValue, amountValue, ingredient_id);

    // Update ingredientcounter
    counter++;
    ingredientcounter.innerText = counter;
  }

  function removeElement(elementindex) {
    var rowToRemove = document.getElementById(
      `ingredientelement-${elementindex}`
    );
    rowToRemove.remove();
    counter--;
    ingredientcounter.innerText = counter;
  }
}
