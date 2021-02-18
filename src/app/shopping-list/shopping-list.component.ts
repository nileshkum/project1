import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.services';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;

  constructor(private shoppingList: ShoppingListService ,
              private loggingService: LoggingService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingList.getIngredients();
    this.subscription = this.shoppingList.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
    this.loggingService.printLog('Hallo from Shopping List Componet');
  }

  // onIngredientAdded(ingredient: Ingredient){
  //   // this.ingredients.push(ingredient);
  //   this.shoppingList.onAddIngredient(ingredient);
  // }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

   onEditItem(index:number){
    this.shoppingList.startedEditing.next(index);
  }

}
