// import { EventEmitter, Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShopingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes : Recipe[] = [];
  constructor(private shopplingService: ShoppingListService,
              // private store: Store<{shoppingList: {ingredients: Ingredient[]}}>){
              private store: Store<fromShopingList.AppState>){

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
      // this.shopplingService.addIngredients(ingredients);
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
