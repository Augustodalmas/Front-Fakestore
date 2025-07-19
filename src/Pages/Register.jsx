import { useEffect, useState } from "react";
import style from './SCSS/Register.module.scss'
import showToast from "../utils/toast";
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import { FakestoreRegister } from '../Services/fakestore'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { IoEyeOutline, IoEyeOffOutline, IoCloseOutline, IoPersonAddOutline, IoLogInOutline } from "react-icons/io5"


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
                    <a className={style.exit} onClick={exit}><IoCloseOutline /></a>
                    <img src="./imagens/logo-bearByte.svg" alt="BearByte" />
                    <h1><IoPersonAddOutline /> Register</h1>
                </div>
                <div className={style.form_fields}>
                    <div className={style.input_group}>
                        <label>{t('username')}</label>
                        <input placeholder={t('username')} type="text" {...register('username', { required: true, minLength: 3 })} />
                    </div>
                    
                    <div className={style.input_group}>
                        <label>{t('nome')}</label>
                        <input placeholder={t('nome')} type="text" {...register('name', { required: true })} />
                    </div>
                    
                    <div className={style.input_group}>
                        <label>{t('pass1')}</label>
                        <div className={style.password_field}>
                            <input placeholder={t('pass1')} type={passwordVisible ? "text" : "password"} {...register('password1', { required: true, minLength: 8 })} />
                            <button type="button" onClick={togglePasswordVisibility} className={style.toggleButton}>
                                {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={style.input_group}>
                        <label>{t('pass2')}</label>
                        <div className={style.password_field}>
                            <input placeholder={t('pass2')} type={passwordVisible ? "text" : "password"} {...register('password2', { required: true })} />
                            <button type="button" onClick={togglePasswordVisibility} className={style.toggleButton}>
                                {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={style.checkbox_group}>
                        <label>
                            <input type="checkbox" {...register('vendedor')} />
                            <span>Você é vendedor?</span>
                        </label>
                    </div>
                    
                    <div className={style.form_actions}>
                        <a href="/login" className={style.login_link}>
                            <IoLogInOutline /> {t('notaccount2')} {t('login')}
                        </a>
                        <button type="submit" className={style.register_button}>
                            <IoPersonAddOutline /> {t('register')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;