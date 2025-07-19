import style from "./SCSS/Modal.module.scss"
import StarRating from '../../Components/Star'
import showToast from "../../utils/toast"
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    FakestoreCartCreate,
    FakestoreCheck
} from "../../Services/fakestore"

export default function Modal({ IsOpen, setModalOpen, product }) {
    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    const { t } = useTranslation()

    const addCart = async (data) => {
        try {
            const dataProduct = ({
                product: data
            })
            const result = await FakestoreCartCreate(dataProduct);
            showToast('success', t('addCart'))
            setModalOpen()
        } catch (error) {
            throw (error);
        }
    };
    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            if (response === undefined) {
                navigate('/')
            }
            setUser(response)
        };
        checklogin();
    }, []);

    if (IsOpen) {
        if (product) {
            return (
                <div className={style.modal}>
                    <div className={style.frente}>
                        <div className={style.product_image}>
                            <img src={Array.isArray(product.imagem) ? `http://localhost:3000/img/${product.imagem[0]}` : product.imagem} alt="imagem" />
                        </div>
                        <div className={style.corpo}>
                            <p className={style.title}>{product.title}</p>
                            <span className={style.rate}><StarRating rating={product.rating.rate} />{product.rating.rate}</span>
                            <p className={style.count}>{product.rating.count} {t('rate')}</p>
                            <p className={style.price}>R$ {product.price}</p>
                            <div className={style.line}></div>
                            <p className={style.description}>{product.description}</p>
                            <p className={style.category}>{product.category}</p>
                            {user ? <button onClick={(e) => { addCart(product.id) }} className={style.button_buy}>{t('buy')}</button> : <h2>Faça login para adicionar ao carrinho</h2>}
                        </div>
                        <button className={style.fechar} onClick={setModalOpen}>X</button>
                    </div>
                </div>
            )
        }
    }
    return null
}