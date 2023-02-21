if (window.location.pathname === "/browse") {
  odoo.define("show_drinks", function (require) {
    var ajax = require("web.ajax");

    console.log("1");

    ajax
      .rpc("/alkoteket/cocktails/random2", { count: 100 })
      .then(function (data) {
        console.log(data);
        var drinks = JSON.parse(data);
        console.log(drinks);

        for (let index = 0; index < drinks.length; index++) {
          const element = drinks[index];
          console.log(element);
        }
        drinks.forEach(function (drink) {
          var drinkTemplate = `
          <section class="drinkcontainer">
                <a href="${"/drinkview?" + drink.id}">
                  <div class="box">
                    <div class="img-gradient">
                  `;

          drinkTemplate += `<img src="data:image/jpg;base64,${drink.image}"/>                    
                    
                    </div>
                    <h5>${drink.name}</h5>
                  </div>
                </a>
              </section>
              `;
          document
            .querySelector("#show-drinks")
            .insertAdjacentHTML("beforeend", drinkTemplate);
        });

        // Add search bar and filter function
        var searchContainer = document.createElement("div");
        // var searchTitle = document.createElement("h3");
        var searchIcon = document.createElement("i");
        var searchBar = document.createElement("input");
        // searchTitle.innerHTML = "Search: ";
        searchContainer.setAttribute("class", "searchcontainer");
        searchIcon.classList.add("bi", "bi-search");
        searchBar.setAttribute("type", "text");
        searchBar.setAttribute("id", "search-input");
        // searchContainer.appendChild(searchTitle);
        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchBar);
        document
          .querySelector("#searchfield")
          .insertAdjacentElement("beforebegin", searchContainer);

        document
          .querySelector("#search-input")
          .addEventListener("input", function () {
            var searchValue = this.value.toLowerCase();
            // var filteredDrinks = drinks.filter(function (drink) {
            //   return drink.name.toLowerCase().includes(searchValue);
            // });
            var filteredDrinks = drinks.filter(function (drink) {
              return (
                drink.name.toLowerCase().includes(searchValue) ||
                drink.ingredients.some(function (ingredient) {
                  return ingredient.name.toLowerCase().includes(searchValue);
                })
              );
            });

            document.querySelector("#show-drinks").innerHTML = "";

            filteredDrinks.forEach(function (drink) {
              var drinkTemplate = `
              <section class="drinkcontainer">
              <a href="${"/drinkview?" + drink.id}">
                <div class="box">
                  <div class="img-gradient">
                `;

              drinkTemplate += `<img src="data:image/jpg;base64,${drink.image}"/>                    
                  
                  </div>
                  <h5>${drink.name}</h5>
                </div>
              </a>
            </section>
              `;
              document
                .querySelector("#show-drinks")
                .insertAdjacentHTML("beforeend", drinkTemplate);
            });
          });
      });
  });
}
