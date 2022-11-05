const confirmation = {
    /**
     * Fin de l'étape 11 : une fois sur la page confirmation, nous récupérons dans l'URL le numéro de commande et l'affichons.
     */
    displayOrderNumber: function() {
        // Nous récupérons l'orderId du paramètre fournit dans l'url (en GET)
        const parameterUrl = window.location.search;
        // console.log(parameterUrl);
        const orderId = parameterUrl.split('?')[1];
        // console.log(orderId);

        // Pour finir, nous récupérons l'élément dans lequel insérer l'orderId et nous le mettons
        const orderIdElement = document.getElementById('orderId');
        orderIdElement.textContent = orderId;
    }
};

// Ecouteur d'événement pour appeler displayOrderNumber() une fois la page chargée
document.addEventListener('DOMContentLoaded', confirmation.displayOrderNumber);