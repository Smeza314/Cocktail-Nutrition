let drinkList = []

document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  document.getElementById('details').innerHTML = ``
  document.getElementById('cocktail-preview').innerHTML = ``
  getDrink(document.getElementById('searchValue').value)
  document.getElementById('searchValue').value = ''
}) 

const getDrink = (drinkSearch) => {
  axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkSearch}`)
    .then(res => {
      drinkList = []
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

            if(measure !== null){
              if (measure.includes('cL')) { measure = measure.replace('cL', 'tbsp')}
              if (measure.includes('Cl')) { measure = measure.replace('Cl', 'tbsp')}
              if (measure.includes('CL')) { measure = measure.replace('CL', 'tbsp')}
              if (measure.includes('cl')) { measure = measure.replace('cl', 'tbsp')}
            }

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
      localStorage.setItem('drinkList', JSON.stringify(drinkList))

      document.getElementById('cocktail-preview').innerHTML = ''

      for (let i = 0; i < length; i++) {
        document.getElementById('cocktail-preview').innerHTML += `
      <div class="col s12 m6 l3 previewCard">
        <div class="card">
          <div class="card-image">
            <img src="${drinkList[i].image}" alt="${drinkList[i].name}" class="cImg" data-index=${i}>
          </div>
          <div class="card-content" data-index=${i}>
            <p class="card-title center-align">${drinkList[i].name}</p>
          </div>
        </div>
      </div>
      `}
    })
    .catch(err => console.error(err))
}

document.addEventListener('click', event => {
  if (event.target.classList.contains('cImg') || event.target.classList.contains('card-content')) {

    drinkList = JSON.parse(localStorage.getItem('drinkList'))
    let index = event.target.dataset.index
    let drinkIngList = ''
    let drinkIngStrList = []

    drinkList[index].ingredients.forEach(elem => {
      if (elem.measure === null) { elem.measure = '' }
      drinkIngList += ` ${elem.measure} ${elem.ingredient},`
      let strIngr = `${elem.measure} ${elem.ingredient}`
      drinkIngStrList.push(strIngr)
    });
    let editedDrinkIngList = drinkIngList.slice(0, -1)

    let nutritionxRecipe = {
      query: editedDrinkIngList
    }

    let headers = {
      'x-app-id': '737c92b6',
      'x-app-key': '5f6a635e8cb4dee5fd687203394404fd',
      'x-remote-user-id': 0
    }

    axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', nutritionxRecipe, { headers })
      .then(res => {
        let totalNutr = res.data.foods
        let calPercent = 0
        let sugarPercent = 0
        let carbPercent = 0
        let sodiumPercent = 0
        let fatPercent = 0
        let cal = 0
        let sugars = 0
        let carbs = 0
        let fat = 0
        let sodium = 0

        totalNutr.forEach(elem => {
          cal += elem.nf_calories
          sugars += elem.nf_sugars
          carbs += elem.nf_total_carbohydrate
          fat += elem.nf_total_fat
          sodium += elem.nf_sodium
        })

        calPercent = (cal / 2000) * 100
        sugarPercent = (sugars / 100) * 100
        carbPercent = (carbs / 275) * 100
        fatPercent = (fat / 70) * 100
        sodiumPercent = (sodium / 2300) * 100

        document.getElementById('details').innerHTML = `  
          <div class="row padding">
            <!-- first column with image and drink name -->
            <div class="col s12 m12 l12 xl4">
              <div class="deetsBox">
                <div class="txtCenter">
                <div class="row">
                  <h1 class="nutri">${drinkList[index].name}</h1>
                </div>
                <div class="row">
                <img src="${drinkList[index].image}" alt="${drinkList[index].name}"
                  class="drinkImg" id="drinkImg">
                  </div>
                </div>
              </div>
            </div>
            <!-- ingredients list and instructions -->
            <div class="col s12 m12 l12 xl4">
              <div class="deetsBox">
                <h4 class="ingr">Ingredients</h4>
                <ul class="ingrList">
                  <li class="collection " id="ingredients"></li>
                </ul>
                <h4 class="ingr">Instructions</h4>
                <div class="instr" id="instructions">
                  <p>${drinkList[index].instruction}</p>
                </div>
              </div>
            </div>

            <!-- nutritional information -->
            <div class="col s12 m12 l12 xl4">
              <div class="deetsBox txtCenter">
                <div class="nutriBox">
                  <h1 class="nutri">Nutrients </h1>
                </div>

                <div class="row nutrDetails">
                  <div class="col rNutr">
                    <h3 class="values">Calorie</h3>
                    <p>${cal.toFixed(2)}kcal</p>
                    <div class="w3-light-grey w3-round-xlarge">
                      <div class="w3-container barFill w3-round-xlarge" style="width:${calPercent}%">${Math.floor(calPercent)}%</div>
                    </div>
                    <h3 class="values">Sugar</h3>
                    <p>${sugars.toFixed(2)}g</p>
                    <div class="w3-light-grey w3-round-xlarge">
                      <div class="w3-container barFill w3-round-xlarge" style="width:${sugarPercent}%">${Math.floor(sugarPercent)}%</div>
                    </div>
                    <h3 class="values">Carbs</h3>
                    <p>${carbs.toFixed(2)}g</p>
                    <div class="w3-light-grey w3-round-xlarge">
                      <div class="w3-container barFill w3-round-xlarge" style="width:${carbPercent}%">${Math.floor(carbPercent)}%</div>
                    </div>
                    <h3 class="values">Fat</h3>
                    <p>${fat.toFixed(2)}g</p>
                    <div class="w3-light-grey w3-round-xlarge">
                      <div class="w3-container barFill w3-round-xlarge" style="width:${fatPercent}%">${Math.floor(fatPercent)}%</div>
                    </div>
                    <h3 class="values">Sodium</h3>
                    <p>${sodium.toFixed(2)}mg</p>
                    <div class="w3-light-grey w3-round-xlarge">
                      <div class="w3-container barFill w3-round-xlarge" style="width:${sodiumPercent}%">${Math.floor(sodiumPercent)}%</div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        drinkIngStrList.forEach(elem => {
          document.getElementById('ingredients').innerHTML += `
                  <li class="collection-item">${elem}</li>
                `
        })
        document.getElementById('details').scrollIntoView({behavior:'smooth'})
      })
      .catch(err => console.error(err))

  }
})
