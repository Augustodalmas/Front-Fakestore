import { useEffect, useState } from "react";
import style from './SCSS/Register.module.scss'
import showToast from "../utils/toast";
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import { FakestoreRegister } from '../Services/fakestore'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'


function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const currentLanguage = () => {
        const lang = Cookies.get('lang')
        i18n.changeLanguage(lang)
    }

    const exit = () => {
        navigate('/')
    }

    const onSubmit = async (data) => {
        try {
            const dataProduct = ({
                username: data.username,
                name: data.name,
                password1: data.password1,
                password2: data.password2,
                vendedor: data.vendedor ? 'vendedor' : 'comprador'
            })
            const result = await FakestoreRegister(dataProduct);
            if (result.status === 409) {
                showToast('error', t('repeatUser'))
            } else if (result.status === 201) {
                showToast('success', t('sucessoRegister'))
                localStorage.setItem('User', dataProduct.vendedor)
                navigate("/login");
                reset();
            } else if (result.status === 422) {
                showToast('error', 'Usuário precisa ter no minímo 3 caracteres')
                showToast('error', 'A senha precisa ter no minimo 8 caracteres')
                showToast('error', 'A senha precisa ter no minimo 1 caracter especial')
                showToast('error', 'A senha precisa ter no minimo 1 numero')
                showToast('error', 'A senha não pode ter sequencia de numeros e caracteres')
            } else {
                showToast('error', t('formError'))
            }
        } catch (error) {
            throw (error);
        }
    };

    useEffect(() => {
        currentLanguage()
    }, [])

    return (
        <div className={style.container_login}>
            <form className={style.form} onSubmit={handleSubmit(onSubmit)} method="post">
                <div className={style.container_logo}>
                    <a className={style.exit} onClick={exit}>X</a>
                    <img src="./imagens/logo-bearByte.svg" alt="BearByte" />
                    <h1>Register</h1>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td><label >{t('username')}</label></td>
                            <td><input placeholder={t('username')} type="text" {...register('username')} /></td>
                        </tr>
                        <tr>
                            <td><label >{t('nome')}</label></td>
                            <td><input placeholder={t('nome')} type="text" {...register('name')} /></td>
                        </tr>
                        <tr>
                            <td><label >{t('pass1')}</label></td>
                            <td><input placeholder={t('pass1')} type={passwordVisible ? "text" : "password"} {...register('password1')} /></td>
                        </tr>
                        <tr>
                            <td><label >{t('pass2')}</label></td>
                            <td><input placeholder={t('pass2')} type={passwordVisible ? "text" : "password"} {...register('password2')} /></td>
                            <td><button type="button" onClick={togglePasswordVisibility} className={style.toggleButton} >{passwordVisible ? "😶‍🌫️" : "🫣"}</button></td>
                        </tr>
                        <tr>
                            <td><label >Você é vendedor?</label></td>
                            <td><input type="checkbox" {...register('vendedor')} /></td>
                        </tr>
                        <tr>
                            <td><a href="/login">{t('notaccount2')} {t('login')}</a></td>
                            <td><button type="submit">{t('register')}</button></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div >
    )
}

export default Register;