import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { database } from '../services/firebase';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';


export function Home() {

    const history = useHistory(); //ideal pra usar em funções em botoes, o <Link to="/.."> substitui a(anchor)
    // const { user, signInWithGoogle } = useContext(AuthContext)
    const { user, signInWithGoogle } = useAuth();

    const [ roomCode, setRoomCode ] = useState('');

    async function handleCreateRoom() {
        // const provider = new firebase.auth.GoogleAuthProvider();
        // auth.signInWithPopup(provider).then(result => {
        //     console.log(result);
         // })

         if(!user) {    
             await signInWithGoogle() //logar o usuario (usa um popup a 1ª vez). Proximas vezes estara logado,
         }                             //não usara mais o signInWithGoogle, já tera o user no context, no estado

        history.push('/rooms/new')     
    }

    async function handleJoinRoom(event:FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === '') {  //validação se roomCode estiver vazio
            return;
        }
        //fazer verificação de qual é a sala o user querendo acessar, e se existe
        const roomRef = await database.ref(`rooms/${roomCode}`).get(); //get pega todos dados da sala

        if(!roomRef.exists()) {
            alert('Room does not exist.')
            return;
        }
        //verificação  de sala ja encerrou = se valor de roomRefcontiver prop endedAt, não prosseguirá 
        if(roomRef.val().endedAt) {
            alert('Room already closed.')
            setRoomCode('');
            return;
        }
        //se passou por todas validações, enfim levar user pra sala com tal codigo
        history.push(`rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />

                <strong>Crie salas de Q&amp;A ao-vivo</strong>

                <p>Tire as duvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />

                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="logo do Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator">ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom} >
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode} //aqui pro campo input zerar conforme definido na função setRoomCode() 
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
            
                </div>
            </main>
        </div>
    )
}