
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(values => {
    const selectItems = document.getElementById('items');

    values.forEach( value => {

      const linkA = document.createElement('a');
      linkA.href = "./product.html?id=" + value._id;

      const article = document.createElement('article');

      const img = document.createElement('img');
      img.src = value.imageUrl;
      img.alt = value.altTxt;

      const h3 = document.createElement('h3');
      h3.innerText = value.name;

      const p = document.createElement('p');
      p.innerText = value.description;

      article.appendChild(img);
      article.appendChild(h3);
      article.appendChild(p);
      linkA.appendChild(article);
      selectItems.appendChild(linkA);
      
    });

    // <a href="./product.html?id=42"> // 42 = product _id
    //   <article>
    //     <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1"> // src = product imageUrl + alt = product altTxt
    //     <h3 className="productName">Kanap name1</h3> // product name
    //     <p className="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu.
    //      Dis enim malesuada risus sapien gravida nulla nisl arcu.</p> // product description
    //   </article>
    // </a>
    
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
