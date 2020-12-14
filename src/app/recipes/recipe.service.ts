import { EventEmitter } from '@angular/core';;
import { Recipe } from "./recipe.model";

export class RecipeService {
  recipeSelected =   new EventEmitter<Recipe>();


    private recipes: Recipe[] = [
    new Recipe('1 Test Recipe', 'This is 1 test','https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg'),
    new Recipe('2 Test Recipe', 'This is 2 test','https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg'),
  ];

  getRecipe(){
    return this.recipes.slice();

  }
}
