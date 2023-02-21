if (window.location.pathname === "/drinkview") {
  $(document).ready(function () {
    $('input[name="rating"]').prop("required", true);
  });

  id = window.location.search.split("?")[1];

  // Bind submit event to the form
  $(".reviewformula").submit(function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get the form data
    var formData = {
      score: $("input[name=rating]:checked").val(),
      review: $("#myreview").val(),
      drink_id: id,
    };

    // Send the data to the controller using AJAX
    console.log(formData);
    console.log(id);

    $.ajax({
      url: "/review/create",
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (data) {
        // Handle success response from the controller
        console.log(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        // Handle error response from the controller
        console.log(xhr.responseText);
      },
    });
  });
}
