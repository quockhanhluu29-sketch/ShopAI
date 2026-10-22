export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userName: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userName: 'Guest',
};

export const authReducer = (
  state: AuthState = initialState,
  action: { type: string; payload?: Partial<AuthState> | string },
): AuthState => {
  switch (action.type) {
    case 'auth/login': {
      const payload = action.payload as Partial<AuthState>;
      return {
        isAuthenticated: true,
        token: payload.token ?? 'demo-token',
        userName: payload.userName ?? 'ShopAI Customer',
      };
    }
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export const loginAction = (payload: { userName: string; token: string }) => ({
  type: 'auth/login',
  payload,
});

export const logoutAction = () => ({
  type: 'auth/logout',
});
