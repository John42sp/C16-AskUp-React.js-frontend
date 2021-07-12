//SALA PRO VISITANTE
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function Room() {

    const { user } = useAuth()
    const params = useParams<RoomParams>();
    const [ newQuestion, setNewQuestion ] = useState('');
 
//no Home coloquei o codigo da sala como parametro no url, passando pra Room, cujo id/parametro é pego pelo params.is 
    const roomId = params.id;
//extraindo itens do hook useRoom() de acordo o roomId, que vem do params
    const { title, questions } = useRoom(roomId); 

//pra enviar nova pergunta pro firebase Realtime DB, com esta estrutura e infos
    async function handleSendQuestion(event: FormEvent) { 
        event.preventDefault();
        if(newQuestion.trim() === ''){
            return;
        }

        if(!user) {
            throw new Error('You must be logged in!')
        }
        //colocando uma nova pergunta no firebase DB conforme esta estrutura e infos
        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false, //destaque admin da pra determinar q pergunta esta sendo respondida atualmente
            isAnswered: false, //não esta respondida ainda
        };

        //finalmente vou referenciar a sala tal pelo roomId, criar novo elelemnto 'questions', com conteudo 'question'
        await database.ref(`rooms/${roomId}/questions`).push(question);
        setNewQuestion('');
    }
//assim como handleSendQuestion() somente registra perguntas no firebase DB, handleLikeQuestion() apenas registrará os likes no firebase, mas pra mostrar em tela, adicionou
//codigo no useRoom() hook
    async function handleLikeQuestion(questionId: string, likeId: string | undefined) { 
        //(apenas meros params representando)
        //valores vindo la em baixo do botão
        //vindo com a variavel questions
     
//aqui tornando a função com funcionalidade de um toogle: se já tem likeId, botão remove, se não, botão adiciona
        if (likeId) { //
          await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()//esta localisa e remove
        } else {
            //1º localizando onde colocar like,depois, o que colocar = authorId, como user pode ser undefined, user?.id
          await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({ //esta linha cria likeId no firebas
            authorId: user?.id,
          })
        }
      }

    return (

        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea //como um input
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>

                </form>

                {/* {JSON.stringify(questions)}  p/ renderizar perguntas em tela, apenas pra testesem estilo  */}

{/* renderizar cada item/pergunta em tela dentro de um componente, vindo do Firebase DB, conforme infos de cada item */}
                <div className="question-list">
                    {questions.map(question => { //renderizar perguntas conforme formatado no componente, c/ stilo

                        return (
                            <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                          >
                            {!question.isAnswered && (
                              <button
                                className={`like-button ${question.likeId ? 'liked' : ''}`}
                                type="button"
                                aria-label="Marcar como gostei"
                                onClick={() => handleLikeQuestion(question.id, question.likeId)}
                              >
                                { question.likeCount > 0 && <span>{question.likeCount}</span> }
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            )}
                          </Question>
                        )
                    })}
                </div>
            </main>
        </div>


    )
}