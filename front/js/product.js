const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
const tabImg = [];


  fetch("http://localhost:3000/api/products/" + id)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((article) => {
    const itemImg = document.querySelector(".item__img");
    
    const img = document.createElement("img");
    img.src = article.imageUrl;
    img.alt = article.altTxt;
    tabImg.push(article.imageUrl);
    tabImg.push(article.altTxt);
    
    itemImg.appendChild(img);
    
    const title = document.getElementById("title");
    title.innerText = article.name;
    
    const price = document.getElementById("price");
    price.innerText = article.price;
    
    const description = document.getElementById("description");
    description.innerText = article.description;
    
    const selectColors = document.getElementById("colors");
    
    article.colors.forEach((color) => {
      const newOption = new Option(color, color);
      selectColors.options.add(newOption);
    });
    
  })
  .catch((err) => console.log(err));
  



//------LocalStorage

const btnAddToCart = document.getElementById('addToCart');
  btnAddToCart.addEventListener('click', () => {

    const itemContentAddButton = document.querySelector('.item__content__addButton');
    itemContentAddButton.style.display = 'block';
    itemContentAddButton.style.textAlign = 'center';

    
    const colors = document.getElementById('colors');
    const quantity = document.getElementById('quantity');
    const title = document.getElementById('title');

    let messages = document.createElement('div');
    messages.style.marginBottom = "32px";
    
    if(!colors.value) {
      messages.innerHTML += "- Color not selected ! <br>";
    }
    if(parseInt(quantity.value) < 1 || parseInt(quantity.value) > 100) {
      messages.innerHTML += "- Qte not indique ! <br>";
    }

    if(messages.innerHTML.length > 0) {
      const errorDiv = document.querySelector('#errorsDiv');

      if(errorDiv) {
        itemContentAddButton.removeChild(errorDiv);
      }

      messages.id = 'errorsDiv';
      itemContentAddButton.prepend(messages);
    }
    else {
      const idColor = id + '-' + colors.value;
      let objLinea = localStorage.getItem(idColor);

      if(objLinea !== null) {
        let objJson = JSON.parse(objLinea);
        let objJsonA = {
          id,
          
          qte : objJson.qte + parseInt(quantity.value),
          
          color: colors.value,
          
        }
        let objLineA = JSON.stringify(objJsonA);
        localStorage.setItem(idColor, objLineA);
      }
      else {
        let objJsonB = {
          id,
          
          qte : parseInt(quantity.value),
          
          color: colors.value,
          
        }
        let objLineB = JSON.stringify(objJsonB);
        localStorage.setItem(idColor, objLineB);
      }

      messages.innerHTML = "Ajout au panier effectué !";
      const errorDiv = document.querySelector('#errorsDiv');

      if(errorDiv) {
        itemContentAddButton.removeChild(errorDiv);
      }

      messages.id = 'errorsDiv';
      itemContentAddButton.prepend(messages);
    }
  });

