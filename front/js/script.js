// Script JS pour afficher tous les produits retournés par l'API

//ETAPE 3 : Insérer les produits dans la page d'accueil

// Appel de l'API pour récupérer et afficher tous les produits disponibles : méthode GET*/
fetch("http://localhost:3000/api/products")
.then(function(response) {
  return response.json();
})
.catch(function(err) { 
    const errorElement = document.querySelector(".titles");
    const elementError = document.createElement("h1");
    elementError.innerText = "erreur 404";
    errorElement.appendChild(elementError);
    console.log("erreur 404, sur ressource api:" + err);
})
.then (function(products) {
  displayAllProducts(products);
  console.table(products);
});

// fonction d'affichage des produits de l'API sur la page index, appelée plus haut :
function displayAllProducts(products) { 
  for (let i in products) {

    const allProductsDisplay = document.querySelector(".items"); 

    //Etape 4 : faire le lien entre la page d'accueil et la page produit. 
    const OneProductLinkDisplay = document.createElement("a");
    OneProductLinkDisplay.href += "./product.html?id=" + products[i]._id;
  
    const OneProductDisplay = document.createElement("article");
    
    const OneProductImageDisplay = document.createElement("Img");
    OneProductImageDisplay.src = products[i].imageUrl;
    OneProductImageDisplay.setAttribute("alt", products[i].altTxt);
    
    const OneProductNameDisplay = document.createElement("h3");
    OneProductNameDisplay.classList.add("productName");
    OneProductNameDisplay.innerText = products[i].name;

    const OneProductDescriptionDisplay = document.createElement("p");
    OneProductDescriptionDisplay.classList.add("productDescription");
    OneProductDescriptionDisplay.innerText = products[i].description;
    
    OneProductDisplay.appendChild(OneProductImageDisplay);
    OneProductDisplay.appendChild(OneProductNameDisplay);
    OneProductDisplay.appendChild(OneProductDescriptionDisplay);
    
    OneProductLinkDisplay.appendChild(OneProductDisplay);
    allProductsDisplay.appendChild(OneProductLinkDisplay);
    }
}
