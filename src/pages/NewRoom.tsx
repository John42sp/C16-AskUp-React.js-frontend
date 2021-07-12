
// import { useContext } from 'react';
import { useState, FormEvent } from 'react';

import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
// import { AuthContext } from '../contexts/AuthContext';


export function NewRoom() {
    
    // const { user } = useContext(AuthContext); //substituido pelo de baixo
    const { user } = useAuth();
    const history = useHistory();
    const [ newRoom, setNewRoom ] = useState('');

    async function handleCreateRoom(event: FormEvent) { //mandou user da home pra ca,função que realmente criara a sala
        event.preventDefault();

        // console.log(newRoom);
        if(newRoom.trim() === '') { //validação do newRoom: trim tira espaços vazios do campo / input digitado
            return; //não deixar criar sala sem nome
        }
        //criar referencia  de um registro , dado, entidade inserido no banco de dados
        const roomRef =  database.ref('rooms') //indicando q la no db, tenho uma categoria q se chama rooms

        const firebaseRoom = await roomRef.push({  //jogando uma nova sala dentro de rooms
            title: newRoom,
            authorId: user?.id,
        })   

        history.push(`/rooms/${firebaseRoom.key}`) //retorna a key, vista no Realtime Database, aba Dados
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
                    {/* <h1>{user?.name}</h1>  pra testar */} 
                    <h2>Criar uma nova sala</h2>               

                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    {/* Link substitui a (anchor) */}
                    <p>  
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link> 
                    </p>
            
                </div>
            </main>
        </div>
    )
}