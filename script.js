const resultsContainer = document.getElementById('results-container');
const graphContainer = document.getElementById('graph-container');
const productsTable = document.getElementById('products-table');
const productsTbody = document.getElementById('products-tbody');
const categoriesTable = document.getElementById('categories-table');
const categoriesTbody = document.getElementById('categories-tbody');
const realtimeCrawlingContainer = document.getElementById('realtime-crawling-container');

const printAllProductsBtn = document.getElementById('print-all-products-btn');
const printCategoriesBtn = document.getElementById('print-categories-btn');

printAllProductsBtn.addEventListener('click', getAllProducts);
printCategoriesBtn.addEventListener('click', printCategories);


// Set up authentication headers
const authHeaders = {
    'Authorization': `Basic ${btoa(`admin:password`)}`,
    'Content-Type': 'application/json'
  };


function getAllProducts() {
  fetch(`/Api.php`, {
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

// Rest of the code remains the same


  function printAllProducts(data) {
    console.log(data);
    graphContainer.innerHTML = '';
    categoriesTable.style.display = 'none';
    const productsTableContainer = document.getElementById('products-table-container');
    productsTableContainer.innerHTML = `
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
    productsTableContainer.style.display = 'block';
}

  function printCategories() {
    graphContainer.innerHTML = '';
    productsTable.style.display = 'none';
    categoriesTable.style.display = 'table';
    categoriesTbody.innerHTML = '';
    const categoriesHtml = Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([category, count]) => `
      <tr>
        <td>${category}</td>
        <td>${count}</td>
      </tr>
    `).join('');
    categoriesTbody.innerHTML = categoriesHtml;
  }