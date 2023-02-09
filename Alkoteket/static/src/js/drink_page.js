if (window.location.pathname === "/drinkview") {
  odoo.define("drink_page", function (require) {
    var ajax = require("web.ajax");

    id = window.location.search.split("?")[1];

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
                        <div class ="receptbox">
                        <h4>Rating</h4>
                        <hr>
                        <div class="bar">
                          <div class="fill" id="fill"></div>
                        </div>
                          <div class="drinkfacts">
                            <p style="font-style: italic; color:grey;">Reviews: ${
                              drink.review_amount
                            }</p> 
                            <p style="font-style: italic; color:grey;">Score: ${
                              drink.average_score
                            } / 5</p> 
                          </div>
                        <h4>Ingredients</h4>
                        <hr>
                          `;

        for (let index = 0; index < drink.ingredients.length; index++) {
          const element = drink.ingredients[index];

          drinkTemplate += `<p>${element.name + " " + element.qty + " cl"}</p>`;
        }

        if (drink.note === "") {
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
                  <section class="review">
                      <h4 style="padding: 20px;">Reviews</h4>
                      `;

        for (let index = 0; index < drink.reviews.length; index++) {
          const element = drink.reviews[index];

          drinkTemplate += `
          <div class="reviewbox">
            <div class="reviewtop">
             <a href="${"/profile?" + drink.creator_id}">
              <h5>${element.reviewer_name}</h5>
             </a>
              <p>Score: ${element.score} / 5</p>
            </div>
            <div class="reviewfield">
              <p>${element.review}</p>
            </div>
          </div>
          `;
        }

        drinkTemplate += `
                  </section>
                  `;
        document
          .querySelector("#drink-page")
          .insertAdjacentHTML("beforeend", drinkTemplate);

        const fill = document.getElementById("fill");
        fill.style.width = drink.average_score * 20 + "%";
        if (drink.average_score < 2) {
          fill.style.backgroundColor = "red";
        } else if (drink.average_score < 3) {
          fill.style.backgroundColor = "orange";
        } else {
          fill.style.backgroundColor = "green";
        }

        const icon1 = document.getElementById("icon-1");
        const icon2 = document.getElementById("icon-2");

        icon1.addEventListener("click", function () {
          icon1.style.display = "none";
          icon2.style.display = "inline-block";
        });

        icon2.addEventListener("click", function () {
          icon2.style.display = "none";
          icon1.style.display = "inline-block";
        });
      });
    });
  });
}
