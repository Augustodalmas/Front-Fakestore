import { useEffect, useState } from 'react';
import style from '../Pages/Modals/SCSS/Modal_address.module.scss';
import Modal_data from './Modals/Modal_data';
import Modal_address from './Modals/Modal_address';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FakestoreCheck,
    fakestoreGetAddress,
    FakestoreLogout
} from '../Services/fakestore';
import showToast from '../utils/toast';
import { IoPersonCircleOutline, IoHomeOutline, IoLogOutOutline, IoCloseOutline, IoCreateOutline } from "react-icons/io5";

export default function Profile() {
    const [modalOpenAddress, setModalOpenAddress] = useState(false);
    const [modalOpenData, setModalOpenData] = useState(false);
    const [users, setUsers] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [addressLogin, setAddressLogin] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()

    const currentLanguage = () => {
        const lang = Cookies.get('lang') || 'pt-BR'
        console.log('Idioma carregado dos cookies:', lang)
        i18n.changeLanguage(lang)
        return lang
    }

    const logout = () => {
        FakestoreLogout()
        sessionStorage.setItem('User', 'comprador')
        navigate('/')
        showToast("info", t("logging_out"))
    }

    const handleAddress = (e) => {
        e.stopPropagation();
        setModalOpenAddress(true);
    };

    const handleData = (e) => {
        e.stopPropagation();
        setModalOpenData(true);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        navigate('/')
    };

    const dateFormated = (data) => {
        const dateString = data?.slice(0, -1);
        if (!dateString) {
            return null;
        }
        const date = new Date(dateString);
        if (isNaN(date)) {
            return null;
        }
        return date.toLocaleDateString('pt-BR');
    };

    // Efeito para carregar o idioma assim que o componente for montado
    useEffect(() => {
        const lang = currentLanguage()
        console.log('Idioma definido no carregamento inicial:', lang)
    }, []);

    // Efeito para verificar o login e atualizar quando refresh mudar
    useEffect(() => {
        const checklogin = async () => {
            try {
                const response = await FakestoreCheck();
                if (response === undefined) {
                    navigate('/')
                    return
                }
                setUsers(response);
            } catch (error) {
                console.error('Erro ao verificar login:', error)
                navigate('/')
            }
        };
        checklogin();
    }, [refresh, navigate]);

    useEffect(() => {
        if (users !== null) {
            const addressGet = async () => {
                const response = await fakestoreGetAddress(users.user.favorite_address);
                setAddressLogin(response)
            };
            addressGet()
        }
    }, [users]);

    return (
        <div className={style.container_profile}>
            {users ? (
                <>
                    <div className={style.header_profile}>
                        <div className={style.container_logo}>
                            <img src="./imagens/logo-bearByteInt.svg" alt="BearByte" />
                            <h1 className={style.profileTitle}><IoPersonCircleOutline /> {t('profile_title')} {users.user.username}</h1>
                        </div>
                        <table className={style.productTable}>
                            <thead>
                                <tr>
                                    <th>{t('information')}</th>
                                    <th>{t('data')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t('full_name')}</td>
                                    <td>{users.user.name}</td>
                                </tr>
                                <tr>
                                    <td>{t('role')}</td>
                                    <td>{users.user.role}</td>
                                </tr>
                                <tr>
                                    <td>{t('birth_date')}</td>
                                    <td>{dateFormated(users.user.data_nascimento)}</td>
                                </tr>
                                <tr>
                                    <td>{t('email')}</td>
                                    <td>{users.user.email}</td>
                                </tr>
                                <tr>
                                    <td>{t('phone')}</td>
                                    <td>{users.user.telefone.replace(/\D/g, '')
                                        .replace(/(\d{2})(\d)/, '($1) $2')
                                        .replace(/(\d{5})(\d)/, '$1-$2')
                                        .replace(/(-\d{4})\d+?$/, '$1')}</td>
                                </tr>
                                {addressLogin ?
                                    <>
                                        <tr>
                                            <td>{t('active_address')}</td>
                                            <td>{addressLogin.Complemento}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('zip_code')}</td>
                                            <td>{addressLogin.CEP.replace(/\D/g, '')
                                                .replace(/(\d{5})(\d)/, '$1-$2')
                                                .replace(/(-\d{3})\d+?$/, '$1')}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('neighborhood')}</td>
                                            <td>{addressLogin.Bairro}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('state')}</td>
                                            <td>{addressLogin.Estado}</td>
                                        </tr>
                                        <tr>
                                            <td>UF</td>
                                            <td>{addressLogin.UF}</td>
                                        </tr>
                                    </>
                                    :
                                    <></>
                                }
                            </tbody>
                        </table>
                        <div className={style.buttonContainer}>
                            <button className={style.actionButton} onClick={(e) => { handleAddress(e); }}>
                                <IoHomeOutline /> {t('create_address')}
                            </button>
                            <button className={style.actionButton} onClick={(e) => { handleData(e); }}>
                                <IoCreateOutline /> {t('update_profile')}
                            </button>
                            <button onClick={logout} className={style.actionButton}>
                                <IoLogOutOutline /> {t('logout')}
                            </button>
                            <button className={style.actionButton} onClick={(e) => { handleClose(e); }}>
                                <IoCloseOutline /> {t('close')}
                            </button>
                        </div>
                    </div>
                    <Modal_address
                        isOpen={modalOpenAddress}
                        onClose={() => setModalOpenAddress(false)}
                        reference={users.user._id}
                    />
                    <Modal_data
                        isOpen={modalOpenData}
                        onClose={() => (setModalOpenData(false), setRefresh(!refresh))}
                        reference={users.user._id}
                    />
                </>
            ) : (
                <div className={style.loading}>{t('loading')}</div>
            )}
        </div>
    );
}
