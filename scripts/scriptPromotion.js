const tempPromTableContainer = document.getElementById('temporary-promotion-table-container');
const permDiscContainer = document.getElementById('permament-dicount-table-container');

const printPromotionsBtn = document.getElementById('print-promotions-btn');

printPromotionsBtn.addEventListener('click', printPromotions);

function getTemporaryPromotions() {
    return fetch(`/api/GetTemporaryPromotion.php`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}) // empty object, no search query needed
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        return data; // return the data if it's an array
      } else {
        console.error('API response is not an array:', data);
        return null; // or throw an error, depending on your use case
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return null; // or throw an error, depending on your use case
    });
  }

function getPermamentDiscount() {
    return fetch(`/api/GetPermamentDiscount.php`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({}) // empty object, no search query needed
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
        return data; // return the data if it's an array
        } else {
        console.error('API response is not an array:', data);
        return null; // or throw an error, depending on your use case
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return null; // or throw an error, depending on your use case
    });
}


  function printPromotions() {
    clearElements();

    getTemporaryPromotions().then(tempPromotData => {
      console.log(tempPromotData);
      tempPromTableContainer.innerHTML = `
        <h3>Ajutised Pakkumised</h3>
        <table id="temp-prom-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Price with Discount</th>
              <th>Discount (%)</th>
            </tr>
          </thead>
          <tbody id="products-tbody">
            ${tempPromotData.map(product => {
              const discountPercentage = ((product.price - product.discountPrice) / product.price) * 100;
              return `
                <tr>
                  <td>${product.title}</td>
                  <td>${product.price}</td>
                  <td>${product.discountPrice}</td>
                  <td>${discountPercentage.toFixed(2)}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
      productsTableContainer.style.display = 'block';
    });

    getPermamentDiscount().then(permDiscData => {
        console.log(permDiscData);
        permDiscContainer.innerHTML = `
          <h3>Püsivad Allahindlused</h3>
          <table id="temp-prom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Price with Discount</th>
                <th>Discount (%)</th>
              </tr>
            </thead>
            <tbody id="products-tbody">
              ${permDiscData.map(product => {
                const discountPercentage = ((product.price - product.discountPrice) / product.price) * 100;
                return `
                  <tr>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${product.discountPrice}</td>
                    <td>${discountPercentage.toFixed(2)}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
        productsTableContainer.style.display = 'block';
      });

    }


function clearElements() {
    tempPromTableContainer.innerHTML = '';
    permDiscContainer.innerHTML = '';
    productsTableContainer.innerHTML = '';
    categoriesChartContainer.innerHTML = '';
    pricesChartContainer.innerHTML = '';
}

