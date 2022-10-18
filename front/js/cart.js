// cart.js pour afficher les produits du panier sur la page cart et permettre à l'utilisateur de modifier les quantités, supprimer des articles et commander les produits en remplissant le formulaire (étapes 8 à 11).

// Création d'un module "cart" avec ses méthodes et ses propriétés
const cart = {
    // Configuration du Fetch qui va être utilisé dans la fonction getProduct(idProduct, index).
    // URL de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du fetch (Méthode GET)
    fetchOptions : {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    },

    // Nous initialisons le nb total d'articles et le prix total à afficher sur la page panier : variables utilisées dans la fonction "buildHtmlArticle(product, index).
    nbArticles: 0,
    totalPrice: 0,

    /**
     * Etape 8 : nous affichons le contenu du panier via l'insersion des produits récupérés du localStorage dans le DOM.
     */
    displayCart: function() {
        // Nous raffraichissons le contenu du panier de la page "cart" alors que celle-ci est ouverte  
        if (!localStorage.getItem("firstLoad")) {  
            setTimeout(() => {
                window.location.reload();
            }, '100');
            localStorage.setItem("firstLoad", true); 
        } else {
            localStorage.removeItem("firstLoad"); 
        }
        // Nous récupérons le contenu du panier à la clé "cart"
        const cartRetrieved = localStorage.getItem("cart");
        //console.log(cartRetrieved);
        // Si le panier contient au moins 1 produit, nous réalisons le traitement pour son affichage
        if (cartRetrieved !== '[]') {
            const cartContent = JSON.parse(cartRetrieved);
            // Nous parcourons le panier (Array)
            // for (const product of cartContent) { possible aussi
            for (let index = 0; index < cartContent.length; index++) { 
                //Nous appelons la fonction ci-dessous qui va afficher dynamiquement via le DOM les données récupérées.
                cart.buildHTMLArticle(cartContent[index], index);
            }
        } else { 
            // Si le panier est vide nous l'affichons.
            const h1Element = document.querySelector('h1');
            h1Element.textContent = 'Votre panier est vide';
        }
    },

    /**
     * Suite de l'étape 8
     * Nous insérons les informations sur les produits issues du panier : via le DOM et les affichons.
     * Nous rajoutons les informations manquantes qui ne sont pas dans le panier en faisant une requête auprès de l'API.
     * Lorsque la fonction est appelée par la fonction displayCart(), c'est avec les arguments (cartContent[index], index) au sein d'une boucle. cartContent est un Array d'objets (produits).
     * 
     * @param {Array} product 
     * @param {Integer} index 
     * @param {Integer} nbArticles 
     * @param {Integer} totalPrice
     * 
     * @returns void
     */
 buildHTMLArticle: function(product, index) { 
    // Nous ciblons la section parent des articles produits (section ayant l'id 'cart__items')
    const sectionElement = document.getElementById('cart__items');
    //Nous ajoutons les balises utiles et leurs attributs en l'occurence data-id et data-color.
    const articleElement = document.createElement('article');
    articleElement.classList.add('cart__item');
    articleElement.dataset.id = product.id;
    articleElement.dataset.color = product.color;

    // Nous appelons l'API pour récupérer les infos manquantes des produits c.a.d : image, nom, prix, altTxt sous forme d'Array et nous les stockons dans le localStorage à la clé correspondante à l'indice. Dans l'appel à l'API ceux sont les id des produits du panier qui sont récupérés auprès de l'API puisque cette fonction est appelée au sein de buildHtmlArticle(CartContent[i], index) et au sein d'une boucle.
    cart.getProduct(product.id, index);

    // Nous récupérons les données manquantes des produits que nous avions mises dans le localStorage: image, nom, prix, altTxt sous forme de string.
    const productFieldsKey = index.toString();
    const productFields = localStorage.getItem(productFieldsKey);
    //console.log(productFields);

    // Nous utilisons la fonction split pour scinder la string récupérée du localStorage et avoir chaque donnée séparée par une virgule dans un array productFieldsArray.
    const productFieldsArray = productFields.split(',');
    //console.log(productFieldsArray);
    
    //Nous affichons dynamiquement les données récupérées correspondantes aux produits du panier via le DOM. Nous rattachons les éléments à la balise <article> créée plus haut.
    let parentImageElement = document.createElement("div");
    parentImageElement.classList.add("cart__item__img");
    
    let articleImage = document.createElement("img");
    articleImage.src = productFieldsArray[0];
    articleImage.setAttribute("alt", productFieldsArray[3]);

    articleElement.appendChild(parentImageElement);
    parentImageElement.appendChild(articleImage);

    
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

    
    let parentDeleteElement = document.createElement("div");
    parentDeleteElement.className = "cart__item__content__settings__delete";
    grandParentQuantityElement.appendChild(parentDeleteElement);
    
    let deleteItem = document.createElement("p");
    deleteItem.classList.add("deleteItem");
    deleteItem.innerText = "Supprimer";
    parentDeleteElement.appendChild(deleteItem);
    

    sectionElement.appendChild(articleElement);

    // Nous incrémentons la quantité de chaque article du articles que nous avions récupérés du panier
    cart.nbArticles += parseInt(product.quantity); 
    // console.log(cart.nbArticles);
    // puis nous incrémentons leurs prix
    cart.totalPrice += parseInt(product.quantity * productFieldsArray[2]);
    //console.log(cart.totalPrice);

    // Dernier point de l'étape 8 : nous affichons le nb d'articles total ainsi que le prix total
    cart.displayTotal(cart.nbArticles, cart.totalPrice);
},
    /**
     * Nous récupérons de l'API un produit à partir de son id 
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
                //console.log(objectProduct);
                //Nous créons un tableau contenant une liste : image, nom, prix, altTxt.
                const productFields = [objectProduct.imageUrl, objectProduct.name, objectProduct.price, objectProduct.altTxt];
                //console.log(productFields);
                //Nous sauvegardons ces données dans le local storage à une clé égale à l'indice 
                const productFieldsKey = index.toString();
                //console.log(productFieldsKey);
                localStorage.setItem(productFieldsKey, productFields);
                return objectProduct;
            });
        }
    },
    /**
     * Nous affichons via le DOM la quantité de chaque article et le prix total de tous les articles
     * @param {Number} nbArticles 
     * @param {Number} totalPrice 
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
     * @returns JSON
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
        const requiredIndex = array.findIndex(element => {
            // Si l'article est trouvé, on retourne l'id (sous forme de string)
           return element.id === String(id);
        });

        // Si l'indice n'est pas trouvé, on retourne false
        if (requiredIndex === -1) {
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

    /**
     * ETAPE 10 : Ecouteur d'événement qui réagit au click sur le submit du formulaire de commande
     * (bouton "Commander")
     * Récupère les données utilisateur puis appelle des fonctions dédiés à vérifier le format des données
     * Si tout est conforme, alors constitue un objet contact et un array de produits
     */
    handleOrder: function(e) {
        // On ajoute un preventDefault pour empêcher le formulaire de propager son comportement normal (aucune action n'est définie dans le form, et comme on ne doit pas toucher aux fichiers HTML/CSS, nous ferons une redirection vers la page de confirmation à la fin de ce traitement)
        e.preventDefault();
        
        // On doit vérifier que les données saisies correspondent à ce qui est attendu
        // On va découper ca en fonctions dédiées
        
        // Bonus : On vérifie d'abord que le panier n'est pas vide
        const cartRetrieved = localStorage.getItem('cart');
        // console.log(cartRetrieved);
        // Si le panier est vide, alors on affiche un message le signifiant
        // if (cartRetrieved == undefined || cartRetrieved.length) {
        //     alert('Votre panier est vide, vous ne pouvez pas encore passer de commande');
        // }

        // On récupère les valeurs des champs
        const firstname = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;

        // On appelle chaque fonction verify
        const isFirstnameOk = cart.verifyFirstname(firstname);
        const isLastnameOk = cart.verifyLastname(lastname);
        const isCityOk = cart.verifyCity(city);
        const isAddressOk = cart.verifyAddress(address);
        const isEmailOk = cart.verifyEmail(email);

        // Si tout est OK, alors on peut constituer un objet contact et un array de produits (à partir du cart)
        if (isFirstnameOk && isLastnameOk && isCityOk && isAddressOk && isEmailOk) {

            // On créé l'objet contact composé des champs utilisateur
            const contact = {
                'firstName' : firstname,
                'lastName' : lastname,
                'address' : address,
                'city' : city,
                'email' : email
            };
            // console.log(contact);

            // On créé un array de produits
            const cartParse = JSON.parse(cartRetrieved);
            // console.log(cartParse);
            arrayProducts = [];

            for (const product of cartParse) {
                // console.log(product['id']);
                arrayProducts.push(product['id']);
            }

            // ETAPE 11 : On envoie les données à l'API en POST
            cart.postData(contact, arrayProducts);
        }
    },

    /**
     * Vérifie si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * On impose un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyFirstname: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('firstNameErrorMsg');

        // Si la string matche le format de la regex, alors on retourne true
        if (string.match(stringFormat)) {
            // On supprime l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un prénom valide (constitué uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

    /**
     * Vérifie si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * On impose un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyLastname: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('lastNameErrorMsg');

        // Si la string matche le format de la regex, alors on retourne true
        if (string.match(stringFormat)) {
            // On supprime l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un nom valide (constitué uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

     /**
     * Vérifie si la string passée en paramètre n'est constituée que de caractères alphanumériques
     * * On impose un minimum de 5 caractères et un maximum de 50
     * @param {String} string
     * @returns boolean
     */
      verifyAddress: function(string) {
        // Regex qui donne le format attendu pour l'email
        const addressFormat = /^[A-Za-z0-9'\.\-\s\,]{5,50}$/;

        const errorMessage = document.getElementById('addressErrorMsg');

        // Si la string matche le format de la regex, alors on retourne true
        if (string.match(addressFormat)) {
            // On supprime l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner une adresse valide (constituée uniquement de lettres, avec un minimum de 5 caractères et un maximum de 50)';
            return false;
        }
    },

    /**
     * Vérifie si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * On impose un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyCity: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('cityErrorMsg');

        // Si la string matche le format de la regex, alors on retourne true
        if (string.match(stringFormat)) {
            // On supprime l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner une ville valide (constituée uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

    /**
     * Vérifie si la string passée en paramètre est de la forme d'un email (cad alphanumérique avec un '@' suivi d'un nom de domaine puis d'un point et 2 ou 3 caractères)
     * @param {String} string
     * @returns boolean
     */
     verifyEmail: function(string) {
        // Regex qui donne le format attendu pour l'email
        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const errorMessage = document.getElementById('emailErrorMsg');

        // Si la string matche le format de la regex, alors on retourne true
        if (string.match(emailFormat)) {
            // On supprime l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un email valide';
            return false;
        }
    },

    /**
     * Envoi une requête POST à l'API pour récupérer le numéro de commande
     * @param {Object} objectContact 
     * @param {Array} arrayProducts 
     */
    postData: function(objectContact, arrayProducts) {
        // On valide l'existence des champs avant d'envoyer le POST
        if (objectContact !== undefined && arrayProducts !== undefined) {
            // Options de configuration du fetch (POST)
            const PostFetchOptions = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify({contact: objectContact, products: arrayProducts}) // On ajoute dans le body de la requête les 2 données attendues par l'API
            };

            // Requête POST au endpoint order de l'API
            fetch(cart.apiUrl + 'order', PostFetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                // console.log(result.orderId);
                // On redirige l'utilisateur vers la page de confirmation en ajoutant l'orderId en paramètre GET de l'url
                window.location.href = '../html/confirmation.html?' + result.orderId;
                return result;
            });
        }
    }
};


// Ecouteur d'événement pour appeler displayCart() une fois la page chargée et afficher les articles du panier de manière dynamique
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

    // On ajoute un écouteur d'événements qui réagit au submit du formulaire (bouton "Commander !")
    const submitButton = document.querySelector('#order');
    submitButton.addEventListener('click', cart.handleOrder);
});
