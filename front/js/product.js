
const product = {
    // url de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du fetch (sous forme d'objet).
    fetchOptions : {
        method: 'GET',
        mode: 'cors', 
        cache: 'no-cache'
    },
    /**
     * Récupère le contenu du panier à la clé "cart" et le transforme en valeur array javascript
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
     * Sauvegarde du panier dans le localStorage à la clé "Cart"
     * @param {Array} cart
     * @return void
     */
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        //console.log(cart);
    },

    /**
     * Création d'un objet comprenant l'id, la couleur et la quantité du produit sélectionné par l'utilisateur
     * @returns {Object} product
     */
    getProduct: function() {
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
     * Insérer le produit et ses détails dans la page Produit
     */
    displayOneProduct: function() {
        // ETAPE 5 : Récupérer l'id du produit avec URLSearchParams  
        let urlData = new URLSearchParams(document.location.search); 
        let idProduct = urlData.get("id");
        //console.log(idProduct);
        fetch(product.apiUrl + idProduct, product.fetchOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(objectProduct) {
        // ETAPE 6 : Insérer le produit et ses détails dans la page Produit
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
     * ETAPE 7 : Stocker dans local storage 3 infos : id, quantité et couleur du produit dans un array "cart" au click sur le bouton "ajouter au panier" du formulaire. L'ajout d'un produit au panier est conditionnel : si le produit existe déjà (id + couleur), alors on incrémente sa quantité seulement. 
     * 
     */
      addToCart: function() {
        const newProduct = product.getProduct();
        //console.log(newProduct);
        const cartContent = product.getCart();
        //console.log(cartContent);
        const foundProductById = cartContent.find(p => p.id == newProduct.id);
        //console.log(foundProductById);
        if (foundProductById != undefined) {
            const foundProductByColor = cartContent.find(p => p.color == newProduct.color);
            //console.log(foundProductByColor);
            if (foundProductByColor != undefined) {
                //console.log("foundProductByColor ok");
                let productQuantity = parseInt(foundProductByColor.quantity);
                productQuantity += parseInt(newProduct.quantity);
                foundProductByColor.quantity = productQuantity;
            } else {
                cartContent.push(newProduct);
            }
        } else {
            cartContent.push(newProduct);
        }
        if (document.querySelector('#quantity').value !=0 && document.querySelector('#quantity').value <101 && document.querySelector('#colors').value !='') {
            product.saveCart(cartContent);//mise à jour du local storage 
            alert('Produit ajouté au panier !');
        } else {
            alert('Veuillez indiquer à la fois une quantité entre 0 et 100 et une couleur');
        }
    }
};

document.addEventListener('DOMContentLoaded', product.displayOneProduct);

// On ajoute un écouteur d'événements qui réagit au bouton "Ajouter au panier" 
const submitButton = document.querySelector('#addToCart');
submitButton.addEventListener('click', product.addToCart);