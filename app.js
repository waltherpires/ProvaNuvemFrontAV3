const productList = document.querySelector("#products");
const addProductForm = document.querySelector("#add-product-form");
const updateProductForm = document.querySelector("#update-product-form");
const updateProductId = document.querySelector("#update-id");
const updateProductName = document.querySelector("#update-name");
const updateProductDescription = document.querySelector("#update-description");
const updateProductPrice = document.querySelector("#update-price");

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch("http://localhost:3000/products");
  const products = await response.json();

  products.sort((a, b) => a.id - b.id);

  // Clear product list
  productList.innerHTML = "";

  // Add each product to the list
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - $${product.price}`;
    if (product.description) {
      li.innerHTML += ` - Descrição: ${product.description}`;
    }

    // Add delete button for each product
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.addEventListener("click", async () => {
      const name = addProductForm.elements["name"].value;
      const price = addProductForm.elements["price"].value;
      const description = addProductForm.elements["description"].value;
      await updateProduct(product.id, name, price, description);
      await fetchProducts();
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = addProductForm.elements["name"].value;
  const price = addProductForm.elements["price"].value;
  const description = addProductForm.elements["description"].value;
  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

async function updateProduct(id, name, price, description) {
  const response = await fetch("http://localhost:3000/products/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, price, description }),
  });
  return response.json();
}
// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, price, description }),
  });
  return response.json();
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch("http://localhost:3000/products/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify({id})
  });
  return response.json();
}

// Fetch all products on page load
fetchProducts();
