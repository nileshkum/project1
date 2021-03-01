import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInceptorService } from "./auth/auth-inceptor.service";
import { RecipeService } from "./recipes/recipe.service";
@NgModule({
  providers: [
    RecipeService,
       {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInceptorService,
         multi: true
       },

  ]
})
export class CoreModule{}
