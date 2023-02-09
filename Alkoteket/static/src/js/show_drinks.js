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
}
