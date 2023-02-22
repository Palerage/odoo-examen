// Check if current URL path is '/drinkview'
if (window.location.pathname === "/drinkview") {
  // Define a module named 'show_drinks'
  odoo.define("show_drinks", function (require) {
    // Import 'web.ajax' module
    var ajax = require("web.ajax");

    // Get the 'id' parameter from the URL query string
    id = window.location.search.split("?")[1];

    // Call an RPC method to retrieve drink data based on the 'id' parameter
    ajax.rpc("/alkoteket/drink/" + id).then(function (data) {
      // Parse the data returned from the server and store it in an array named 'drink'
      var drink = [JSON.parse(data)];

      // Define a variable to store the HTML template for displaying ingredients
      var reviewTemplate;

      // Loop through each drink in the 'drink' array
      drink.forEach(function (drink) {
        // Loop through each ingredient in the 'ingredients' array of the current drink
        for (let index = 0; index < drink.ingredients.length; index++) {
          const element = drink.ingredients[index];

          // Add a new paragraph to the 'reviewTemplate' variable for the current ingredient
          reviewTemplate += `<p>${
            element.name + " " + element.qty + " cl"
          }</p>`;
        }

        // Insert the 'reviewTemplate' HTML into the 'comment-box' element on the page
        document
          .querySelector("#comment-box")
          .insertAdjacentHTML("beforeend", reviewTemplate);
      });
    });
  });
}
