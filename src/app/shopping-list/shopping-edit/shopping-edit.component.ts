import { Component, OnInit ,OnDestroy, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import {Ingredient} from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShopingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private shoppingList:ShoppingListService,
              private store: Store<fromShopingList.AppState>) { }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnInit(): void {
     this.subscription = this.store.select('shoppingList').subscribe(
      stateData => {
        if(stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
          name:this.editedItem.name,
          amount: this.editedItem.amount
        })

        } else {
          this.editMode = false;
        }
      }
    );
  }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name,value.amount);
    if(this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient( newIngredient
        )
      );
    } else {
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
  }
   form.reset();
   this.editMode = false;
}

  onClear(){
   this.slForm.reset();
   this.editMode = false;
   this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onDelete(){
    this.store.dispatch(new ShoppingListActions.DeleteIngredient()
  );
    this.onClear();
  }

}
