import * as React from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title?: string;
}

export const Input: React.FC<IProps> = ({ title, ...props }: IProps) => {
    const elId = props.id || `input_${Date.now()}`;
    delete props.id;

    return (
        <>
            {title && <label htmlFor={elId}>{title}</label>}
            <input id={elId} {...props} />
        </>
    );
};
