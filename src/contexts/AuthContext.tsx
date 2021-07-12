import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined;
    // signInWithGoogle: () => void; //função que nao recebe parametros = não retorna nada = void
    signInWithGoogle: () => Promise<void>; //tornou a função async/await, devolde promise, por isso mudou do de cima
  }

  type AuthContextProviderProps = {
      children: ReactNode;  // pra tipar children como: <Route path="/" exact component={Home}/> 
  }
  
  export const AuthContext = createContext({} as AuthContextType);

  //AuthContextProvider será usado no file App.tsx, encapsular as rotas
  export function AuthContextProvider(props: AuthContextProviderProps) {

    const [ user, setUser ] = useState<User>();
//useEffect pra realizar "recuperar o estado de autenticação" = manter user logado e infos c/ f5
    useEffect(() => { 
      //event listener, pra detectar que um user ja havia sido logado na app antes
     //numa variavel, pra zerar infos assim que user sair de tela, ou desfazer trabalho do event listener
      const unsubscribe =  auth.onAuthStateChanged(user => { //event listener .onAuthStateChange vai procurar
        if(user) {                                           //no firebase se este user ja existia antes, e
          const { displayName, photoURL, uid } = user;        //vai preencher com infos dele num f5
  
            if(!displayName || !photoURL) {
              throw new Error('Missing information from Google Account.')
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL,
            })
  
        }
      }) //BOA PRATICA: sempre que criar um event listener, bom se descadastrar no final do useEffect()
      return () => {  //retorna uma função que vai se desenscrever do event listener
        unsubscribe();  //aqui zera preenchimento do event listener caso user saia da tela / descadastre
      }
  
    },[]); // [} pra disparar uma unica vez. se quisesse disparar com cada novo user: [user];
  
    async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider(); //firebase vem de services/firebase.ts
  
      const result = await auth.signInWithPopup(provider);  //auth vem de services/firebase.ts
       
          if(result.user) {
            const { displayName, photoURL, uid } = result.user
  
            if(!displayName || !photoURL) {
              throw new Error('Missing information from Google Account.')
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL,
            })
          }
        
  
    }


    return (
// passando para as rotas as props do context como children
      <AuthContext.Provider value={{ user, signInWithGoogle }}> 
        {props.children}
      </AuthContext.Provider>


    )
  }