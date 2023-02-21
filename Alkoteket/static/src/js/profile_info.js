console.log("This is outside the profile_info module!");
// document.addEventListener("DOMContentLoaded", function (event) {
  console.log("This is the profile_info module!");
  odoo.define("profile_info", function (require) {
    console.log(
      "------------------------_IM INSIDE!-----------------------------------"
    );
    var ajax = require("web.ajax");
    var id = window.location.search.split("?")[1];

    if (id === undefined) {
      id = 0;
    }

    ajax.rpc("/users/" + id).then(function (data) {
      console.log("Inside ajax")
      console.log(data)

        try {
          // Parse the JSON response
          var userData = JSON.parse(data);

          // Create HTML for the user profile
          var profileHtml = `
        <h1>java PROFILE</h1>
        <h1>${userData.name}</h1>
        <p>Email: ${userData.email}</p>
        <p>Login date: ${userData.login_date}</p>
        <p>${userData.active}</p>
        <img src="data:image/jpg;base64,${userData.image_1920}" alt="User Image">
        <!-- Add additional fields as needed -->
      `;
 
          // Insert the profile HTML into the element with id="profile-info"
          var profileInfoElem = document.getElementById("profile-info");
          if (profileInfoElem) {
            profileInfoElem.innerHTML = profileHtml;
          } else {
            console.error("Element with id='profile-info' not found.");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      })
      .catch(function (error) {
        console.error("Error retrieving user data:", error);
      });

    // ajax
    //   .get("/users/" + id, {})
    //   .then(function (data) {
    //     console.log("Inside ajax")
    //     try {
    //       // Parse the JSON response
    //       var userData = JSON.parse(data);

    //       // Create HTML for the user profile
    //       var profileHtml = `
    //     <h1>java PROFILE</h1>
    //     <h1>${userData.name}</h1>
    //     <p>Email: ${userData.email}</p>
    //     <p>Login date: ${userData.login_date}</p>
    //     <img src="${userData.image_1920}" alt="User Image">
    //     <!-- Add additional fields as needed -->
    //   `;

    //       // Insert the profile HTML into the element with id="profile-info"
    //       var profileInfoElem = document.getElementById("profile-info");
    //       if (profileInfoElem) {
    //         profileInfoElem.innerHTML = profileHtml;
    //       } else {
    //         console.error("Element with id='profile-info' not found.");
    //       }
    //     } catch (error) {
    //       console.error("Error parsing user data:", error);
    //     }
    //   })
    //   .catch(function (error) {
    //     console.error("Error retrieving user data:", error);
    //   });
  });
// });
