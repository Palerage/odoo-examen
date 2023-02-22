if (window.location.pathname === "/drinkview") {

  $(document).ready(function () {
    $('input[name="rating"]').prop("required", true);
  });

  id = window.location.search.split("?")[1];

  var ratingStars = document.querySelectorAll(".rating_section span");

  function updateRating() {
    ratingStars.forEach(function(star) {
      var rating = parseInt(star.getAttribute("data-rating"));
      if (rating <= currentRating) {
        star.classList.add("fa-star");
        star.classList.remove("fa-star-o");
      } else {
        star.classList.add("fa-star-o");
        star.classList.remove("fa-star");
      }
    });
  }
  
  ratingStars.forEach(function(star, index) {
    star.addEventListener("mouseover", function() {
      for (var i = 0; i < index + 1; i++) {
        ratingStars[i].classList.add("fa-star-o-hover");
      }
    });

    star.addEventListener("mouseout", function() {
      for (var i = 0; i < index + 1; i++) {
        ratingStars[i].classList.remove("fa-star-o-hover");
      }
    });
  });


  // ratingStars.addEventListener('mouseover', (event) => {

  // });

  var currentRating = 0;
  ratingStars.forEach(function (star) {
    star.addEventListener("click", function () {
      currentRating = parseInt(star.getAttribute("data-rating"));
      updateRating();
      $("#reviewsubmit").prop('disabled', false)
    });
  });

  // Bind submit event to the form
  // $(".reviewformula").submit(function (e) {
  //   // Prevent the default form submission behavior
  //   e.preventDefault();

  //   // Get the form data
  //   var formData = {
  //     score: $("input[name=rating]:checked").val(),
  //     review: $("#myreview").val(),
  //     drink_id: id,
  //   };

  //   // Send the data to the controller using AJAX
  //   console.log(formData);
  //   console.log(id);

    
  // });

  $("#review-form").on("submit", function (event) {
    event.preventDefault();
    comment = $("#myreview").val()

    var formData = new FormData();
    formData.append("rating", currentRating);
    formData.append("comment", comment);
    formData.append("drink_id", id);
    
    $.ajax({
      url: "/review/create",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      // dataType: "json",
      success: function (data) {
        // Handle success response from the controller
        console.log(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        // Handle error response from the controller
        console.log(xhr.responseText);
      },
    });

  })
}
