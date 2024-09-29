const resultsContainer = document.getElementById('results-container');
const tableContainer = document.getElementById('table-container');

const printAllProductsBtn = document.getElementById('print-all-products-btn');
const printCategoriesBtn = document.getElementById('print-categories-btn');

printAllProductsBtn.addEventListener('click', getAllProducts);
printCategoriesBtn.addEventListener('click', getAllCategories);


// Set up authentication headers
const authHeaders = {
    'Authorization': `Basic ${btoa(`admin:password`)}`,
    'Content-Type': 'application/json'
  };


function getAllProducts() {
  fetch(`/api/GetAllProducts.php`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({}) // empty object, no search query needed
  })
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data)) {
      printAllProducts(data);
    } else {
      console.error('API response is not an array:', data);
    }
  })
  .catch(error => console.error('Error:', error));
}

function getAllCategories() {
  fetch(`/api/GetAllCategories.php`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({}) // empty object, no search query needed
  })
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data)) {
      printCategories(data);
    } else {
      console.error('API response is not an array:', data);
    }
  })
  .catch(error => console.error('Error:', error));
}


  // Define the printAllProducts function
  function printAllProducts(data) {
    console.log(data);
    tableContainer.innerHTML = ''; // Clear the results container
    tableContainer.innerHTML = `
      <table id="products-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Price with Discount</th>
          </tr>
        </thead>
        <tbody id="products-tbody">
          ${data.map(product => `
            <tr>
              <td>${product.title}</td>
              <td>${product.category}</td>
              <td>${product.price}</td>
              <td>${product.discountPrice}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    tableContainer.style.display = 'block';
  }


  function printCategories(data) {
    // Extract categories from data
    const categories = {};
    data.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = 1;
      } else {
        categories[product.category]++;
      }
    });

    // Sort categories by count in descending order
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    // Create table rows for categories
    const categoriesHtml = sortedCategories.map(([category, count]) => `
      <tr>
        <td>${category}</td>
        <td>${count}</td>
      </tr>
    `).join('');

    // Print categories to table
    tableContainer.style.display = 'none';
    tableContainer.innerHTML = `
      <table id="categories-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody id="categories-tbody">
          ${categoriesHtml}
        </tbody>
      </table>
    `;
    tableContainer.style.display = 'block';
  }