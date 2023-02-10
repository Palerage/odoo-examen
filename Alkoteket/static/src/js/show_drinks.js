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
                    <div class="bar">
                    <div style="width:${
                      drink.average_score * 20
                    }%; background-color: ${
            drink.average_score >= 3
              ? "green"
              : drink.average_score >= 1.1
              ? "orange"
              : "red"
          }; height:inherit"></div>
                    </div>
                  `;

          drinkTemplate += `<img src="data:image/jpg;base64,${drink.image}"/>                    
                    
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
        var searchTitle = document.createElement("h3");
        var searchBar = document.createElement("input");
        searchTitle.innerHTML = "Search: ";
        searchContainer.setAttribute("class", "searchcontainer");
        searchBar.setAttribute("type", "text");
        searchBar.setAttribute("id", "search-input");
        searchContainer.appendChild(searchTitle);
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
                <a href="${"/drinkview?" + drink.id}">
                  <div class="box">

                    <img src="data:image/jpg;base64,${
                      drink.image
                    }"/>                    
                    
                    <h5>${drink.name}</h5>
                  
                  </div>
                </a>
              `;
              document
                .querySelector("#show-drinks")
                .insertAdjacentHTML("beforeend", drinkTemplate);
            });
          });
      });
  });
}
