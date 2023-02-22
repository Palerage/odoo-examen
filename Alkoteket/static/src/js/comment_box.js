// Check if current URL path is '/drinkview'
if (window.location.pathname === "/drinkview") {
  console.log("----------------------------HEJ HEJ HEJ----------------");
  // Define a module named 'show_drinks'
  odoo.define("comment_box", function (require) {
    console.log("----------------------------DÅ DÅ DÅ DÅ----------------");
    // Import 'web.ajax' module
    var ajax = require("web.ajax");

    // Get the 'id' parameter from the URL query string
    id = window.location.search.split("?")[1];

    // Call an RPC method to retrieve drink data based on the 'id' parameter
    ajax.rpc("/alkoteket/drink/" + id).then(function (data) {
      console.log(
        "---------------------------- !!!!!!!!!!!!!!!!!!!!!!!!!! ----------------"
      );

      console.log(data);

      // Parse the data returned from the server and store it in an array named 'drink'
      var drink = [JSON.parse(data)];
      console.log(drink);

      // Define a variable to store the HTML template for displaying reviews
      var reviewTemplate = "";

      // Loop through each drink in the 'drink' array
      drink.forEach(function (drink) {
        // Loop through each review in the 'reviews' array of the current drink
        drink.reviews.forEach(function (review) {
          // Add a new paragraph to the 'reviewTemplate' variable for the current review
          reviewTemplate += `<p>Score: ${review.score}<br>Review: ${review.review}<br>Created By: ${review.reviewer_name}</p>`;
        });

        // Insert the 'reviewTemplate' HTML into the 'comment-box' element on the page
        document
          .querySelector("#comment-box")
          .insertAdjacentHTML("beforeend", reviewTemplate);
      });
    });
  });
}
