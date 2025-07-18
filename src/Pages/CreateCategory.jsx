import React, { useEffect, useState } from "react";
import style from './SCSS/CreateCategory.module.scss';
import showToast from '../utils/toast'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import { FakestoreAddCategory } from "../Services/fakestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'


const CreateCategory = (lang) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()
    const { register, handleSubmit, reset } = useForm();

    const currentLanguage = () => {
        const lang = Cookies.get('lang')
        i18n.changeLanguage(lang)
    }

    const voltar = () => {
        return navigate("/");
    }

    const onSubmit = async (data) => {
        try {
            const dataProduct = ({
                name_pt: data.category_pt,
                name_en: data.category_en,
                name_es: data.category_es,
            })
            const result = await FakestoreAddCategory(dataProduct);

            if (result.status === 201) {
                showToast('success', t('toasty_creC'))
                navigate("/");
            } else if (result.status === 403) {
                showToast('error', t('permissionError'))
                navigate("/");
            } else {
                showToast('error', t('formError'))
            }
        } catch (error) {
            throw (error);
        }
    };

    useEffect(() => {
        currentLanguage();
    }, []);


    return (
        <div className={style.container}>
            <div className={style.filho}>
                <h1>{t('add')}</h1>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className={style.fields}>
                        <label>{t('categorypt')}</label>
                        <input className={style.campos} placeholder={t('placeCategory')} type="text" name="category_pt" {...register("category_pt")} />
                        <label>{t('categoryen')}</label>
                        <input className={style.campos} placeholder={t('placeCategory')} type="text" name="category_en" {...register("category_en")} />
                        <label>{t('categoryes')}</label>
                        <input className={style.campos} placeholder={t('placeCategory')} type="text" name="category_es" {...register("category_es")} />

                        <div className={style.container_button}>
                            <button type="submit">{t('okProduct')}</button>
                            <p className={style.voltar} onClick={voltar}>{t('back')}</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
