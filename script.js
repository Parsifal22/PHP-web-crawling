const dashboardElement = document.getElementById("dashboard");

// Make an AJAX request to the PHP file
fetch("/Api.php")
  .then(response => response.json())
  .then(data => {
    // Check if there's an error
    if (data.error) {
      dashboardElement.innerHTML = `Error: ${data.error}`;
    } else {
      // Display the data on the dashboard
      const productList = data.map(product => {
        return `
          <div>
            <h2>${product.title}</h2>   
            <p>Category: ${product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Price with discount: ${product.discountPrice}</p>
          </div>
        `;
      }).join("");

      dashboardElement.innerHTML = productList;
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });