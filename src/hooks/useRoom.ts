//algo apenas visual que se repete em várias pges na app: criar componente
//algo com mesma funcionalidade que se repete varias vezes em nossa app, criar hook

//aqui criando funcionalidade de forma igual, tanto pra sala do admin quanto p/ sala de usuarios


import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

//https://console.firebase.google.com/project/letmeask-c16/database/letmeask-c16-default-rtdb/data

//parametro room no useEffect mstrou tipagem 'DataSnapshot', typescript não entende dados do question, tipar:
//criar tipo do questions: um objeto, que a chave é string, e valor é outro objeto

//FirebaseQuestions =tipagem de variavel firebaseQuestions, definindo estrutura de infos das questions vindo do firebase
type FirebaseQuestions = Record<string, { //pra tipar objeto: Record
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {  //1º string será id do like, 2º será id do author
    authorId: string;
  }>
}>

type QuestionType = { //tipagem do state 'questions', a repassar pro Room, e AdminRoom
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  // hasLike: boolean;
  likeId: string | undefined; //poderá ser string ou undefined
}

//hook useRoom() estrutura da listagem de perguntas e formatação de cada pergunta, usado em Room.tsx e AdminRoom.tsx
export function useRoom(roomId: string) {  //roomId como parametro
  const { user } = useAuth();
  const [ questions, setQuestions ] = useState<QuestionType[]>([])
  const [ title, setTitle ] = useState('');

  //renderizar questions em tela (Room)
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    //buscar dados das questions, conforme docs do firebase, e tbm retornar uma função que vai desenscrever de
    //event listener
    roomRef.on('value', room => {   //event listener (ouvindo varios), se fosse 1: roomRef.once('value'), ...
    // console.log(room.val()) retorna questions como objeto, parsear pra arrray com Object.entries(..)
      const databaseRoom = room.val();
      //firebaseQuestion = pegando os valores de cada pergunta e colocando em uma estrutura tipada FirebaseQuestion
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};//questios vindo da databaseRoom

      //Object.entries = colocando os valores do firebaseQuestions no parseQuestions, e tbm fazendo algo c/ cada elemento deles 
      //https://www.w3schools.com/js/js_object_display.asp
      //Object.entries(obj) – returns an array of [key, value] pairs.
      //Object.values(obj) – returns an array of values.
      //Object.keys(obj) – returns an array of keys.
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {  //transformando em array cada item/pergunta na lista no FirebaseDB, e preenchendo elas no 'question'
          id: key, // ATENÇÃO: TODAS INFOS DO 'QUESTIONS' PREENCHIDAS PELO firebaseQuestions, EXCETO LIKES, NA ROOM.TSX
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered, //likes NÃO vem como array, vem como objeto! 
          likeCount: Object.values(value.likes ?? {}).length, //quantos likes a question pode ter, podendo ser zero
          //hasLike = propriedade dos dados do user que deu like, precisa dados do user, extrair do hook useAuth()
          //metodo some() vai percorrer uma lista, até encontrar item que satisfaça alguma condição e retorna true/false
          // hasLike: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id),

          //aqui não quero mais valor boolean, quero conteudo com com like de quem, quandousa entries, usa key, value 
          //vai encontrar chave e valor caso ele tenha encontrado, se não encontrou nada, vai retornar 0 = undefined
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })
    // console.log(parsedQuestions)
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    return () => { // aqui está enfim desescrevendo do event listener (aula4,  55 mnts)
      roomRef.off('value');
    }
  }, [roomId, user?.id]); //user?.id = variável / dependencia vindo de fora do useEffect, colocar aqui como 2º param
                          //pro useEffect funcionar da melhor forma (aula 4, 52 mnts) 

  return { questions, title }
}