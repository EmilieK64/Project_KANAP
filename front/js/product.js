// Sur la page produit à ce stade, il manque les informations du produit. La seule information que l'on ait sur la page sur le produit spécifique est son id qui est dans l'url. 

// On crée un module "product" qui contient des propriétés (variables du module) et des méthodes (=fonctions).
const product = {
    // url de l'API
    apiUrl: 'http://localhost:3000/api/products/',

    // Options de configuration du fetch sous forme d'objet.
    fetchOptions : {
        method: 'GET',
        mode: 'cors', //échange interdomaines
        cache: 'no-cache'
    },
    // Déclaration de la fonction getCart
    getCart: function() {
        // localStorage.getItem permet de récupérer une donnée stockée en lien avec la clé 'cart' du local storage.
        let cart = localStorage.getItem('cart');
        console.log(cart);
        if (cart == null) {
            return [];
        } else {
            // console.log(cart);
            //tu transformes l'info avec "parse" qui analyse une chaîne JSON, en construisant la valeur ou l'objet JavaScript décrit par la chaîne. En effet dans le local storage seul une string est stockée.
            return JSON.parse(cart);
        }
    },

    // Déclaration de la fonction saveCart
    //Le localstorage est une fonctionnalité des navigateurs permettant de stocker et récupérer une chaîne de caractères, sur un navigateur avec Javascript. A la différence d'une simple variable, l'information est persistante entre les pages d'un même site et entre les différentes visites d'un utilisateur.
    saveCart: function(cart) {
        // tu rajoutes l'information donnée en json en string dans le local storage avec la clé "cart": set item signifie rajouter ou modifier une valeur qui a une clé donnée en 1er paramètre 
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    // Déclaration de la fonction getProduct
    // On stocke les informations nécessaires (id, quantité et couleur du produit) dans le local storage sous la forme d'un array cart
    getProduct: function() {
        // On commence par stocker l'id de l'URL dans idProduct
        // Au lieu d'utiliser ici URLSearchParams, on utilise la propriété "split" pour récupérer tout ce qui est après la string 'id=' (on stocke ça dans idProduct)
        // [1] sert à préciser que l'on souhaite récupérer l'information après l'id= dans l'Url et non avant
        const idProduct = window.location.href.split('id=')[1];
        
        // On récupère l'élément ayant l'id colors et on accède à sa valeur
        // On stocke la couleur de l'option sélectionnée dans la variable color
        const color = document.querySelector('#colors').value;
        
        // On stocke la quantité choisie dans la variable "quantity"
        const quantity = document.querySelector('#quantity').value;

        // On crée un objet product qui reprend les informations qui viennent d'être stockées dans les variables  id, color et quantity
        const product = {
            'id' : idProduct,
            'color': color,
            'quantity': quantity
        };
        
        return product;
    },

    // Déclaration de la fonction displayOneProduct
    displayOneProduct: function() {
        // ETAPE 5 : Récupérer l'id du produit avec URLSearchParams
        //la variable "URLSearchParams" récupère l'url de la page, cela passe par la création d'une instance de l'objet que l'on nomme "urlData" pour stocker l'url de la page. 
        let urlData = new URLSearchParams(document.location.search); 
        // récupérer avec ensuite la méthode .get l'information de l'id. 
        // On stocke la valeur du paramètre id de l'URL ainsi récupérée dans la variable "idProduct"
        let idProduct = urlData.get("id");
        console.log(idProduct);
        // console.log(idProduct);

        // ce qui permet dans la méthode GET de concaténer à l'url la valeur de l'id récupérée plus haut pour ensuite récupérer les informations sous forme d'objet : 
        fetch(product.apiUrl + idProduct, product.fetchOptions)
        .then(function(response) {
            return response.json();
        })
        //objectProduct contient le résultat de response.json. Ce que l'on a reçu et qui a été traité en json sera appelé objectProduct. On aurait pu écrire .then((products) => {
        .then(function(objectProduct) {
        // ETAPE 6 : Insérer un produit et ses détails dans la page Produit
            // donne moi des informations en console sur ce qui est récupéré sous forme tableau.
            console.log(objectProduct);
            //et de récupérer les informations contenues dans l'objet au format json oneProduct et de faire appel à la fonction définie plus bas qui va afficher les détails de l'objet "OneProduct" : 
            //Etape 6 : cette partie permet d'insérer les détails du produit dans la page produit.
            typeof(objectProduct); // on voit ainsi qu'il s'agit d'un objet.
            let imageInfo = document.querySelector(".item__img");
            let imageElement = document.createElement("img");
            imageElement.src = objectProduct.imageUrl;
            imageElement.setAttribute("alt", objectProduct.altTxt);
            imageInfo.appendChild(imageElement);
            
            let title = document.querySelector("#title");
            title.textContent = `${objectProduct.name}`;
            
            let price = document.querySelector("#price");
            price.textContent = `${objectProduct.price}`;
            
            let description = document.querySelector("#description");
            description.textContent = `${objectProduct.description}`;
            
            let colorOption = document.querySelector("#colors");

            // On boucle sur l'array colors (récupéré de l'API car nous voyons sur http://localhost:3000/API/products/a557292fe5814ea2b15c6ef4bd73ed83 qu'il s'agit d'un array) pour créer pour chaque valeur de l'array une balise <option> 
            for (const color of objectProduct.colors) { // pour chacune des lignes/valeur que l'on nomme "color" dans l'array "colors" dans l'API : on crée une balise <option> dans le DOM qu'on stocke dans une variable "optionElement" :
                const optionElement = document.createElement('option');
                // On ajoute à chaque balise <option> l'attribue "value" auquel on affecte la valeur de chaque ligne de l'array nommée "color"
                optionElement.value = color; 
                // pour chacune des lignes ou valeur étant une couleur et nommée donc color : on attribue cette valeur au "textcontent" de chacune des balises <option> pour que les couleurs s'affichent
                optionElement.textContent = color; 
                // On ajoute ces balises <option> créées au parent <select> avec .append
                colorOption.appendChild(optionElement);
            }
        })
        // sinon dans le cas d'une erreur intègre dans le contenu de la balise avec la class item un h1 au contenu de erreur 404 et renvoie en console l'erreur. On aurait pu écrire aussi .catch((err) => {
        .catch(function(err) { 
            const errorElement = document.querySelector(".item");
            errorElement.innerText = "Erreur 404";
            console.log("erreur 404, sur ressource api:" + err);
            });
        },

     /**
     * ETAPE 7 : Doit stocker dans local storage 3 infos : id, quantité et couleur du produit sous la forme d'un array cart au click sur le bouton "ajouter au panier" du formulaire
     
    // Cette fonction addToCart()s'exécute lorsque l'on clique sur le bouton "Ajouter au panier" (via un écouteur d'événement plus bas).   
    // la fonction addToCart va faire appel à 3 fonctions codées plus haut : getProduct(), getcart() et saveCart() qui vont donc chacune s'exécuter au moment où l'on clique sur le bouton.
    Cette fonction doit stocker dans local storage 3 infos : id, quantité et couleur du produit sous la forme d'un array cart. 
    L'ajout d'un produit au panier est conditionnel (si le produit existe déjà, alors on doit incrémenter sa quantité, cf. spécifications). 
    Pour savoir si le produit à ajouter au panier y est déjà, on récupère le "nouveau" produit à ajouter au panier via la fonction getProduct() qui retourne l'id, la quantité et la couleur sous la forme d'un objet "product".
    On récupère ensuite le contenu du panier via la fonction getCart().  On peut alors comparer le contenu du panier avec le nouveau produit à ajouter. On ajoute ce produit si et seulement s'il n'existe pas dans le panier (cad en regardant son id ET sa couleur).  
    Une fois le produit ajouté (ou sa quantité incrémentée sinon), on sauvegarde le panier via la fonction saveCart().  
    saveCart() utilise le localStorage pour stocker le panier dans une variable appellée 'cart'.
        */
      addToCart: function() {
        // On doit comparer le produit à ajouter avec le contenu existant du panier 

        // On récupère le nouveau produit à ajouter : le résultat de la fonction getProduct() définie plus haut est stocké dans la variable new Product qui est un objet avec les informations de l'id, quantité et couleur.
        const newProduct = product.getProduct();
        console.log(newProduct);

        // On récupère le contenu du panier : le résultat de la fonction getcart est stockée dans la variable cartContent qui est un array.
        const cartContent = product.getCart();
        // console.log(cartContent);

        // On utilise la fonction native JS find() pour savoir si le même produit est déjà dans le panier
        // tu vas chercher dans le panier cartContent si tu trouves un produit p dont l'id correspond à l'id du nouveau produit à rajouter
        // Si find() trouve le produit, alors il va le retourner
        // Sinon, find() retourne "undefined"
        const foundProductById = cartContent.find(p => p.id == newProduct.id);
        // console.log(foundProductById);

        if (foundProductById != undefined) {
            // On a trouvé un produit id correspondant
            // On vérifie maintenant si la couleur correspond aussi au produit à ajouter
            const foundProductByColor = cartContent.find(p => p.color == newProduct.color);
            console.log(foundProductByColor);

            // Si le panier contient bien un produit p dont la couleur maintenant correspond à la couleur du nouveau produit à rajouter (n'est pas undefined) 
            // Si on a donc trouvé un produit correspondant exactement (id + couleur) 
            if (foundProductByColor != undefined) {
                //=> on met à jour la quantité
                // Pour pouvoir tenir compte de la quantité réellement saisie par l'utilisateur, on convertit les valeurs des quantités en entier (fonction parseInt)
                //transformer en entier la quantité de l'article similaire en couleur trouvé dans le panier.
                let productQuantity = parseInt(foundProductByColor.quantity);
                // On incrément la quantité du nouveau produit à ajouter  à la quantité du produit dans le panier (ayant donc le même id et couleur)
                productQuantity += parseInt(newProduct.quantity);
                //Cette nouvelle quantité devient donc la nouvelle quantité dans le panier pour le produit ayant le même id et la même couleur 
                foundProductByColor.quantity = productQuantity;
            } else {
                // On ne trouve pas de produit avec le même id et la même couleur => on l'ajoute au panier
                cartContent.push(newProduct);
            }
        } else {
            // On ne trouve pas de produit correspondant dans le panier => on l'ajoute au panier
            cartContent.push(newProduct);
        }
        // On vérifie que la quantité et la couleur ne sont pas nulles
        if (document.querySelector('#quantity').value !=0 && document.querySelector('#quantity').value <101 && document.querySelector('#colors').value !=0) {
            // On stocke le panier dans le localStorage
            product.saveCart(cartContent);
            alert('Produit ajouté au panier !');
            console.log(product.getCart());
        } else {
            alert('Veuillez indiquer à la fois une quantité entre 0 et 100 et une couleur');
        }
    }
};

// Ecouteur d'événement pour appeler displayOneProduct() au chargement de la page
document.addEventListener('DOMContentLoaded', product.displayOneProduct);

// On ajoute un écouteur d'événements qui réagit au bouton "Ajouter au panier" 
const submitButton = document.querySelector('#addToCart');
submitButton.addEventListener('click', product.addToCart);