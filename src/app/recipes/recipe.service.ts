// import { EventEmitter, Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
  // recipeSelected =   new EventEmitter<Recipe>();
  // recipeSelected =   new Subject<Recipe>();

  recipesChanged = new Subject<Recipe[]>();


  //   private recipes: Recipe[] = [
  //   new Recipe(
  //     '1 Test Recipe',
  //     'This is 1 test',
  //     'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg',
  //     [
  //       new Ingredient('Aalo', 5),
  //       new Ingredient('Peas', 100)
  //     ]),
  //   new Recipe(
  //     '2 Test Recipe',
  //     'This is 2 test',
  //     'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg',
  //     [
  //       new Ingredient('Corriander', 50),
  //       new Ingredient('Tamrind', 8)
  //     ]),
  // ];
  private recipes : Recipe[] = [];
  constructor(private shopplingService: ShoppingListService){

  }

setRecipes(recipes: Recipe[] ){
  this.recipes = recipes;
  this.recipesChanged.next(this.recipes.slice());
}

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index:number) {
    return this.recipes[index];
  }

  addIngedientToShoppingList(ingredients: Ingredient[]){
      this.shopplingService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index:number){
     this.recipes.splice(index,1);
     this.recipesChanged.next(this.recipes.slice());
  }
}
