breakme: if (window.location.pathname === "/create") {
  var ingredientlistelement = $("#add_ingredients");
  var index = 0;

  var ingredientcounter = document.getElementById("ingredientcounter");
  if(ingredientcounter == null){
    break breakme;
  }
  ingredientcounter.innerText = "0";
  var counter = 0;
  var maxIngredients = 6;

  function GenerateHtml(ingredient = "", amount = "", ingredient_id = "") {
    index++;
    var htmlToAdd = `
    <div id="ingredientelement-${index}" class="ingredientelementa">
      <div class="part">  
        <div class="topicselect">
          <input readonly type="text" id="ingredient-${index}" name="ingredient" style="background-color:#e5e5e5; border:none;" value="${ingredient}" data-id="${ingredient_id}"/>
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
    if($("#img")[0].value == "" || $("#drinkname")[0].value == "" || counter == 0){
      alert("Your drink is incomplete...")
      return
    }

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
      selectIngredient.append(
        "<option value='" + 0 + "'>Select your Ingredient</option>"
      );
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

  function removeOption(ingredientId){
    $("option[value='" + ingredientId + "']").prop('disabled',true)
  }

  function reAddOption(ingredientId){
    $("option[value='" + ingredientId + "']").prop('disabled',false)
  }

  function addElement() {
    var ingredient_id = $("#select_ingredient").val();
    if(ingredient_id == 0){
      return
    }
    var ingredientInput = document.getElementById("select2-chosen-1");
    var amountInput = document.getElementById("amountelement");
    var ingredientValue = ingredientInput.innerHTML;
    var amountValue = amountInput.value;
    console.log("Ingredientname - " + ingredientValue)
    console.log("IngredientAmount - " + amountValue)
    amountInput.value = 4;
    $('#s2id_select_ingredient').select2('val',0);
    removeOption(ingredient_id)
    GenerateHtml(ingredientValue, amountValue, ingredient_id);

    // Update ingredientcounter
    counter++;
    if(counter >= maxIngredients){
      $("#addbutton").prop("disabled",true).css("background-color", "grey").html("Limit Reached")
      // $("#addbutton")
    }
    ingredientcounter.innerText = counter;
  }

  function removeElement(elementindex) {
    var rowToRemove = document.getElementById(
      `ingredientelement-${elementindex}`
    );
    ingredient_id = $(`#ingredient-${elementindex}`).attr("data-id")
    reAddOption(ingredient_id)
    rowToRemove.remove();
    counter--;
    $("#addbutton").prop("disabled",false).css("background-color", "").html("ADD")
    ingredientcounter.innerText = counter;
  }

  $(document).ready(function() {
    $('#img').change(function() {
      var file = this.files[0];
      var reader = new FileReader();
      reader.onloadend = function() {
        $('#preview').attr('src', reader.result);
        $('#preview').show(); // show the preview image
      }
      if (file) {
        reader.readAsDataURL(file);
      } else {
        $('#preview').attr('src', '');
        $('#preview').hide(); // hide the preview image
      }
    });
  });
}
