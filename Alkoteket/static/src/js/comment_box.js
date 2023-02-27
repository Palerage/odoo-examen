// Check if current URL path is '/drinkview'
if (window.location.pathname === "/drinkview") {
  console.log("----------------------------HEJ HEJ HEJ----------------");
  function deleteReview(review_id) {
    $.ajax({
      url: "/review/delete/" + review_id,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "X-CSRF-Token",
          $('meta[name="csrf-token"]').attr("content")
        );
      },
      success: function (response) {
        // Redirect the user to the reviews page after successful deletion
        location.reload();
      },
      error: function (xhr, status, error) {
        // Handle the error if the review could not be deleted
        alert("Error deleting review: " + error);
      },
    });
  }
  // Define a module named 'show_drinks'
  odoo.define("comment_box", function (require) {
    console.log("----------------------------DÅ DÅ DÅ DÅ----------------");
    // Import 'web.ajax' module
    var ajax = require("web.ajax");

    // Get the 'id' parameter from the URL query string
    id = window.location.search.split("?")[1];

    // Call an RPC method to retrieve drink data based on the 'id' parameter
    ajax.rpc("/alkoteket/drink/" + id).then(function (data) {
      // Parse the data returned from the server and store it in an array named 'drink'
      var drink = [JSON.parse(data)];
      // Define a variable to store the HTML template for displaying reviews
      var reviewTemplate = "";
      // Loop through each drink in the 'drink' array
      drink.forEach(function (drink) {
        // Loop through each review in the 'reviews' array of the current drink
        drink.reviews.forEach(function (review) {
          // Add a new paragraph to the 'reviewTemplate' variable for the current review
          reviewTemplate += `
          <div class="individualcomment">
          <div class="topsection">
          <a href="${"/profile?" + review.created_by_id}">
                    <h5 class="reviewer">${review.reviewer_name}</h5>
                </a> 
                <h5>Rating: ${review.score} / 5</h5>
                </div>
                <div class="middlesection">
                <p>${review.review}</p>
                </div>
                <div class="bottomsection">
                <p>${review.created}</p>
                ${
                  review.created_by_current_user
                    ? '<button onclick="deleteReview(' +
                      review.review_id +
                      ')">Delete</button>'
                    : ""
                }
            </div>
          </div>`;
        });
        // Insert the 'reviewTemplate' HTML into the 'comment-box' element on the page
        document
          .querySelector("#comment-box")
          .insertAdjacentHTML("beforeend", reviewTemplate);
      });
    });
  });
}
