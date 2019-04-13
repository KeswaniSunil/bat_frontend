//@ts-check
export const state = () => ({
  snack: '',
  snackColor: 'primary',
  snackTimeout:2000
})

export const mutations = {
  setSnack (state, snack) {
    state.snack = snack;
  }
}