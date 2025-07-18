import { useEffect, useState } from 'react';
import style from '../Pages/Modals/SCSS/Modal_address.module.scss';
import Modal_data from './Modals/Modal_data';
import Modal_address from './Modals/Modal_address';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FakestoreCheck,
    fakestoreGetAddress,
    FakestoreLogout
} from '../Services/fakestore';
import showToast from '../utils/toast';

export default function Profile() {
    const [modalOpenAddress, setModalOpenAddress] = useState(false);
    const [modalOpenData, setModalOpenData] = useState(false);
    const [users, setUsers] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [addressLogin, setAddressLogin] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()

    const logout = () => {
        FakestoreLogout()
        sessionStorage.setItem('User', 'comprador')
        navigate('/')
        showToast("info", "Deslogando...")
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

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            if (response === undefined) {
                navigate('/')
            }
            setUsers(response);
        };
        checklogin();
    }, [refresh]);

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
                            <h1 className={style.profileTitle}>Perfil de {users.user.username}</h1>
                        </div>
                        <table className={style.productTable}>
                            <thead>
                                <tr>
                                    <th>Informações</th>
                                    <th>Dados</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Nome Completo</td>
                                    <td>{users.user.name}</td>
                                </tr>
                                <tr>
                                    <td>Função</td>
                                    <td>{users.user.role}</td>
                                </tr>
                                <tr>
                                    <td>Data Nascimento</td>
                                    <td>{dateFormated(users.user.data_nascimento)}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{users.user.email}</td>
                                </tr>
                                <tr>
                                    <td>Telefone</td>
                                    <td>{users.user.telefone.replace(/\D/g, '')
                                        .replace(/(\d{2})(\d)/, '($1) $2')
                                        .replace(/(\d{5})(\d)/, '$1-$2')
                                        .replace(/(-\d{4})\d+?$/, '$1')}</td>
                                </tr>
                                {addressLogin ?
                                    <>
                                        <tr>
                                            <td>Endereço ativo</td>
                                            <td>{addressLogin.Complemento}</td>
                                        </tr>
                                        <tr>
                                            <td>CEP</td>
                                            <td>{addressLogin.CEP.replace(/\D/g, '')
                                                .replace(/(\d{5})(\d)/, '$1-$2')
                                                .replace(/(-\d{3})\d+?$/, '$1')}</td>
                                        </tr>
                                        <tr>
                                            <td>Bairro</td>
                                            <td>{addressLogin.Bairro}</td>
                                        </tr>
                                        <tr>
                                            <td>Estado</td>
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
                            <button className={style.actionButton} onClick={(e) => { handleAddress(e); }}>Criar Endereço</button>
                            <button className={style.actionButton} onClick={(e) => { handleData(e); }}>Atualizar</button>
                            <button onClick={logout} className={style.actionButton}>{t('logout')}</button>
                            <button className={style.actionButton} onClick={(e) => { handleClose(e); }}>Fechar</button>
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
                <>{navigate('/')}</>
            )}
        </div>
    );
}
