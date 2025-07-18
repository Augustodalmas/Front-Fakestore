import React, { useEffect, useState } from "react";
import showToast from "../../utils/toast";
import style from "./SCSS/ModalCart.module.scss";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { IoIosRemove } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import {
    FakestoreCartCreate,
    FakestoreCartDelete,
    FakestoreCartDeleteItem,
    FakestoreCartId,
    FakestoreCartUnique,
    FakestoreCheck,
    fakestorePDFcart,
    FakestoreRate,
    getStripe,
    verify
} from '../../Services/fakestore';

const Modal_cart = ({ isOpen, onClose, reference }) => {
    if (!isOpen) return null;
    const [products, setProduct] = useState(null);
    const [username, setUser] = useState(null);
    const [removeI, setRemove] = useState(null)
    const [addI, setAdd] = useState(null)
    const [addPago, setPago] = useState(null)
    const { register, handleSubmit } = useForm();
    const { t } = useTranslation();

    const closeModal = async (e, onClose) => {
        e.stopPropagation();
        onClose();
    };

    const rateProduct = async (data) => {
        const ratedProducts = data.ratings.filter(rating => rating.rateValue);

        if (ratedProducts.length === 0) {
            showToast("error", "Você precisa avaliar pelo menos um produto.");
            return;
        }

        for (let rating of ratedProducts) {
            const dataProduct = {
                rating: { rate: parseInt(rating.rateValue, 10) }
            };

            const response = await FakestoreRate(dataProduct, username.user._id, rating.productID);

            if (response.status === 200) {
                showToast("success", `Produto avaliado com sucesso!`);
                onClose();
            } else if (response.status === 403) {
                showToast("error", `Você não possui o item no seu histórico!`);
            } else {
                showToast("error", `Erro ao avaliar produto: ${response.msg}`);
            }
        }
    };

    const calculateTotal = () => {
        let total = 0;
        products.cart.products.map((product) => (
            total += product.count
        ));
        return total;
    };

    const calculateTotalValue = () => {
        let total = 0;
        products.cart.products.map((product) => (
            total += product.price * product.count
        ));
        return total.toFixed(2);
    };

    const stripe = async () => {
        const response = await getStripe()
        return response.id
    }

    useEffect(() => {
        const verificacao = async () => {
            const isSucess = await verify()
            if (isSucess.success === true) {
                const response = await FakestoreCartDelete();
                setPago(response)
            }
        }
        verificacao()
    }, [])

    const buyItens = async (e) => {
        if (calculateTotal() <= 0) {
            showToast('error', 'O carrinho está vazio')
        } else {
            const url = await stripe()
            window.location.href = url
        }
    };

    const removeItens = async (e, id) => {
        const response = await FakestoreCartDeleteItem(id);
        setRemove(response)
    };

    const addCart = async (e, data) => {
        try {
            const dataProduct = ({
                product: data
            })
            const result = await FakestoreCartCreate(dataProduct);
            setAdd(result)
        } catch (error) {
            throw error
        }
    };

    const baixarNF = async (e) => {
        showToast('info', t('downloadPDF'));
        const response = reference ? await fakestorePDFcart(reference) : await fakestorePDFcart(products.cart.id);
        console.log(response);

        closeModal(e, onClose);
    };

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            setUser(response);
        };
        checklogin();
    }, []);

    useEffect(() => {
        const getCartId = async () => {
            const response = reference ? await FakestoreCartId(reference) : await FakestoreCartUnique();
            if (response.status === 404 || response.status === 403) {
                showToast('error', t('loginRequired'));
                onClose();
            }
            setProduct(response);
        };
        getCartId();
    }, [removeI, addI, addPago]);

    return (
        <div className={style.modal}>
            <div className={style.container_modal}>
                <h1>{t('cartBy')}{products ? products.cart.user : "..."}</h1>
                {products ? (
                    <>
                        <table>
                            <div className={style.productTable}>
                                <tbody>

                                    {products.cart.products.map((product, index) => (
                                        <tr className={style.product} key={product.id}>
                                            <td><img src={product.image} alt="foto" className={style.productImage} /></td>
                                            <td>{product.title}</td>
                                            <td>R$: {product.price}</td>
                                            <td>
                                                {!reference ?
                                                    <>
                                                        <button className={style.remove} onClick={(e) => { removeItens(e, product.id) }}><IoIosRemove /></button>{product.count}<button onClick={(e) => { addCart(e, product.id) }} className={style.add}><IoIosAdd /></button></>
                                                    :
                                                    <>
                                                        {product.count}
                                                    </>
                                                }
                                            </td>
                                            {reference && !username?.user?.products_reviewed?.includes(product.id) && (
                                                <td>
                                                    <form onSubmit={handleSubmit(rateProduct)}>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            {...register(`ratings.${index}.rateValue`)}
                                                            className={style.rateInput}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            value={product.id}
                                                            {...register(`ratings.${index}.productID`)}
                                                        />
                                                        <button type="submit" className={style.rateButton}>Avaliar</button>
                                                    </form>
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                </tbody>
                            </div>
                        </table>
                        <div className={style.infos}><h3>{t('itensCart')}: <strong>{calculateTotal()}</strong></h3><h3>valor total: <strong>R$ {calculateTotalValue()}</strong> </h3></div>
                    </>
                ) : (
                    <h1>{t('loginRequired')}</h1>
                )}
                <div className={style.buttonContainer}>
                    <button onClick={(e) => closeModal(e, onClose)} className={style.closeButton}>Sair</button>
                    {reference !== undefined && reference !== null ? (
                        <button onClick={(e) => baixarNF(e)} className={style.downloadButton}>Baixar NF</button>
                    ) : (
                        <button onClick={(e) => buyItens(e)} className={style.buyButton}>Comprar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal_cart;
