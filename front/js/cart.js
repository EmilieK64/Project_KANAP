//  ETAPE 8 : Afficher un tableau récap des achats dans la page panier
const cart = {

    // URL de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du fetch (Méthode GET)
    fetchOptions : {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    },

    // On initialise le nb total d'articles et le prix total à afficher sur la page panier (variables utilisées dans la fonction buildHtmlArticle())
    nbArticles: 0,
    totalPrice: 0,


    /**
     * Récupère le contenu du panier (via localStorage) pour insérer les produits dans le DOM
     */
    displayCart: function() {
        // On recharge la page pour rafraichir le contenu du panier (nécessaire si on a supprimé / ajouté plusieurs produits)
        if (!localStorage.getItem('firstLoad')) { // on sait qu'il n'y a rien à firstload la 1ere fois, on le l'a jamais créee, de ce fait quand on arrive sur la page panier on force le rafraichissement. 
            setTimeout(() => {
                window.location.reload();
            }, '100');
            localStorage.setItem('firstLoad', true); // et on indique la valeur true.
        } else {
            localStorage.removeItem('firstLoad'); 
        }

        // On récupère le contenu du panier sous la forme d'un array contenant les objets produits avec les les clés : id, color, quantity
        const cartRetrieved = localStorage.getItem('cart');
        //console.log(cartRetrieved);

        // Si le panier contient au moins 1 produit, alors on fait le traitement pour son affichage
        if (cartRetrieved !== '[]') {
            const cartContent = JSON.parse(cartRetrieved);
            // On boucle sur le panier pour lire et récupérer chaque ligne (c.a.d id produit, couleur et quantité de chaque objet produit)
            // for (const product of cartContent) {
            for (let index = 0; index < cartContent.length; index++) { // tant que l'index est inférieur à la longueur du tableau
                // On va construire dynamiquement le tableau des produits contenus dans le panier
                cart.buildHTMLArticle(cartContent[index], index);
            }
        } else { // Si le panier est vide ; on modifie le texte du h1 pour le préciser
            const h1Element = document.querySelector('h1');
            h1Element.textContent = 'Votre panier est vide';
        }
    },
    /**
     * 
     * @param {Array} product 
     * @param {Integer} index 
     * 
     * @returns void
     */
 buildHTMLArticle: function(product, index) { // product correspond à chaque objet produit
    // On cible la section, parent des articles produits (section ayant l'id 'cart__items')
    const sectionElement = document.getElementById('cart__items');

    const articleElement = document.createElement('article');
    articleElement.classList.add('cart__item');
    articleElement.dataset.id = product.id;
    articleElement.dataset.color = product.color;

    // On appelle l'API pour récupérer les infos manquantes du produit cad : image, nom, prix, altTxt
   cart.getProduct(product.id, index);

    // On récupère les données du produit que l'on avait mises dans le localStorage : image, nom, prix, altTxt
    const productFieldsKey = index.toString();
    const productFields = localStorage.getItem(productFieldsKey);
    console.log(productFields);

    // On split la string pour tout avoir dans un array
    const productFieldsArray = productFields.split(',');
    console.log(productFieldsArray);
    
    
//On affiche les informations du panier en rattachant tous les éléments au DOM et avec les valeurs dynamiques
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
    articleImage.setAttribute("alt", productFieldsArray[3]);

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

    // Pour chaque produit, on va stocker la quantité totale d'articles et le prix
    cart.nbArticles += parseInt(product.quantity); // par sécurité, on parse les quantités pour être sûr de travailler avec des entiers
    // console.log(cart.nbArticles);
    cart.totalPrice += parseInt(product.quantity * productFieldsArray[2]);
    //console.log(cart.totalPrice);

    // Dernier point de l'étape 8 : afficher le nb d'articles total et le prix total
    cart.displayTotal(cart.nbArticles, cart.totalPrice);
    // Nb d'articles = somme des product.quantity
    // Prix total = pour chaque produit : product.quantity x productFieldsArray[2](= price)
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
                const productFields = [objectProduct.imageUrl, objectProduct.name, objectProduct.price, objectProduct.altTxt];//création d'un tableau contenant une liste image, nom, prix, altTxt.
                console.log(productFields);
                // On stocke les données dans le localStorage pour l'utiliser dans la construction du panier
                const productFieldsKey = index.toString();
                console.log(productFieldsKey);
                localStorage.setItem(productFieldsKey, productFields);//sauvegarde dans le local storage à un clé commençant par 0, puis 1, puis 2 
                return objectProduct;
            });
        }
    },
    /**
     * 
     * @param {Integer} nbArticles 
     * @param {Integer} totalPrice 
     */
    displayTotal: function(nbArticles, totalPrice) {
        // On récupère les éléments prévus pour afficher les totaux
        // cad ceux ayant les id totalQuantity et totalPrice
        const totalQuantityElement = document.getElementById('totalQuantity');
        const totalPriceElement = document.getElementById('totalPrice');

        // On leur assigne les bonnes valeurs
        totalQuantityElement.textContent = nbArticles;
        totalPriceElement.textContent = totalPrice;
    },

    // ETAPE 9 : on doit mettre un écouteur d'événement sur le lien "Supprimer"
    // L'écouteur doit réagir au clic sur le lien et supprimer l'article du produit concerné

    /**
     * 
     * @param {Event} event 
     * @return void
     */
    handleDeleteLink: function(event) {
        // On récupère le lien cliqué
        const currentElement = event.currentTarget;
         
        // On supprime du panier le produit supprimé
        // On récupère le produit concerné
        // NB : il faut l'id ET la couleur pour ne pas tout supprimer à tord
        // On passe par les dataset id et color
        const articleElement = currentElement.closest('article');
        const productId = articleElement.dataset.id;
        // console.log(productId);
        const productColor = articleElement.dataset.color;
        // console.log(productColor);
        
        // On supprime du DOM l'article concerné en ciblant la balise article parente la plus proche du lien
        articleElement.remove();

        // On récupère le contenu du panier
        const cartRetrieved = cart.getCart();

        // On supprime du panier l'article supprimé
        // On boucle sur le panier pour trouver l'article supprimé
        const foundProductById = cartRetrieved.find(p => p.id == productId);
        // console.log(foundProductById);

        if (foundProductById != undefined) {
            // On a trouvé un produit id correspondant
            // On vérifie maintenant si la couleur correspond aussi au produit à ajouter
            const foundProductByColor = cartRetrieved.find(p => p.color == productColor);
            // console.log(foundProductByColor);

            if (foundProductByColor != undefined) {
               // On a trouvé le produit à supprimer
               // On appelle une fonction dédiée à la suppression
               cart.removeArticleById(cartRetrieved, productId);
               // On appelle displayCart() pour mettre à jour le panier (page + données)
               cart.displayCart(); 
            }                    
        } else {
            // On ne trouve pas de produit correspondant dans le panier => on affiche une erreur dans la console
            console.error('Le produit à supprimer n\'est pas dans le panier');
        }

        // On stocke le panier dans le localStorage
        cart.saveCart(cartRetrieved);
    },

    /**
     * Récupère le panier via le localStorage
     * @returns Array
     */
    getCart: function() {
        let cart = localStorage.getItem('cart');
        if (cart == null) {
            return [];
        } else {
            return JSON.parse(cart);
        }
    },

    /**
     * Enregistre le panier dans le localStorage
     * @param {Object} cart 
     */
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    /**
     * Supprime du panier un article correspondant au produit supprimé
     * @param {Array} array 
     * @param {String} id 
     * @returns mixed Array | String | Bool
     */
    removeArticleById: function(array, id) {
        // On cherche l'article via son indice avec la méthode findIndex()
        const requiredIndex = array.findIndex(element => { //findIndex
            // Si l'article est trouvé, on retourne l'id (sous forme de string)
           return element.id === String(id);
        });

        // Si l'indice n'est pas trouvé, on retourne false
        if (requiredIndex === -1) { //si pas trouvé : retourne -1, c'est lié à la fonction native
           return false;
        };
        // Si l'indice n'est pas trouvé, on supprime l'article correspondant à l'indice et on retourne l'array obtenu
        return !!array.splice(requiredIndex, 1);
    },

    /**
     * ETAPE 9 : on doit mettre un écouteur d'événement sur les quantités produits
     * Ecouteur d'événement qui réagit au changement de valeur 
     * @param {Event} event 
     */
    handleModifyQuantity: function(event) {
        // On récupère l'élément modifié et l'article parent associé
        const currentTarget = event.currentTarget;
        const articleElement = currentTarget.closest('article');

        // On récupère l'id et la couleur du produit concerné
        const productId = articleElement.dataset.id;
        const productColor = articleElement.dataset.color;

        // On récupère le contenu du panier
        const cartRetrieved = cart.getCart();

        // On doit mettre à jour le panier
        // On boucle sur le panier pour trouver l'article concerné
        const foundProductById = cartRetrieved.find(p => p.id == productId);

        if (foundProductById != undefined) {
            // On a trouvé un produit id correspondant
            // On vérifie maintenant si la couleur correspond aussi au produit à ajouter
            const foundProductByColor = cartRetrieved.find(p => p.color == productColor);
            // console.log(foundProductByColor);

            if (foundProductByColor != undefined) {
               // On a trouvé le produit à mettre à jour
               // On fait la modification de la quantité du produit
               foundProductByColor.quantity = currentTarget.value;
            }                    
        } else {
            // On ne trouve pas de produit correspondant dans le panier => on affiche une erreur dans la console
            console.error('Le produit à mettre à jour n\'est pas dans le panier');
        }

        // On stocke le panier dans le localStorage
        cart.saveCart(cartRetrieved);
        // On rafraichit la page
        window.location.reload();
    },
};


// Ecouteur d'événement pour appeler displayCart() une fois la page chargée
document.addEventListener('DOMContentLoaded', cart.displayCart);

// On ajoute un écouteur d'événement qui réagit au clic sur les liens "Supprimer"
document.addEventListener('DOMContentLoaded', function() {
    // On cible les éléments ayant la classe deleteItem
    const deleteLinks = document.getElementsByClassName('deleteItem');
   
    // On boucle sur ces éléments pour leur poser un écouteur
    for (let link of deleteLinks) {
        link.addEventListener('click', cart.handleDeleteLink);    
    }

    // On cible les éléments ayant la classe itemQuantity
    const itemQuantityElements = document.getElementsByClassName('itemQuantity');

    // On boucle sur ces éléments pour leur poser un écouteur
    for (let itemQuantity of itemQuantityElements) {
        itemQuantity.addEventListener('change', cart.handleModifyQuantity);
    }
});
