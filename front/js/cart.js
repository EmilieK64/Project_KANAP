const cart = {

    // url de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du fetch (GET)
    fetchOptions : {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    },
    /**
     * Récupère le contenu du panier (via localStorage) pour insérer les produits dans le DOM
     */
     displayCart: function() {
        // On recharge la page pour rafraichir le contenu du panier (nécessaire si on a supprimé / ajouté plusieurs produits)
        if (!localStorage.getItem('firstLoad')) { // on sait qu'il n'y a rien à firstload la 1ere fois, on le l'a jamais créee, quand on arrive sur la page panier donc on force le rafraichissement. 
            setTimeout(() => {
                window.location.reload();
            }, '100');
            localStorage.setItem('firstLoad', true); // et on indique la valeur true.
        } else {
            localStorage.removeItem('firstLoad'); // quand display cart est appelé une 2e fois, on supprime la clé firstload pour revenir à la 1ere condition la 3e fois
        }

        // On récupère le contenu du panier
        const cartRetrieved = localStorage.getItem('cart');
        console.log(cartRetrieved);

        // Si le panier contient au moins 1 produit, alors on fait le traitement pour son affichage
        if (cartRetrieved !== '[]') {
            const cartContent = JSON.parse(cartRetrieved);
            // On boucle sur le panier pour lire et récupérer chaque ligne (cad id produit, couleur et quantité)
            // for (const product of cartContent) {
            for (let index = 0; index < cartContent.length; index++) { // tant que l'index est inférieur à la longueur du tableau
                // On va construire dynamiquement le tableau des produits contenus dans le panier plus tard
                // On créé une nouvelle balise article et ses attributs (classe, data-set, ...)
                cart.buildHTMLArticle(cartContent[index], index);
            }
        } else { // Ici, le panier est vide ; on modifie le texte du h1 pour le préciser
            const h1Element = document.querySelector('h1');
            h1Element.textContent = 'Votre panier est vide';
        }
    },
    /**
     * 
     * @param {Array} product 
     * @param {Integer} index 
     * @param {Integer} nbArticles 
     * @param {Integer} totalPrice
     * 
     * @returns void
     */
 buildHTMLArticle: function(product, index) { // product correspond à chaque objet produit ci desssous
    // On cible la section, parent des articles produits (section ayant l'id 'cart__items')
    // Hotfix pour débugguer l'insertion (non voulue) d'un produit "vide"
    if (product.color == '') {
        return;
    }

    const sectionElement = document.getElementById('cart__items');

    const articleElement = document.createElement('article');
    articleElement.classList.add('cart__item');
    articleElement.dataset.id = product.id;
    articleElement.dataset.color = product.color;

    // On appelle l'API pour récupérer les infos manquantes du produit cad : image, nom, prix
   cart.getProduct(product.id, index);

   // cartcontent = [
//   {
 //       'id' : '545454',
  //      'quantity
    //    color'
//}
//{

//}
   //];
// cartContent[0] {
//    'id' :
//    'quantity' : 2,
//}

    // l'api travaille avec du json. dans un json des clés sont des string. 
    // On récupère les données du produit que l'on avait mises dans localStorage
    const productFieldsKey = index.toString();
    const productFields = localStorage.getItem(productFieldsKey);
    console.log(productFields);

    // On split la string pour tout avoir dans un array
    const productFieldsArray = productFields.split(',');
    console.log(productFieldsArray);
    
    // On construit le HTML du panier en ajoutant tous les éléments enfants de l'article produit et les valeurs dynamiques
    // articleElement.innerHTML = `<div class="cart__item__img">
    // <img src="${productFieldsArray[0]}" alt="Photographie d'un canapé">
    // </div>
    // <div class="cart__item__content">
    // <div class="cart__item__content__description">
    //     <h2>${productFieldsArray[1]}</h2>
    //     <p>${product.color}</p>
    //     <p>${productFieldsArray[2]}</p>
    // </div>
    // <div class="cart__item__content__settings">
    //     <div class="cart__item__content__settings__quantity">
    //     <p>Qté : ${product.quantity}</p>
    //     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
    //     </div>
    //     <div class="cart__item__content__settings__delete">
    //     <p class="deleteItem">Supprimer</p>
    //     </div>
    // </div>
    // </div>`;

//Pour la première partie :    
    //<section id="cart__items">
    //     <!--  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
//ok//        <div class="cart__item__img">
    //          <img src="../images/product01.jpg" alt="Photographie d'un canapé">
    //        </div>
    let parentImageElement = document.createElement("div");
    parentImageElement.classList.add("cart__item__img");
    
    let articleImage = document.createElement("img");
    articleImage.src = productFieldsArray[0];
    articleImage.setAttribute("alt", "Photographie d'un canapé");

    articleElement.appendChild(parentImageElement);
    parentImageElement.appendChild(articleImage);

    //        <div class="cart__item__content">
    //          <div class="cart__item__content__description">
    //            <h2>Nom du produit</h2>
    //            <p>Vert</p>
    //            <p>42,00 €</p>
    //          </div>
    let grandParentDescriptionElement = document.createElement("div");
    grandParentDescriptionElement.classList.add("cart__item__content");
    articleElement.appendChild(grandParentDescriptionElement);

    let parentDescriptionElement = document.createElement("div");
    parentDescriptionElement.classList.add("cart__item__content__description");
    grandParentDescriptionElement.appendChild(parentDescriptionElement);

    let articleName = document.createElement("h2");
    articleName.innerText = productFieldsArray[1];
    parentDescriptionElement.appendChild(articleName);
    
    let articleColor = document.createElement("p");
    articleColor.innerText = product.color;
    parentDescriptionElement.appendChild(articleColor);

    let articlePrice = document.createElement("p");
    articlePrice.innerText = productFieldsArray[2];
    parentDescriptionElement.appendChild(articlePrice);

    //       <div class="cart__item__content__settings">
    //         <div class="cart__item__content__settings__quantity">
    //            <p>Qté : </p>
    //            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    //         </div>
    let grandParentQuantityElement = document.createElement("div");
    grandParentQuantityElement.classList.add("cart__item__content__settings");
    grandParentDescriptionElement.appendChild(grandParentQuantityElement);

    let parentQuantityItem = document.createElement("div");
    parentQuantityItem.classList.add("cart__item__content__settings__quantity");
    grandParentQuantityElement.appendChild(parentQuantityItem);

    let quantityNameElement = document.createElement("p");
    quantityNameElement.innerText = "Qté : " + product.quantity;
    parentQuantityItem.appendChild(quantityNameElement);

    let quantityInputElement = document.createElement("input");
    quantityInputElement.setAttribute("type", "number");
    quantityInputElement.classList.add("itemQuantity");
    quantityInputElement.name = "itemQuantity";
    quantityInputElement.min = "1";
    quantityInputElement.max = "100";
    quantityInputElement.setAttribute("value", product.quantity);
    parentQuantityItem.appendChild(quantityInputElement);

    //         <div class="cart__item__content__settings__delete">
    //            <p class="deleteItem">Supprimer</p>
    //         </div>
    //       </div>
    //     </div>
    //   </article> -->
    // </section>
    let parentDeleteElement = document.createElement("div");
    parentDeleteElement.className = "cart__item__content__settings__delete";
    grandParentQuantityElement.appendChild(parentDeleteElement);
    
    let deleteItem = document.createElement("p");
    deleteItem.classList.add("deleteItem");
    deleteItem.innerText = "Supprimer";
    parentDeleteElement.appendChild(deleteItem);
    
    // On ajoute l'article en tant qu'enfant de la section
    sectionElement.appendChild(articleElement);
},
    /**
     * Récupère un produit à partir de son id
     * @param {String} idProduct
     * @param {Integer} index
     * 
     * @returns {JSON} 
     */
    getProduct: function(idProduct, index) {
        if (idProduct) {
            fetch(cart.apiUrl + idProduct, cart.fetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(objectProduct) {
                console.log(objectProduct);
                const productFields = [objectProduct.imageUrl, objectProduct.name, objectProduct.price];
                // On stocke les données dans le localStorage pour l'utiliser dans la construction du panier
                const productFieldsKey = index.toString();
                localStorage.setItem(productFieldsKey, productFields);
                return objectProduct;
            });
        }
    },
}

// Ecouteur d'événement pour appeler displayCart() une fois la page chargée
document.addEventListener('DOMContentLoaded', cart.displayCart);