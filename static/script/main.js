function sendActionData(postData){
     // Convert the data to JSON format
     var jsonData = JSON.stringify(postData);

     // Send POST request using Fetch API
     fetch("putNextAction", {
         method: "POST",
         headers: {
             "Content-Type": ""
         },
         body: jsonData
     })
     .then(response => {
         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         return response.json(); // Parse the JSON data in the response
     })
     .then(data => {
         console.log("POST request successful");
         console.log(data); // Handle response data here
     })
     .catch(error => {
         console.error('There was a problem with your fetch operation:', error);
     });
 }

 // Function to show the spinner
function showSpinner(buttonId) {
    var button = document.getElementById(buttonId);
    button.querySelector(".spinner").style.display = "inline-block";
    button.querySelector(".buttonText").style.paddingRight = "0px";
}

// Function to hide the spinner
function hideSpinner(buttonId) {
    var button = document.getElementById(buttonId);
    button.querySelector(".spinner").style.display = "none";
    button.querySelector(".buttonText").style.paddingRight = "70px";
}

// Simulate loading progress
function executeLoadBar(buttonId, duration) {
    var button = document.getElementById(buttonId);
    var loadingBar = button.querySelector(".loading-bar");
    
    
    loadingBar.style.backgroundColor = "#3498dbff"; // Loading bar color 
    var width = 0;
    var interval = setInterval(function() {
      if (width >= 100) {
        loadingBar.style.width = "100%"
        loadingBar.style.backgroundColor = "#ffffff00";
        clearInterval(interval);
        setTimeout(function() {
            loadingBar.style.width = "0%"; //reset the bar
        }, 2000); // Wait
      } else {
        width += 10; // Increase width by 10% (adjust as needed)
        loadingBar.style.width = width + "%";
      }
    }, duration/10); // Adjust the interval as needed
}

function monitorActionStatus(actionId){

    var interval;
    var loadBarVisible = false;

    function getActionStatus(){
        fetch("getActionStatus/" + actionId, {
            method: "GET",
        }).then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the fetched data
            console.log(data);
            if (data["status"] == "executing"){
                hideSpinner(data["action_id"])
                if (!loadBarVisible){
                    loadBarVisible = true;
                    executeLoadBar(data["action_id"], Math.floor(data["remaining_execution_duration"]));
                }
            }
            if (data["status"] == "waiting"){
                loadBarVisible = false;
                showSpinner(data["action_id"]);
            }
            if (data["status"] == "free"){
                hideSpinner(data["action_id"]);
                loadBarVisible = false;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    interval = setInterval(getActionStatus, 900 + Math.floor(Math.random()*100))

}

// Function unction to make a POST request
/*function makePostRequest() {
    // Show spinner when making the request
    showSpinner();

    // Example POST request using Fetch API
    fetch("your_api_endpoint_here", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ /* Your request body here *//* })
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON data in the response
    })
    .then(data => {
        console.log("POST request successful");
        console.log(data); // Handle response data here
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        // Ensure spinner is hidden even if an error occurs
        hideSpinner();
    });
}*/

// Setup Event Listeners

document.getElementById("1").addEventListener("click", function() {
    // Data to be sent in the POST request
    var postData = {
        action_type_id: "1",
        description: "This is the first action"
    };

    showSpinner("1")
    sendActionData(postData);
});

document.getElementById("2").addEventListener("click", function() {
    // Data to be sent in the POST request
    var postData = {
        action_type_id: "2",
        description: "Move item from blue position"
    };

    showSpinner("2")
    sendActionData(postData);
});

document.getElementById("3").addEventListener("click", function() {
    // Data to be sent in the POST request
    var postData = {
        action_type_id: "3",
        description: "Move home"
    };

    showSpinner("3")
    sendActionData(postData);
});

document.getElementById("4").addEventListener("click", function() {
    // Data to be sent in the POST request
    var postData = {
        action_type_id: "4",
        description: "Realign"
    };

    showSpinner("4")
    sendActionData(postData);
});

document.getElementById("5").addEventListener("click", function() {
    // Data to be sent in the POST request
    var postData = {
        action_type_id: "5",
        description: "Move item from red position"
    };

    showSpinner("5")
    sendActionData(postData);
});


monitorActionStatus("1");
monitorActionStatus("2");
monitorActionStatus("3");
monitorActionStatus("4");
monitorActionStatus("5");