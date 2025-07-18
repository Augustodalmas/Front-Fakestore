import { useEffect, useState } from "react";
import style from './SCSS/login.module.scss'
import showToast from "../utils/toast";
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import { FakestoreLogin } from '../Services/fakestore'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'


function Login() {
    const [contador, setContador] = useState(3);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { t, i18n } = useTranslation()
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const currentLanguage = () => {
        const lang = Cookies.get('lang')
        i18n.changeLanguage(lang)
        if (!Cookies.get('tent')) {
            Cookies.set('tent', 'passed')
        }
    }

    const exit = () => {
        navigate('/')
    }

    const onSubmit = async (data) => {
        try {
            const dataProduct = ({
                username: data.username,
                password1: data.password1,
                password2: data.password2,
            })
            const result = await FakestoreLogin(dataProduct);
            if (result.status === 201) {
                showToast('success', t('sucessoLogin'))
                Cookies.set('tent', 'passed')
                navigate("/");
                reset();
            } else {
                if (contador > 0 && (Cookies.get('tent') !== 'block')) {
                    if (dataProduct.username) {
                        showToast('error', `${t('tentLog')}${contador}`)
                        setContador(contador - 1)
                    } else {
                        showToast('error', 'Usuário não encontrado')
                    }
                } else {
                    showToast('info', t('userBlock'))
                    showToast('error', result.msg)
                    // Cookies.set('tent', 'block', { expires: 1 })
                }
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
                    <h1>Login</h1>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td><label >{t('username')}</label></td>
                            <td><input placeholder={t('username')} type="text" {...register('username')} /></td>
                        </tr>
                        <tr>
                            <td><label >{t('pass1')}</label></td>
                            <td><input placeholder={t('pass1')} type={passwordVisible ? "text" : "password"} {...register('password1')} /></td>
                            <td><button type="button" onClick={togglePasswordVisibility} className={style.toggleButton} >{passwordVisible ? "😶‍🌫️" : "🫣"}</button></td>
                        </tr>
                        <tr>
                            <td><a href="/register">{t('notaccount')} {t('register')}</a></td>
                            {Cookies.get('tent') === 'block' ?
                                <td><button disabled type="submit">{t('login')}</button></td> :
                                <td><button type="submit">{t('login')}</button></td>}
                        </tr>
                        {/* <tr>
                            <td></td>
                            <td><a className={style.exit} onClick={exit}>X</a></td>
                        </tr> */}
                    </tbody>
                </table>
            </form>
        </div >
    )
}

export default Login;