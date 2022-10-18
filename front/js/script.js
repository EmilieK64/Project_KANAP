// Script JS pour afficher tous les produits retournés par l'API (étape 3) et faire le lien entre la page accueil et la page produit (étape 4):

//ETAPE 3 : Nous insérons les produits dans la page d'accueil : 

/**
 * Appel de l'API pour récupérer et afficher tous les produits disponibles : avec la méthode "GET" puis avec l'appel de la fonction définie plus bas "displayAllProducts(products)";
 */
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
  //console.table(products);
});

/**
 * Nous insérons les produits fournis par l'API dans le DOM de manière dynamique et affichons donc les produits sur la page Index. Nous faisons également le lien entre la page accueil et la page produit.
 * 
 * @param {Array} products 
 * @return void
 */
function displayAllProducts(products) { 
  // Grâce à une boucle pour parcourir la réponse retournée par l'API :
  for (let i in products) {
    // Nous rattachons dynamiquement à l'élément parent qui a la classe "items" dans la page "Index" les balises que nous créons avec leur contenu et leurs attributs.
    const allProductsDisplay = document.querySelector(".items"); 
    //Etape 4 : nous faisons le lien entre la page d'accueil et la page produit via le paramétrage de la balise “a” et son attribut “href.
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
