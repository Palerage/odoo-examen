if (window.location.pathname === "/profile") {
  var count = 10;
  odoo.define("fav_drinks", function (require) {
    //Fulfix
    if($("#profile-drinks")){
      return
    }
    var ajax = require("web.ajax");
    var id = window.location.search.split("?")[1];

    if (id === undefined) {
      id = 0;
    }

    ajax.rpc("/alkoteket/favouritesbyuser/" + id).then(function (data) {
      var drinks = JSON.parse(data);
      count = drinks.length;
      console.log(drinks);

      drinks.forEach(function (drink) {
        var drinkTemplate = `
        <section class="drinkcontainer">
        <a href="${"/drinkview?" + drink.id}">
          <div class="box">
            <div class="img-gradient">
              <img src="data:image/jpg;base64,${drink.image}"/>                 
            </div>
            <h5>${drink.name}</h5>
            <div class="rating_section">
              <div class="Stars" style="--rating: ${
                drink.average_score
              };"></div>
              <p>(${drink.review_amount})</p>                
          </div>
          </div>
        </a>
      </section>
                    `;
        document
          .querySelector("#fav-drinks")
          .insertAdjacentHTML("beforeend", drinkTemplate);
      });

      // Create the h3 element
      var h3 = document.createElement("h3");
      h3.innerHTML = "Favourites" + " (" + count + ")";
      h3.style.display = "inline-block";

      // Create the <i> element and add the "fa-toggle-off" class to it
      var toggleIcon = document.createElement("i");
      toggleIcon.classList.add("bi-caret-down");

      // Create the div container
      var togglesection = document.createElement("div");
      togglesection.classList.add("togglesection");
      togglesection.style.display = "flex";
      togglesection.style.cursor = "pointer";

      // Append the h3 and toggle button to the div container
      togglesection.appendChild(h3);
      togglesection.appendChild(toggleIcon);

      // Insert the div container before the content container
      document
        .querySelector("#fav-drinks")
        .insertAdjacentElement("beforebegin", togglesection);

      // Get the content container element
      var contentContainer = document.querySelector("#fav-drinks");
      // Set the initial value of the content container to "none"
      contentContainer.style.display = "none";

      // Add a click event listener to the toggle section
      togglesection.addEventListener("click", function () {
        if (contentContainer.style.display === "none") {
          contentContainer.style.display = "grid";
          toggleIcon.classList.remove("bi-caret-down");
          toggleIcon.classList.add("bi-caret-up");
        } else {
          contentContainer.style.display = "none";
          toggleIcon.classList.remove("bi-caret-up");
          toggleIcon.classList.add("bi-caret-down");
        }
      });
    });
  });
}
