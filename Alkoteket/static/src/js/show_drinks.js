if (window.location.pathname === "/browse") {
  odoo.define("show_drinks", function (require) {
    var ajax = require("web.ajax");
    var drinks;
    console.log("1");

    var page = 1;
    var drinksPerPage = 12;
    var filteredDrinks;
    var totalpages;

    function renderDrinks(filteredDrinks) {
      console.log(filteredDrinks);
      var drinkContainer = document.querySelector("#show-drinks");
      if(drinkContainer == null){
        return
      }
      drinkContainer.innerHTML = "";

      var startIndex = (page - 1) * drinksPerPage;
      var endIndex = startIndex + drinksPerPage;
      var drinksToShow = filteredDrinks.slice(startIndex, endIndex);

      drinksToShow.forEach(function (drink) {
        var drinkTemplate = `
          <section class="drinkcontainer">
            <a href="${"/drinkview?" + drink.id}">
              <div class="box">
                <div class="img-gradient">
                  <img src="data:image/jpg;base64,${
                    drink.image
                  }"/>                 
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
        drinkContainer.insertAdjacentHTML("beforeend", drinkTemplate);
      });

      // Add pagination buttons
      var paginationContainer = document.querySelector("#pagination");
      paginationContainer.innerHTML = "";

      var prevButton = document.createElement("button");
      prevButton.innerHTML = '<i class="bi bi-arrow-left-square-fill"></i>';
      prevButton.disabled = page === 1;
      prevButton.addEventListener("click", function () {
        page--;
        renderDrinks(filteredDrinks);
      });
      paginationContainer.appendChild(prevButton);

      var pagestatus = document.createElement("p");
      pagestatus.innerHTML = `${page} / ${totalpages}`;
      paginationContainer.appendChild(pagestatus);

      var nextButton = document.createElement("button");
      nextButton.innerHTML = '<i class="bi bi-arrow-right-square-fill"></i>';
      nextButton.disabled = endIndex >= filteredDrinks.length;
      nextButton.addEventListener("click", function () {
        page++;
        renderDrinks(filteredDrinks);
      });
      paginationContainer.appendChild(nextButton);
    }

    ajax
      .rpc("/alkoteket/cocktails/random2", { count: 100 })
      .then(function (data) {
        drinks = JSON.parse(data);
        totalpages = Math.floor(drinks.length / drinksPerPage) + 1;
        renderDrinks(drinks);
      });

    // Add search bar and filter function
    var searchContainer = document.createElement("div");
    var searchIcon = document.createElement("i");
    var searchBar = document.createElement("input");
    searchContainer.setAttribute("class", "searchcontainer");
    searchIcon.classList.add("bi", "bi-search");
    searchBar.setAttribute("type", "text");
    searchBar.setAttribute("id", "search-input");
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchBar);
    document
      .querySelector("#searchfield")
      .insertAdjacentElement("beforebegin", searchContainer);

    document
      .querySelector("#search-input")
      .addEventListener("input", function () {
        var searchValue = this.value.toLowerCase();
        filteredDrinks = drinks.filter(function (drink) {
          return (
            drink.name.toLowerCase().includes(searchValue) ||
            drink.ingredients.some(function (ingredient) {
              return ingredient.name.toLowerCase().includes(searchValue);
            })
          );
        });
        page = 1;
        // drinks = filteredDrinks;
        totalpages = Math.floor(filteredDrinks.length / drinksPerPage) + 1;
        renderDrinks(filteredDrinks);
      });
  });
}
