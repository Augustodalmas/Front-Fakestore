import { useState, useEffect } from "react";
import style from "./SCSS/History.module.scss";
import Cookies from "js-cookie";
import Modal_cart from "./Modals/Modal_cart";
import { useTranslation } from "react-i18next";
import {
    FakestoreCartByUser,
    FakestoreCheck,
    FakestoreUsers
} from "../Services/fakestore";
import { IoEyeOutline, IoArrowBackOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

export default function History() {
    const [users, setUsers] = useState([]);
    const [userLogin, setUserLogin] = useState(null);
    const [cartsUser, setCartsUser] = useState(null);
    const [modalOpenCart, setModalOpenCart] = useState(false);
    const [idCart, setIdCart] = useState(null);
    const { t, i18n } = useTranslation();

    const handleCart = (e, id) => {
        e.stopPropagation();
        setIdCart(id);
        setModalOpenCart(true);
    };

    const currentLanguage = () => {
        const lang = Cookies.get("lang");
        i18n.changeLanguage(lang);
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
        currentLanguage();
    }, []);

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            setUserLogin(response);
        };
        checklogin();
    }, []);

    useEffect(() => {
        const cartsUser = async () => {
            const response = await FakestoreCartByUser(userLogin.user._id);
            setCartsUser(response);
            console.log(response);

        };
        cartsUser();
    }, [users]);

    useEffect(() => {
        if (users) {
            const getUsers = async () => {
                const response = await FakestoreUsers();
                setUsers(response);
            };
            getUsers();
        }
    }, []);

    return (
        <div className={style.container}>
            {/* <img src="./imagens/logo-bearByte.svg" alt="BearByte" /> */}
            {userLogin && cartsUser ? (
                <div className={style.historyBox}>
                    <h1 className={style.title}><IoTimeOutline /> {t("history_by")} {userLogin.user.username}</h1>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Id da Compra</th>
                                <th>Data Compra</th>
                                <th>Preço da compra</th>
                                <th>Status</th>
                                <th>Ver itens</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartsUser.map(cart => (
                                <tr key={cart._id}>
                                    <td>{cart._id}</td>
                                    <td>{dateFormated(cart.data_fechamento)}</td>
                                    <td>R$ {cart.totalprice}</td>
                                    <td>{cart.status ? <IoCheckmarkCircleOutline className={style.statusIcon} /> : <IoCloseCircleOutline className={style.statusIcon} />}</td>
                                    <td>
                                        <button className={style.button} onClick={(e) => handleCart(e, cart._id)}>
                                            <IoEyeOutline /> {t("visualize")}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <a href="/" className={style.backLink}><IoArrowBackOutline /> {t("back")}</a>
                    <Modal_cart isOpen={modalOpenCart} onClose={() => setModalOpenCart(false)} reference={idCart} />
                </div>
            ) : (
                <p className={style.loading}>{t("loading")}</p>
            )}
        </div>
    );
}