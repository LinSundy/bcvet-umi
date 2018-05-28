export function config() {
  return {
    onError(err) {
      err.preventDefault();
    },
    initialState: {
    },
  };
}
