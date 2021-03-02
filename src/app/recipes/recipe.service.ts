// import { EventEmitter, Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
// import * as fromShopingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes : Recipe[] = [];
  // constructor(private store: Store<fromShopingList.AppState>){
  constructor(private store: Store<fromApp.AppState>){

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
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
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
