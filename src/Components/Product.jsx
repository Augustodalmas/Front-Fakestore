import { useEffect, useState } from 'react';
import style from './SCSS/Product.module.scss'
import StarRating from './Star'
import { useTranslation } from 'react-i18next'
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosRemove } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";

export default function Product({ id, name, url, categoria, rating, avaliacao, valor, onDelete, onUpdate, onCart, imagensSecundarias }) {
    const { t } = useTranslation()
    const [username, setUser] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [mainImagem, setMainImagem] = useState(url)

    const removeItens = async (e) => {
        e.stopPropagation();
        setQuantity((prev) => Math.max(prev - 1, 1));
    };

    const addCart = async (e) => {
        e.stopPropagation();
        setQuantity((prev) => prev + 1);
    };


    useEffect(() => {
        const user = sessionStorage.getItem('User')
        setUser(user)
    }, [])

    return (
        <div className={style.card_product}>
            {/* {username ? (
                username === 'comprador' ? <></> : (
                    <div className={style.container_button}>
                        <button className={style.update} onClick={(e) => onUpdate(e, id)}><GoPencil /></button>

                        {username === 'admin' && (
                            <button className={style.delete} onClick={(e) => onDelete(e, id)}><MdDeleteOutline /></button>
                        )}
                    </div>
                )
            ) : null} */}
            <img src={mainImagem} alt={t('imagem')} />
            <div className={style.container_imagem}>
                {[url, ...imagensSecundarias].map((imagem, index) => (
                    <img key={index} src={imagem} alt={t("imagem")} onClick={(e) => (e.stopPropagation(), setMainImagem(imagem))} />
                ))}
            </div>
            {/* <img src={`http://localhost:3000/img/${url}`} alt={t('imagem')} /> */}
            <div className={style.text_product}>
                <h3>{name}</h3>
                <p className={style.category_product}>{categoria}</p>
                <span className={style.rating}><StarRating rating={rating} />{rating}</span>
                <p className={style.avalia}>{avaliacao} {t('rate')}</p>
                <div className={style.line}></div>
                <h3 className={style.price}>R$ {valor}</h3>
                <div className={style.menu_user}>
                    <div className={style.container_quantity}>
                        <button className={`${style.remove} no-modal`} onClick={removeItens}><IoIosRemove /></button>
                        {quantity}
                        <button className={`${style.add} no-modal`} onClick={addCart}><IoIosAdd /></button>
                    </div>
                    <button className={style.update} onClick={(e) => onCart(e, id, quantity)}><img src='./imagens/carrinho.png' alt={t('imagem')} /><span>adicionar ao carrinho</span></button>
                </div>
            </div>
        </div >
    )
}
