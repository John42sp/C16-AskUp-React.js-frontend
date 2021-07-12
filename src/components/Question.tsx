import { ReactNode } from 'react' //tipagem especial do react pra children = qualquer conteudo jsx, = html
import '../styles/question.scss';



type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    children?: ReactNode; //deixar como opcional, se for obrigatorio, dara erro no AdminRoom,onde não usa children
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    content, 
    author, 
    children, 
    isAnswered = false, //se estas propriedades não forem informadas, por padrão vou entender q nao foi respnem c/ dest 
    isHighlighted = false
    }: QuestionProps) {

    return (
        <div className={`question ${isAnswered ? 'answered': ''} ${isHighlighted ? 'highlighted' : ''}`}>
        {/* // <div className="question"> */}

            <p>{content}</p>

            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
        {/* para admin o div serão 2 botões de controle, pro user é so um like = passar um children */}
                <div>
                    {children}
                </div> 
            </footer>
        </div>
    )
}