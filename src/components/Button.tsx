import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

// type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>; 

//componente Button tem prop outlined na page admin, não no page Room do user, por isso adicionou IsOutlined abaixo
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean; //opcional, aplica somento pro admin, não pro user
};
//por padrão isOutlined é false, se torna true na page AdminRoon: <Button isOutlined >Encerrar sala</Button> 
export function Button({ isOutlined = false, ...props }: ButtonProps) { 

    return (    //retorna um elemento html (button), por isso recebeu o ButtonHTMLAttributes (padrão) do react
        <button 
            className={`button ${isOutlined ? 'outlined' : ''}`} //se outLined, usa 2 classes, se não, somente button
            { ...props }
        /> //spread operator pra passar todas propriedades 

    )
}
