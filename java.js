
document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  getDrink(document.getElementById('searchValue').value)
  // Axios request

  // let drinkList = [
  //   {
  //     name: 'drink 1',
  //     image: 'drink 1 image'
  //   },
  //   {
  //     name: 'drink 2',
  //     image: 'drink 2 image'
  //   },
  //   {
  //     name: 'drink 3',
  //     image: 'drink 3 image'
  //   },
  //   {
  //     name: 'drink 4',
  //     image: 'drink 4 image'
  //   }
  // ]


  // document.getElementById('cocktail-preview').innerHTML = ''

  // for(let i = 0; i < 4; i++){
  //   document.getElementById('cocktail-preview').innerHTML += `
  //   <div class="col s12 m6 l3 previewCard">
  //     <div class="card">
  //       <div class="card-image">
  //         <img src="./example_card_image.jpg" alt="${drinkList[i].image}">
  //       </div>
  //       <div class="card-content">
  //         <p class="card-title center-align">${drinkList[i].name}</p>
  //       </div>
  //     </div>
  //   </div>
  //   `
  // }


})






// axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => console.error(err))

// axios.get('https://api.edamam.com/api/nutrition-data?app_id=c543d3f7&app_key=b07975353995fafd647e1d5c37e04dc0&ingr=1%20large%20apple')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => console.error(err))

const getDrink = (drinkSearch) => {
  axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkSearch}`)
    .then(res => {
      console.log(res)
      let drinkList = []
      let length = res.data.drinks.length
      if (length > 4) {
        length = 4
      }
      for (i = 0; i < length; i++) {
        let drink = res.data.drinks[i]
        let drinkName = drink.strDrink
        let instructions = drink.strInstructions
        let drinkImage = drink.strDrinkThumb
        let drinkIng = []


        for (j = 1; j <= 15; j++) {
          let strIng = 'strIngredient' + j
          if (drink[strIng]) {
            let ingredient = drink['strIngredient' + j]
            let measure = drink['strMeasure' + j]
            let recipe = {
              'ingredient': ingredient,
              'measure': measure
            }
            drinkIng.push(recipe)
          }
        }
        let drank = {
          'name': drinkName,
          'instruction': instructions,
          'image': drinkImage,
          'ingredients': drinkIng
        }
        drinkList.push(drank)
      }
      console.log(drinkList)

      document.getElementById('cocktail-preview').innerHTML = ''

      for (let i = 0; i < length; i++) {
        document.getElementById('cocktail-preview').innerHTML += `
      <div class="col s12 m6 l3 previewCard">
        <div class="card cardLink">
          <div class="card-image">
            <img src="${drinkList[i].image}" alt="${drinkList[i].name}" class="cImg" data-index=${i}>
          </div>
          <div class="card-content" data-index=${i}>
            <p class="card-title center-align">${drinkList[i].name}</p>
          </div>
        </div>
      </div>
      `}
      document.addEventListener('click', event => {
        if (event.target.classList.contains('cImg')|| event.target.classList.contains('card-content')) {
          console.log('hi')
          let index = event.target.dataset.index
          console.log(index)
          document.getElementById('details').innerHTML = `
          
          <div class="row padding">
          
          <div class="col s12 m12 l12 xl6">
          <div class="detailBox">
          <div class="row" id="drinkDisplay">
          <img src="${drinkList[index].image}" alt="${drinkList[index].name}" id="drinkImg">
          <h1>"${drinkList[index].name}"</h1>
          </div>
          <div class="row collection" id="ingredients">
          <a href="#!" class="collection-item"></a>
          <a href="#!" class="collection-item active"></a>
          <a href="#!" class="collection-item"></a>
          <a href="#!" class="collection-item"></a>
          </div>
          </div>
          </div>
          
          <div class="col s12 m12 l12 xl6" id="nutrition">
          <div class="detailBox">
          <h5>Instructions</h5>
          <p>${drinkList[index].instruction}</p>
          </div>
          
          </div>
          
          </div>`
        }
      })
    })
    .catch(err => console.error(err))
}


  // axios.get('https://api.edamam.com/api/nutrition-data?app_id=c543d3f7&app_key=b07975353995fafd647e1d5c37e04dc0&ingr=1%20large%20apple')
  //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => console.error(err))


