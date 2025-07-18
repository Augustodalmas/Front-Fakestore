import React, { useEffect, useState } from 'react';
import style from './SCSS/ProductLine.module.scss';
import { GoPencil } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { IoCartOutline } from "react-icons/io5";

function ProductTable({ id, name, url, categoria, rating, avaliacao, valor, onDelete, onUpdate, onCart }) {
    const [username, setUser] = useState(null)

    useEffect(() => {
        const user = localStorage.getItem('User')
        setUser(user)
    }, [])

    return (
        <table className={style.productTable}>
            <tbody>
                <tr>
                    <td><img src={`http://localhost:3000/img/${url}`} alt={name} className={style.productImage} /></td>
                    <td>{name}</td>
                    <td>{categoria}</td>
                    <td>{rating}</td>
                    <td>R$ {valor}</td>
                    {username === ('comprador') ? <></>
                        :
                        <td className={style.container_button}>
                            <button className={style.update} onClick={(e) => onCart(e, id)}><IoCartOutline /></button>
                            <button className={style.update} onClick={(e) => onUpdate(e, id)}><GoPencil /></button>
                            {username === 'admin' ? <><button className={style.delete} onClick={(e) => onDelete(e, id)}><MdDeleteOutline /></button></> : <></>}
                        </td>}
                </tr>
            </tbody>
        </table >
    );
}

export default ProductTable;
