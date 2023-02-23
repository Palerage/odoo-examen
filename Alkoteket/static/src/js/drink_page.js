if (window.location.pathname === "/drinkview") {
  odoo.define("drink_page", function (require) {
    var ajax = require("web.ajax");

    id = window.location.search.split("?")[1];

    function AddToFavourite() {
      ajax.rpc("/alkoteket/addfavourite/" + id).then(function (data) {
        console.log("Added");
      });
    }

    function RemoveFavourite() {
      ajax.rpc("/alkoteket/removefavourite/" + id).then(function (data) {
        console.log("Removed");
      });
    }

    console.log(id);

    ajax.rpc("/alkoteket/drink/" + id).then(function (data) {
      console.log(data);
      var drink = [JSON.parse(data)];
      console.log(drink);

      for (let index = 0; index < drink.length; index++) {
        const element = drink[index];
        console.log(element);
      }
      drink.forEach(function (drink) {
        var drinkTemplate = `
                    <section class="drinkcontainer">

                      <div class="receptgrid">

                        <div class ="receptbox">
                          <h4>${drink.name}</h4>                            
                          <hr>
                          <div class="picture">
                            <img src="data:image/jpg;base64,${drink.image}"/>
                            <div class="favorite">
                              <i id="icon-1" class="bi bi-heart"></i>
                              <i id="icon-2" class="bi bi-heart-fill" style="display: none;"></i>
                            </div>
                          </div>
                          <div class="creator">
                            <p>Created by: </p>
                            <a href="${"/profile?" + drink.creator_id}">
                              <p> ${drink.creator_name}</p>
                            </a>
                          </div>
                          <p>Date: ${drink.drink_create_date.split(" ")[0]}</p>
                        </div>
                        <div class ="receptbox ">
                          <div class="ratingtop">
                            <div class="rating_section">
                              <span class="fa fa-star-o" data-rating="1"></span>
                              <span class="fa fa-star-o" data-rating="2"></span>
                              <span class="fa fa-star-o" data-rating="3"></span>
                              <span class="fa fa-star-o" data-rating="4"></span>
                              <span class="fa fa-star-o" data-rating="5"></span>
                            </div>
                          </div>                        
                          <div class="drinkfacts">
                            <p style="font-style: italic; color:grey;">Reviews: ${
                              drink.review_amount
                            }</p> 
                            <p style="font-style: italic; color:grey;">Score: ${
                              drink.average_score
                            } / 5</p> 
                          </div>
                          <hr>
                        <h4>Ingredients</h4>
                        <hr>
                          `;

        for (let index = 0; index < drink.ingredients.length; index++) {
          const element = drink.ingredients[index];

          drinkTemplate += `<p>${element.name + " " + element.qty + " cl"}</p>`;
        }

        if (drink.note == false) {
          drink.note = "No description available.";
        }

        drinkTemplate += `
                          <p style="font-style: italic; color:grey;">Alcohol volume: ${drink.alcohol_percentage} %</p>
                          <h4>Description</h4>
                          <hr>
                          <p>${drink.note}</p>
                        </div>                        
                      </div>                      
                    </section>                  
                      `;
        document
          .querySelector("#drink-page")
          .insertAdjacentHTML("beforeend", drinkTemplate);

        const icon1 = document.getElementById("icon-1");
        const icon2 = document.getElementById("icon-2");

        if (drink.favourite == false) {
          icon2.style.display = "none";
          icon1.style.display = "inline-block";
        } else {
          icon1.style.display = "none";
          icon2.style.display = "inline-block";
        }

        icon1.addEventListener("click", function () {
          AddToFavourite();
          icon1.style.display = "none";
          icon2.style.display = "inline-block";
        });

        icon2.addEventListener("click", function () {
          RemoveFavourite();
          icon2.style.display = "none";
          icon1.style.display = "inline-block";
        });
      });
    });
  });
}
