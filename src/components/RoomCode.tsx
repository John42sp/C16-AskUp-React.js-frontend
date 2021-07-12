import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeToClipboard(){
        navigator.clipboard.writeText(props.code) //navigator: navegador nativo dos browsers
        
    }

    return (
        <button 
            className="room-code"
            onClick={copyRoomCodeToClipboard} 
        >
            <div >
                <img src={copyImg} alt="Copiar room code" />
            </div>

            <span>Sala #{props.code}</span>
        </button>
    )
}