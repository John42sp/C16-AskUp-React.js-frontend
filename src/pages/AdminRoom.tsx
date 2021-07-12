//SALA PRO VISITANTE

import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';


import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


import '../styles/room.scss';



type RoomParams = {
    id: string;
}


export function AdminRoom() {

    // const { user } = useAuth()
    const params = useParams<RoomParams>();
    const history = useHistory()
    
    const roomId = params.id;

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() { //função encerrar sala. O Id da sala já é fornecido pelo params.id p/ identificar 
         await database.ref(`rooms/${roomId}`).update({ //update() vai alterar dados da sala, a qual ficara indisponivel
             endedAt: new Date(),
         });
    history.push('/');
    }

   async function handleDeleteQuestion(questionId: string) {
        //confirm() função nativa do JS, pra substituir um modal de confirmação. retorna boolean
        if(window.confirm("Tem certeza que deseja excluir esta pergunta?")) {
             await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswerd(questionId: string) {       
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })

    }

    async function handleHighlightQuestion(questionId: string) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    return (

        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div> 
                        <RoomCode code={roomId} />
                        {/* não precisa passar isOutlined={true}, somente outLined já valerá como true */}
                        <Button isOutlined  onClick={handleEndRoom}>Encerrar sala</Button> 

                    </div>
                    
                </div>
                
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>



                {/* {JSON.stringify(questions)}  p/ renderizar perguntas em tela = teste  */}

                <div className="question-list">
                    {questions.map(question => { //renderizar perguntas conforme formatado no componente, c/ stilo

                        return (
                            <Question
                                key={question.id} //p/ react identificar uma pergunta da outra
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >                            
{/* fazer desaparecer os botoes isAnswered e isHighlighted, caso admin tenha clicado botão isAnswered */}
                                {!question.isAnswered && ( 
                                    <>
                                    <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={checkImg} alt="Dar destaque a pergunta" />
                                    </button>                                   

                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswerd(question.id)}
                                    >
                                        <img src={answerImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    </>
                                )}

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                            </Question>

                        )
                    })}
                </div>
            </main>
        </div>


    )
}