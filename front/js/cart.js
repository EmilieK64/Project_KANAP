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

    // Nous initialisons le nb total d'articles et le prix total à afficher sur la page panier : variables utilisées dans la fonction "buildHtmlArticle(product, index) et displayTotal((nbArticles, totalPrice) appelée par la première.
    nbArticles: 0,
    totalPrice: 0,

    /**
     * Etape 8 : _nous récupérons les produits du panier issus du localStorage
     *           _nous affichons dans le DOM le contenu du panier via l'insertion des produits du panier récupérés du localStorage et l'insertion des données complémentaires aux produits récupérées via l'API avec la fonction buildHtmlArticle appelées avec ses arguments : (cartContent[index], index).
     *           _nous affichons également les totaux avec la fonction buildHtmlArticle appelée. 
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
            // Nous parcourons le panier (Array) qui contient les objets avec les propriétés id, couleur, quantité
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
     * Partie de l'étape 8 :
     * Nous affichons dans le DOM les informations sur les produits issues du panier récupérées en amont dans la fonction displayCart().
     * Nous rajoutons à l'affichage les informations manquantes sur ces produits qui ne sont pas dans le panier mais qui sont fournies par l'API avec notamment la fonction getProduct(product.id, index) appelée qui stocke ces informations dans le local storage. Ainsi nous pouvons les récupérer pour l'affichage.
     * Lorsque notre fonction buildHtmlArticle est appelée, elle a les arguments (cartContent[index], index) et une boucle définie en amont permet de parcourir les produits du panier pour les afficher mais aussi les id des produits du paniers pour s'en servir pour appeler l'API dans la fonction getProduct(product.id, index).
     * La boucle permet également de parcourir les quantités et prix des produits du panier pour les incrémenter et les afficher ensuite via l'appel à la fonction cart.displayTotal et ses arguments (cart.nbArticles, cart.totalPrice).
     * 
     * @param {Array} product 
     * @param {Integer} index 
     * @param {Integer} nbArticles 
     * @param {Integer} totalPrice
     * 
     * @returns void
     */
    buildHTMLArticle: function(product, index) { 
        // Nous ciblons la section parent des articles produits.
        const sectionElement = document.getElementById('cart__items');
        //Nous ajoutons les balises utiles en commençant par la balise <article> et ses attributs en l'occurence data-id et data-color.
        const articleElement = document.createElement('article');
        articleElement.classList.add('cart__item');
        articleElement.dataset.id = product.id;
        articleElement.dataset.color = product.color;

        // Nous appelons l'API pour récupérer les infos manquantes des produits du panier, c.a.d : image, nom, prix, altTxt et nous les stockons dans le localStorage à la clé correspondante à l'index. 
        cart.getProduct(product.id, index);

        // Nous récupérons ces données manquantes du localStorage.
        const productFieldsKey = index.toString();
        const productFields = localStorage.getItem(productFieldsKey);
        //console.log(productFields);

        // Nous utilisons la fonction split pour scinder la string récupérée du localStorage et avoir chaque donnée séparée par une virgule dans un array productFieldsArray.
        const productFieldsArray = productFields.split(',');
        //console.log(productFieldsArray);
        
        //Nous affichons dynamiquement toutes les données récupérées pour chaque produit du panier dans le DOM. Nous rattachons les éléments à la balise <article> créée plus haut, elle même rattachée à la balise parente ayant l'id cart__items'.
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
        articlePrice.innerText = productFieldsArray[2] + " €";
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

        // Nous incrémentons la quantité de chaque article (que nous avions récupérée du panier)
        cart.nbArticles += parseInt(product.quantity); 
        // console.log(cart.nbArticles);
        // puis nous incrémentons les prix via ce calcul
        cart.totalPrice += parseInt(product.quantity * productFieldsArray[2]);
        //console.log(cart.totalPrice);

        // Dernier point de l'étape 8 : nous affichons le nb d'articles total ainsi que le prix total
        cart.displayTotal(cart.nbArticles, cart.totalPrice);
    },
    /**
     * Nous récupérons de l'API les données d'un produit à partir de son id que nous stockons dans le local storage à la clé index
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
                //Nous sauvegardons ces données sous forme de string dans le local storage à une clé égale à l'indice 
                const productFieldsKey = index.toString();
                //console.log(productFieldsKey);
                localStorage.setItem(productFieldsKey, productFields);
                return objectProduct;
            });
        }
    },
    /**
     * Nous affichons via le DOM les totaux : quantité d'articles et prix total
     * @param {Number} nbArticles 
     * @param {Number} totalPrice 
     */
    displayTotal: function(nbArticles, totalPrice) {
        // Nous récupérons les éléments dans le DOM prévus pour afficher les totaux : quantité d'articles et prix total
        const totalQuantityElement = document.getElementById('totalQuantity');
        const totalPriceElement = document.getElementById('totalPrice');

        // Nous leur assignons les bonnes valeurs
        totalQuantityElement.textContent = nbArticles;
        totalPriceElement.textContent = totalPrice;
    },

    // ETAPE 9 : Nous devons mettre un écouteur d'événement sur le lien "Supprimer"
    handleDeleteLink: function(event) {
        // Nous récupérons le lien cliqué
        const currentElement = event.currentTarget;
        // Nous supprimons de l'affichage puis du panier le produit
        // Pour cela nous récupérons le produit concerné
        // NB : il nous faut l'id ET la couleur pour ne pas tout supprimer à tord
        const articleElement = currentElement.closest('article');
        const productId = articleElement.dataset.id;
        // console.log(productId);
        const productColor = articleElement.dataset.color;
        // console.log(productColor);
        // Nous supprimons du DOM l'article concerné en ciblant la balise article parente la plus proche du lien
        articleElement.remove();
        // Nous récupérons le contenu du panier
        const cartRetrieved = cart.getCart();
        // Nous supprimons du panier l'article supprimé
        // Nous bouclons sur le panier pour trouver l'article supprimé
        const foundProductById = cartRetrieved.find(p => p.id == productId);
        // console.log(foundProductById);
        if (foundProductById != undefined) {
            // Nous vérifions maintenant si la couleur correspond aussi au produit à supprimer
            const foundProductByColor = cartRetrieved.find(p => p.color == productColor);
            // console.log(foundProductByColor);
            if (foundProductByColor != undefined) {
               // Nous appelons une fonction dédiée à la suppression de l'article dans le panier
               cart.removeArticleById(cartRetrieved, productId, productColor);
               cart.saveCart(cartRetrieved);
               // Nous appelons displayCart() pour mettre à jour le panier (page + données + totaux)
               cart.displayCart(); 
            }                    
        } else {
            // Nous ne trouvons pas le produit correspondant dans le panier => Nous affichons une erreur dans la console
            console.error('Le produit à supprimer n\'est pas dans le panier');
        }
    },

    /**
     * Nous récupérons le panier du localStorage
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
     * Nous enregistrons le panier dans le localStorage
     * @param {Object} cart 
     */
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    /**
     * Nous supprimons du panier un article correspondant au produit supprimé
     * @param {Array} array 
     * @param {String} id 
     * @returns mixed Array | String | Bool
     */
    removeArticleById: function(array, id, color) {
        // Nous cherchons l'article via son indice avec la méthode findIndex()
        const requiredIndex = array.findIndex(element => {
            // Si l'article est trouvé, nous retournons l'id (sous forme de string)
            console.log(element);
           return element.id === String(id) && element.color == color;
        });
        // Si l'indice n'est pas trouvé, nous retournons false
        if (requiredIndex === -1) {
           return false;
        };

        // DEBUG pour voir la valeur contenue dans requiredIndex
        // alert(requiredIndex);

        // L'id est trouvé, nous supprimons l'article correspondant à l'id et nous retournons l'array obtenu
            return array.splice(requiredIndex, 1);
    },
    /**
     * ETAPE 9 : Nous devons mettre un écouteur d'événement sur les quantités produits
     * Ecouteur d'événement qui réagit au changement de valeur 
     * @param {Event} event 
     */
    handleModifyQuantity: function(event) {
        // Nous récupérons l'élément modifié 
        const currentTarget = event.currentTarget;
        //Nous récupérons l'article parent associé
        const articleElement = currentTarget.closest('article');
        // Nous récupérons l'id et la couleur du produit concerné dans le DOM sur la balise article
        const productId = articleElement.dataset.id;
        const productColor = articleElement.dataset.color;

        // Nous récupérons le contenu du panier
        const cartRetrieved = cart.getCart();

        // Nous devons mettre à jour le panier
        // Nous bouclons sur le panier pour trouver l'article concerné
        const foundProductById = cartRetrieved.find(p => p.id == productId);
        if (foundProductById != undefined) {
            // Si nous avons trouvé un produit id correspondant
            // Nous vérifions si la couleur correspond aussi au produit dont la quantité a été changée
            const foundProductByColor = cartRetrieved.find(p => p.color == productColor);
            // console.log(foundProductByColor);
            if (foundProductByColor != undefined) {
               // Nous avons trouvé le produit à mettre à jour (id  + couleur correspondante)
               // Nous faisons la modification de la quantité du produit
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
     * ETAPE 10 : Au click sur le  bouton "commander" du formulaire nous récupérons les données utilisateur puis appelons des fonctions dédiées pour vérifier le format des données.
     * Si tout est conforme, nous constituons un objet contact et un array de produits
     * @param {Event} e 
     */
    handleOrder: function(e) {
        // Nous ajoutons un preventDefault pour empêcher le formulaire de propager son comportement normal (aucune action n'est définie dans le form, et comme nous ne devons pas toucher aux fichiers HTML/CSS, nous ferons une redirection vers la page de confirmation à la fin de ce traitement)
        e.preventDefault();
        // Nous devons vérifier que les données saisies correspondent à ce qui est attendu
        // Nous allons découper cette exécution en fonctions dédiées
        // Nous vérifions d'abord que le panier n'est pas vide
        const cartRetrieved = localStorage.getItem('cart');
        // console.log(cartRetrieved);
        // Si le panier est vide, alors nous affichons un message le signifiant et nous sortons de la fonction
        if (cartRetrieved == '[]') {
            alert('Votre panier est vide, vous ne pouvez pas encore passer de commande');
            return;
        }

        // Nous récupérons les valeurs des champs
        const firstname = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;

        // Nous appelons chaque fonction verify
        const isFirstnameOk = cart.verifyFirstname(firstname);
        const isLastnameOk = cart.verifyLastname(lastname);
        const isCityOk = cart.verifyCity(city);
        const isAddressOk = cart.verifyAddress(address);
        const isEmailOk = cart.verifyEmail(email);

        // Si tout est OK, nous constituons un objet contact et un array de produits (à partir du cart)
        if (isFirstnameOk && isLastnameOk && isCityOk && isAddressOk && isEmailOk) {

            // Nous créons l'objet contact composé des champs utilisateur
            const contact = {
                'firstName' : firstname,
                'lastName' : lastname,
                'address' : address,
                'city' : city,
                'email' : email
            };
            // console.log(contact);

            // Nous créons un array de produits
            const cartParse = JSON.parse(cartRetrieved);
            // console.log(cartParse);
            arrayProducts = [];

            for (const product of cartParse) {
                // console.log(product['id']);
                // product est un array associatif : on accède à la valeur de son id via sa clé 'id'
                // dans un array associatif, les clés sont des string (contrairement aux array numérotés où les clés sont des indices commencant par 0)
                arrayProducts.push(product['id']);
            }

            // ETAPE 11 : On envoie les données à l'API en POST
            cart.postData(contact, arrayProducts);
        }
    },

    /**
     * Nous vérifions si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * Nous imposons un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyFirstname: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('firstNameErrorMsg');

        // Si la string matche le format de la regex, alors nous retournons true
        if (string.match(stringFormat)) {
            // Nous supprimons l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // Nous affichons un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un prénom valide (constitué uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

    /**
     * Nous vérifions si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * Nous imposons un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyLastname: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('lastNameErrorMsg');

        // Si la string matche le format de la regex, alors nous retournons true
        if (string.match(stringFormat)) {
            // Nous supprimons l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // On affiche un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un nom valide (constitué uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

     /**
     * Nous vérifions si la string passée en paramètre n'est constituée que de caractères alphanumériques
     * * Nous imposons un minimum de 5 caractères et un maximum de 50
     * @param {String} string
     * @returns boolean
     */
      verifyAddress: function(string) {
        // Regex qui donne le format attendu pour l'email
        const addressFormat = /^[A-Za-z0-9'\.\-\s\,]{5,50}$/;

        const errorMessage = document.getElementById('addressErrorMsg');

        // Si la string matche le format de la regex, alors nous retournons true
        if (string.match(addressFormat)) {
            // Nous supprimons l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // Nous affichons un message d'erreur
            errorMessage.textContent = 'Merci de renseigner une adresse valide (constituée uniquement de lettres, avec un minimum de 5 caractères et un maximum de 50)';
            return false;
        }
    },

    /**
     * Nous vérifions si la string passée en paramètre n'est constituée que de lettres (majuscules et minuscules)
     * Nous imposons un minimum de 2 caractères et un maximum de 30
     * @param {String} string
     * @returns boolean
     */
     verifyCity: function(string) {
        // Regex qui donne le format attendu pour l'email
        const stringFormat = /^[a-zA-Z ]{2,30}$/;

        const errorMessage = document.getElementById('cityErrorMsg');

        // Si la string matche le format de la regex, alors nous retourne true
        if (string.match(stringFormat)) {
            // Nous supprimons l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // Nous affichons un message d'erreur
            errorMessage.textContent = 'Merci de renseigner une ville valide (constituée uniquement de lettres, avec un minimum de 2 caractères et un maximum de 30)';
            return false;
        }
    },

    /**
     * Nous vérifions si la string passée en paramètre est de la forme d'un email (cad alphanumérique avec un '@' suivi d'un nom de domaine puis d'un point et 2 ou 3 caractères)
     * @param {String} string
     * @returns boolean
     */
     verifyEmail: function(string) {
        // Regex qui donne le format attendu pour l'email
        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const errorMessage = document.getElementById('emailErrorMsg');

        // Si la string matche le format de la regex, alors nous retournons true
        if (string.match(emailFormat)) {
            // Nous supprimons l'éventuel contenu du message d'erreur avant de retourner true
            errorMessage.textContent = '';
            return true;
        } else {
            // Nous affichons un message d'erreur
            errorMessage.textContent = 'Merci de renseigner un email valide';
            return false;
        }
    },

    /**
     * Nous envoyons une requête POST à l'API pour récupérer le numéro de commande
     * @param {Object} objectContact 
     * @param {Array} arrayProducts 
     */
    postData: function(objectContact, arrayProducts) {
        // Nous validons l'existence des champs avant d'envoyer le POST
        if (objectContact !== undefined && arrayProducts !== undefined) {
            // Options de configuration du fetch (POST)
            const PostFetchOptions = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify({contact: objectContact, products: arrayProducts}) // Nous ajoutons dans le body de la requête les 2 données attendues par l'API
            };

            // Requête POST au endpoint order de l'API
            fetch(cart.apiUrl + 'order', PostFetchOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                // console.log(result.orderId);
                // Nous redirigeons l'utilisateur vers la page de confirmation en ajoutant l'orderId en paramètre GET de l'url
                window.location.href = '../html/confirmation.html?' + result.orderId;
                return result;
            });
        }
    }
};


// Ecouteur d'événement pour appeler displayCart() une fois la page chargée et afficher les articles du panier de manière dynamique
document.addEventListener('DOMContentLoaded', cart.displayCart);

// Nous ajoutons un écouteur d'événement qui réagit au clic sur les liens "Supprimer"
document.addEventListener('DOMContentLoaded', function() {
    // Nous ciblons les éléments ayant la classe deleteItem
    const deleteLinks = document.getElementsByClassName('deleteItem');
   
    // Nous bouclons sur ces éléments pour leur poser un écouteur
    for (let link of deleteLinks) {
        link.addEventListener('click', cart.handleDeleteLink);    
    }

    // Nous ciblons les éléments ayant la classe itemQuantity
    const itemQuantityElements = document.getElementsByClassName('itemQuantity');

    // Nous bouclons sur ces éléments pour leur poser un écouteur
    for (let itemQuantity of itemQuantityElements) {
        itemQuantity.addEventListener('change', cart.handleModifyQuantity);
    }

    // Nous ajoutons un écouteur d'événements qui réagit au submit du formulaire (bouton "Commander !")
    const submitButton = document.querySelector('#order');
    submitButton.addEventListener('click', cart.handleOrder);
});
