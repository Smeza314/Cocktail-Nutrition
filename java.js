

axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
  .then(res => {
    let drinkList = []
    for (i = 0; i < 4; i++) {
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
  })
  .catch(err => console.error(err))

// axios.get('https://api.edamam.com/api/nutrition-data?app_id=c543d3f7&app_key=b07975353995fafd647e1d5c37e04dc0&ingr=1%20large%20apple')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => console.error(err))


