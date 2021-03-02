import { UserModel } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: UserModel
}

const initailState: State = {
  user: null
};

export function authReducer(state = initailState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new UserModel(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
        );
        return {
          ...state,
          user
        };
    case AuthActions.LOGOUT :
      return {
        ...state,
        user: null
      }

    default:
      return state;
  }
}
