//product.js pour : _étape 5 et 6 : afficher sur la page produit le produit sélectionné par l'utilisateur dans la page accueil et _ étape 7 : ajouter au panier au click sur le bouton "Ajouter au panier" le produit, sa quantité et sa couleur sélectionnés par l'utilisateur sur la page produit. Enfin : sauvegarder le panier ainsi modifié dans le local storage.

// Création d'un module "product" avec ses méthodes et ses propriétés
const product = {
    // Configuration du Fetch qui va être utilisé dans la fonction displayOneProduct().
    // URL de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du Fetch sous forme d'objet 
    fetchOptions : {
        method: 'GET',
        mode: 'cors', 
        cache: 'no-cache'
    },
    /**
     * Nous récupèrons le contenu du panier issu du localStorage à la clé "cart" et le retournons en valeur Array javascript;
     * @returns {Array} cart
     */
    getCart: function() {
        let cart = localStorage.getItem('cart');
        //console.log(cart);
        if (cart == null) {
            return [];
        } else {
            // console.log(cart);
            return JSON.parse(cart);
        }
    },

    /**
     * Nous sauvegardons le panier dans le localStorage à la clé "cart"
     * @param {Array} cart
     * @return void
     */
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        //console.log(cart);
    },

    /**
     * Nous créons un objet comprenant l'id, la couleur et la quantité du produit sélectionnés par l'utilisateur sur la page produit. 
     * @returns {Object} product
     */
    getProduct: function() {
        // Utilisation de window.location.href.split('id=')[1] cette fois à la place de URLSearchParams.get pour récupérer l'information de l'id dans l'URL de la page.
        const idProduct = window.location.href.split('id=')[1];
        const color = document.querySelector('#colors').value;
        const quantity = document.querySelector('#quantity').value;
        const product = {
            'id' : idProduct,
            'color': color,
            'quantity': quantity
        };
        return product;
    },
    /**
     * Nous affichons sur la page produit le produit sélectionné par l'utilisateur dans la page accueil. Nous récupérons pour cela son id via l'URL de la page produit, ce qui nous permet de récupérer via l'API l'objet contenant les données du produit sélectionné (étape 5) et d'insérer le produit et ses détails dans la page produit (étape 6).
     */
    displayOneProduct: function() {
        // Etape 5 : nous récupérons l'id du produit dans l'URL de la page avec URLSearchParams.get  
        let urlData = new URLSearchParams(document.location.search); 
        let idProduct = urlData.get("id");
        //console.log(idProduct);
        fetch(product.apiUrl + idProduct, product.fetchOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(objectProduct) {
        // Etape 6 : nous insérons le produit et ses détails dans la page produit. Nous modifions le contenu des balises existantes et créons des balises additionnelles dynamiquement que nous rattachons à diverses balises parentes via le DOM à la page HTML.
            //console.log(objectProduct);
            //console.log((typeof(objectProduct))); 
            let imageInfo = document.querySelector(".item__img");
            let imageElement = document.createElement("img");
            imageElement.src = objectProduct.imageUrl;
            imageElement.setAttribute("alt", objectProduct.altTxt);
            imageInfo.appendChild(imageElement);
            
            let title = document.querySelector("#title");
            title.textContent = objectProduct.name;
            
            let price = document.querySelector("#price");
            price.textContent = objectProduct.price;
            
            let description = document.querySelector("#description");
            description.textContent = objectProduct.description;
            
            let colorOption = document.querySelector("#colors");
            for (const color of objectProduct.colors) { 
                const optionElement = document.createElement("option");
                optionElement.value = color; 
                optionElement.textContent = color; 
                colorOption.appendChild(optionElement);
            }
        })
        .catch(function(err) { 
            const errorElement = document.querySelector(".item");
            errorElement.innerText = "Erreur 404";
            console.log("erreur 404, sur ressource api:" + err);
            });
        },

     /**
     * ETAPE 7 : Nous ajoutons au panier le produit, sa quantité et sa couleur sélectionnés par l'utilisateur sur la page Produit. L'ajout d'un produit au panier est conditionnel : si le produit existe déjà dans le panier (id + couleur), alors nous incrémentons sa quantité seulement à la quantité du produit déjà existant dans le panier. Nous sauvegardons enfin le panier ainsi modifié dans le local storage.
     * 
     */
      addToCart: function() {
        // Nous récupérons ce qui a été retourné par la fonction getProduct(), c.a.d un objet contenant les données id, couleur et quantité du nouveau produit.
        const newProduct = product.getProduct();
        //console.log(newProduct);
        // Nous récupérons ce qui a été retourné par la fonction getCart(), c.a.d un array vide ou contenant des objets avec les données : id, couleur et quantité des produits du panier.
        const cartContent = product.getCart();
        //console.log(cartContent);
        //Nous utilisons la fonction native JS find() pour savoir si le nouveau produit est déjà dans le panier (même id).
        const foundProductById = cartContent.find(p => p.id == newProduct.id);
        //console.log(foundProductById);
        if (foundProductById != undefined) {
            //Nous utilisons la JS find() pour savoir cette fois si ce produit du panier ayant le même id que le nouveau produit a également la même couleur que le nouveau produit
            const foundProductByColor = cartContent.find(p => p.color == newProduct.color);
            //console.log(foundProductByColor);
            if (foundProductByColor != undefined) {
                //console.log("foundProductByColor ok");
                //Nous rajoutons la quantité du nouveau produit à la quantité du produit du panier puisqu'ils ont le même id et la même couleur.
                let productQuantity = parseInt(foundProductByColor.quantity);
                productQuantity += parseInt(newProduct.quantity);
                foundProductByColor.quantity = productQuantity;
            } else {
                //Le produit est rajouté à la fin du panier puisqu'il n'y a pas de produit ayant le même id au sein du panier.
                cartContent.push(newProduct);
            }
        } else {
            //Le produit est rajouté à la fin du panier puisqu'il n'y a pas de produit ayant à la fois le même id et la même couleur au sein du panier.
            cartContent.push(newProduct);
        }
        //Les données sont validées grâce aux contraintes du code HTML de l'input qui a les attributs : min et max mais aussi grâce à la condition définie ci dessous : 
        if (document.querySelector('#quantity').value !=0 && document.querySelector('#quantity').value <101 && document.querySelector('#colors').value !='') {
            //Le panier modifié est sauvegardé dans le localStorage.
            product.saveCart(cartContent); 
            //Les informations utiles selon la situation sont données à l'utilisateur.
            alert('Produit ajouté au panier !');
        } else {
            alert('Veuillez indiquer à la fois une quantité entre 0 et 100 et une couleur');
        }
    }
};

//La fonction displayOneProduct() est appelée avec l'écouteur d'événement ci-dessous lorsque la page se charge. Le produit et ses détails sont insérés.
document.addEventListener('DOMContentLoaded', product.displayOneProduct);

// Nous ajoutons un écouteur d'événements qui réagit au click sur le bouton "Ajouter au panier" et qui appelle la fonction addToCart(). Le nouveau produit à ajouter au panier, sa quantité et sa couleur sera stocké dans le panier et dans le localStorage.
const submitButton = document.querySelector('#addToCart');
submitButton.addEventListener('click', product.addToCart);