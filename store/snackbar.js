//@ts-check
export const state = () => ({
  snack: '',
  snackColor: ''
})

export const mutations = {
  setSnack (state, snack) {
    state.snack = snack;
  }
}