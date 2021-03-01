import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.services';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;


  constructor(private shoppingList: ShoppingListService ,
              private loggingService: LoggingService,
              private store: Store<fromShoppingList.AppState>) { }


  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList'); // returns slice of store
  }



  ngOnDestroy(){

  }

   onEditItem(index:number){
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
