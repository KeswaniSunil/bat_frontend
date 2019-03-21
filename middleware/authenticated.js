export default function({ store,redirect,route }){
    if(store.state.isAuth==false || store.state.username != route.params.username){
        return redirect("/"+route.params.username+'/login')
    }
}