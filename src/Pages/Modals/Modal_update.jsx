import React, { useEffect, useState } from "react";
import style from "./SCSS/ModalUpdate.module.scss"
import showToast from "../../utils/toast";
import Cookies from 'js-cookie'
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
    FakestoreUpdate,
    FakestoreCat,
    FakestoreSingle
} from "../../Services/fakestore";

const Modal_update = ({ isOpen, onClose, reference }) => {
    if (!isOpen) return null;
    const [categories, setCategory] = useState([]);
    const [product, setProduct] = useState([])
    const { register, handleSubmit, setValue } = useForm();
    const { t } = useTranslation();

    const closeModal = async (e, onClose) => {
        e.stopPropagation()
        Cookies.set("update", 2)
        onClose()
    }

    useEffect(() => {
        const getCategories = async () => {
            const response = await FakestoreCat();
            setCategory(response);
        };
        getCategories();
    }, []);

    useEffect(() => {
        const getProduct = async () => {
            const response = await FakestoreSingle(reference);
            if (response) {
                setProduct(response);
                setValue("title_pt", response.title_pt || "Título padrão PT");
                setValue("title_en", response.title_en || "Título padrão EN");
                setValue("title_es", response.title_es || "Título padrão ES");
                setValue("price", response.price || "Preço padrão");
                setValue("description_pt", response.description_pt || "Descrição padrão PT");
                setValue("description_en", response.description_en || "Descrição padrão EN");
                setValue("description_es", response.description_es || "Descrição padrão ES");
                if (Cookies.get("lang") === "pt-BR") {
                    setValue("category", response.categorypt);
                } else if (Cookies.get("lang") === "en-US") {
                    setValue("category", response.categoryen);
                } else {
                    setValue("category", response.categoryes);
                }

            }
        }
        getProduct();
    }, []);

    const onSubmit = async (data) => {
        try {
            const dataProduct = new FormData();
            dataProduct.append("title[title_pt]", data.title_pt);
            dataProduct.append("title[title_en]", data.title_en);
            dataProduct.append("title[title_es]", data.title_es);
            dataProduct.append("price", data.price);
            dataProduct.append("description[description_pt]", data.description_pt);
            dataProduct.append("description[description_en]", data.description_en);
            dataProduct.append("description[description_es]", data.description_es);
            dataProduct.append("category", data.category);
            dataProduct.append("imagem", data.imagem[0]);
            const result = await FakestoreUpdate(dataProduct, reference);
            if (result.status === 403) {
                showToast('error', result.msg)
                Cookies.set("update", 2)
                onClose()
            } else {
                showToast('success', t('toasty_up'));
                Cookies.set("update", 2)
                onClose()
            }

        } catch (error) {
            throw (error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <div className={style.container_modal}>
                    <div className={style.container_title}>
                        <div className={style.title_1}>
                            <label>{t('namept')}</label><br></br>
                            <input defaultValue={product.title_pt} className={style.campos} placeholder={t('placeName')}  {...register("title_pt")} />
                        </div>
                        <div className={style.title_2}>
                            <label>{t('nameen')}</label><br></br>
                            <input defaultValue={product.title_en} className={style.campos} placeholder={t('placeName')}  {...register("title_en")} />
                        </div>
                        <div className={style.title_3}>
                            <label>{t('namees')}</label><br></br>
                            <input defaultValue={product.title_es} className={style.campos} placeholder={t('placeName')}  {...register("title_es")} />
                        </div>
                    </div>
                    <div className={style.price}>
                        <label>{t('price')}</label>
                        <input defaultValue={product.price} className={style.campos} placeholder={t('placePrice')} {...register("price")} />
                    </div>
                    <div className={style.container_description}>
                        <div className={style.description_1}>
                            <label>{t('descriptionpt')}</label><br></br>
                            <textarea defaultValue={product.description_pt} className={style.description} placeholder={t('placeDescription')} type='text' name="description_pt" {...register("description_pt")}></textarea>
                        </div>
                        <div className={style.description_2}>
                            <label>{t('descriptionen')}</label><br></br>
                            <textarea defaultValue={product.description_en} className={style.description} placeholder={t('placeDescription')} type='text' name="description_en" {...register("description_en")}></textarea>
                        </div>
                        <div className={style.description_3}>
                            <label>{t('descriptiones')}</label><br></br>
                            <textarea defaultValue={product.description_es} className={style.description} placeholder={t('placeDescription')} type='text' name="description_es" {...register("description_es")}></textarea>
                        </div>
                    </div>
                    <div className={style.category}>
                        <label>{t('category')}</label>
                        <select name='categoy' id={style.category}{...register('category')}>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.files}>
                        <label for='selecao-arquivo'>{t('file')}</label>
                        <input id='selecao-arquivo' type='file' alt='imagem' name="imagem" {...register("imagem")} />
                    </div>
                    <div>
                        <button className={style.delete} onClick={(e) => { closeModal(e, onClose) }}>{t('back')}</button>
                        <button className={style.close} type="submit">{t('att')}</button>
                    </div>
                </div>
            </div>
        </form >
    );
}

export default Modal_update;