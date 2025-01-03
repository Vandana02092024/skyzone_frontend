const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isLoggedIn: true,
        user: action.payload.user,
      };

    case "LOGOUT":
      return {
        isLoggedIn: false,
        socketId: null,
        user: null,
      };

    default:
      return state;
  }
};

export default AuthReducer;
