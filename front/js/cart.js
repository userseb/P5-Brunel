//Liste des produits et informations
function productList(key) {
  const objProduct = localStorage.getItem(key);
  return JSON.parse(objProduct);
}
// Récuperation de la clé produit
function keyProduct(obj) {
  const articleParent = obj.parentNode.parentNode.parentNode.parentNode;
  const artId = articleParent.getAttribute("data-id");
  const artColor = articleParent.getAttribute("data-color");
  return artId + "-" + artColor;
}
// Controle d'affichage du formulaire suivant si le panier et vide ou non
function visibleOrderForm() {
  const form = document.querySelector(".cart__order");
  if (localStorage.length > 0) {
    form.removeAttribute("style");
  } else {
    form.style.display = "none";
  }
}
// Mise a jours de la quantité totale et du cout total du panier
function majTotalCart() {
  
  const totalPrice = document.getElementById("totalPrice");
  const totalQuantity = document.getElementById("totalQuantity");
  let totalCart = 0;
  let totalQte = 0;
  if (localStorage.length === 0) {
    totalPrice.innerText = totalCart;
    totalQuantity.innerText = totalQte;
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      const productLocal = productList(localStorage.key(i));
      fetch("http://localhost:3000/api/products/" + productLocal.id)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((article) => {
          totalCart += article.price * productLocal.qte;
          totalQte += productLocal.qte;
          totalPrice.innerText = totalCart;
          totalQuantity.innerText = totalQte;
        });
    }
  }
}
//Gestion de l'affichage du panier
const cartItems = document.getElementById("cart__items");
if (cartItems) {
  for (let i = 0; i < localStorage.length; i++) {
    const product = productList(localStorage.key(i));
    fetch("http://localhost:3000/api/products/" + product.id)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((article) => {
        cartItems.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}"> 
      <div class="cart__item__img">
        <img src="${article.imageUrl}" alt="${article.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>Couleur : ${product.color}</p>
          <p>Prix : ${article.price}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Quantité : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qte}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;

        //Gestion de supression des produits
        const btnsSuppr = document.querySelectorAll(".deleteItem");
        btnsSuppr.forEach((btn) => {
          btn.addEventListener("click", () => {
            localStorage.removeItem(keyProduct(btn));
            cartItems.removeChild(
              btn.parentNode.parentNode.parentNode.parentNode
            );
            majTotalCart();
            visibleOrderForm();
          });
        });
        //Gestion des quantités dans le panier
        const itemInputs = document.querySelectorAll('.itemQuantity');
        itemInputs.forEach((input) => {
          input.addEventListener('input', () => {
            
            if (input.value > 0 && input.value <= 100) {
              const key = keyProduct(input);
              const product = productList(key);
              product.qte = parseInt(input.value);
              let objLine = JSON.stringify(product);
             
              localStorage.setItem(key, objLine);
              majTotalCart();
              visibleOrderForm();
            }
          });
        });
      });
  }
  majTotalCart();
  visibleOrderForm()
  
}

//---formulaire expressions regulieres---

let form = document.querySelector(".cart__order__form");
const formDivs = document.querySelectorAll(".cart__order__form__question");

const inputs = document.querySelectorAll(
  'input[type="text"],input[type="email"]'
);


inputs.forEach((input) => {
  input.parentNode.classList.add(input.name);
  input.addEventListener("input", (e) => {
    
    switch (e.target.id) {
      case "firstName":
        checkFName(e.target.value);

        break;
      case "lastName":
        checkLName(e.target.value);

        break;
      case "address":
        checkAddress(e.target.value);

        break;
      case "city":
        checkCity(e.target.value);

        break;
      case "email":
        checkEmail(e.target.value);

        break;

      default:
        null;
    }
  });
});

const errorDisplay = (tag, message, valid) => {
  const formContainer = document.querySelector(
    ".cart__order__form__question." + tag
  );
  let checkError = document.querySelector(
    ".cart__order__form__question." + tag + " > #" + tag + "ErrorMsg"
  );

  if (!valid) {
    formContainer.classList.add("error");
    checkError.textContent = message;
    checkError.style.fontSize = "18px";
  } else {
    formContainer.classList.remove("error");
    checkError.textContent = "";
  }
};

const checkFName = (value) => {
  if (value.length > 0 && (value.length < 3 || value.length > 20)) {
    errorDisplay(
      "firstName",
      "Le Prénom doit faire entre 3 et 20 caracteres",
      false
    );
    
  } else {
    errorDisplay("firstName", "", true);
    
  }
};
const checkLName = (value) => {
  if (value.length > 0 && (value.length < 3 || value.length > 20)) {
    errorDisplay(
      "lastName",
      "Le Nom doit faire entre 3 et 20 caracteres",
      false
    );
    
  } else {
    errorDisplay("lastName", "", true);
    
  }
};

const checkAddress = (value) => {
  if (!value.match(/^[0-9 ]+ [a-zA-Z ]+$/)) {
    errorDisplay("address", "L'adresse doit commencer par le numéro ", false);
    
  } else {
    errorDisplay("address", " ", true);
    
  }
};

const checkCity = (value) => {
  if (value.match(/^[A-Z][a-z ]+[0-9]{5}$/)) {
    errorDisplay("city", " ", true);
    
  } else {
    errorDisplay(
      "city",
      "Le nom de la ville doit commencer par une majuscule suivit du code postal ",
      false
    );
    
  }
};

const checkEmail = (value) => {
  if (value.match(/^[-._a-z0-9]+@{1}[a-z]+[.]{1}[a-z]{2,10}$/)) {
    errorDisplay("email", " ", true);
    
  } else {
    errorDisplay("email", "email non valide ", false);
    
  }
};
//Gestion du submit

if (form) {
  form.addEventListener("submit", (e) => {
    
    e.preventDefault();

    if (checkFName && checkLName && checkAddress && checkCity && checkEmail) {
      let productsId = [];
      for (let i = 0; i < localStorage.length; i++) {
        const product = productList(localStorage.key(i));
        productsId.push(product.id);
      }
      const bodyData = JSON.stringify({
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        products: productsId,
      });
      if (productsId.length > 0) {
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((response) => {
            let url = document.location.href;
            url = url.replace("cart.html", "confirmation.html");
            window.location.href = url + "?orderId=" + response.orderId;
          })
          .catch((error) => console.log(error));
      }

      alert("inscription validée!");
    } else {
      alert("veuillez remplir tous les champs du formulaire");
    }
    
  });
}

// Affichage orderId de la commande une fois validé
const orderId = document.getElementById("orderId");
if (orderId) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  orderId.textContent = urlParams.get("orderId");
  localStorage.clear();
}
