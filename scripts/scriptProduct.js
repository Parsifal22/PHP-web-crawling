const resultsContainer = document.getElementById('results-container');
const productsTableContainer = document.getElementById('products-table-container');
const categoriesChartContainer = document.getElementById('category-chart-container');
const pricesChartContainer = document.getElementById('prices-chart-container');

const printAllProductsBtn = document.getElementById('print-all-products-btn');

printAllProductsBtn.addEventListener('click', getAllProducts);


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
        printCategories(data);
        printPriceRanges(data);
      } else {
        console.error('API response is not an array:', data);
      }
    })
    .catch(error => console.error('Error:', error));
  }


  // Define the printAllProducts function
  function printAllProducts(data) {
    console.log(data);
    clearElements();
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
              <td>${product.discountPrice === "0.00" ? 'Allahindlust pole' : product.discountPrice}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    productsTableContainer.style.display = 'block';
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
  
    // Create pie chart data
    const pieChartData = sortedCategories.map(([category, count]) => ({
      label: category,
      value: count
    }));

    console.log(pieChartData);

    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'categoryChart';
    categoriesChartContainer.appendChild(newCanvas);
    
    const chart = new Chart(newCanvas, {
      type: 'pie',
      data: {
        labels: pieChartData.map(item => item.label),
        datasets: [{
          data: pieChartData.map(item => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }],
      },
      options: {
        title: {
          display: true,
          text: 'Toodete kategooriate graafik'
        }
      }
    });
    categoriesChartContainer.style.display = 'block';
  }


  function printPriceRanges(data) {
    // Create price ranges
    const priceRanges = [
      { label: '1-10 eurot', count: 0 },
      { label: '11-50 eurot', count: 0 },
      { label: '51-80 eurot', count: 0 },
      { label: '81-100 eurot', count: 0 },
      { label: '101-150 eurot', count: 0 },
      { label: '150+ eurot', count: 0 }
    ];
  
    // Count products in each price range
    data.forEach(product => {
      const price = product.discountPrice === "0.00" ? parseFloat(product.price) : parseFloat(product.discountPrice);
      if (price <= 10) {
        priceRanges[0].count++;
      } else if (price <= 50) {
        priceRanges[1].count++;
      } else if (price <= 80) {
        priceRanges[2].count++;
      } else if (price <= 100) {
        priceRanges[3].count++;
      } else if (price <= 150) {
        priceRanges[4].count++;
      } else {
        priceRanges[5].count++;
      }
    });
  
    // Create bar chart data
    const barChartData = priceRanges.map(range => ({
      label: range.label,
      value: range.count
    }));
  
    // Create bar chart
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'priceRangeChart';
    pricesChartContainer.appendChild(newCanvas);
    console.log(barChartData);
    const chart = new Chart(newCanvas, {
      type: 'bar',
      data: {
        labels: barChartData.map(item => item.label),
        datasets: [{
          data: barChartData.map(item => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }],
      },
      options: {
        title: {
          display: true,
          text: 'Toodete hinnaklassid'
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    resultsContainer.style.display = 'block';
  }
