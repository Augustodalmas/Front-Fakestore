import React, { useEffect, useState } from "react";
import style from "./SCSS/ModalDelete.module.scss";
import showToast from "../../utils/toast";
import { useTranslation } from "react-i18next";
import {
    FakestoreCheck,
    FakestoreDelete,
    FakestoreSingle
} from '../../Services/fakestore';

const Modal_delete = ({ isOpen, onClose, reference }) => {
    if (!isOpen) return null;
    const [product, setProduct] = useState([]);
    const [username, setUser] = useState(null);
    const { t } = useTranslation();

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            const response = await FakestoreDelete(id);
            if (response.status === 403) {
                showToast('error', response.msg);
                onClose();
            } else {
                showToast('success', response.msg);
                onClose();
            }
        } catch (error) {
            throw (error);
        }
    };

    const closeModal = (e, onClose) => {
        e.stopPropagation();
        onClose();
    };

    useEffect(() => {
        const getProduct = async () => {
            const response = await FakestoreSingle(reference);
            setProduct(response);
        };
        getProduct();
    }, [reference]);

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            setUser(response);
        };
        checklogin();
    }, []);

    return (
        <div className={style.modal}>
            <div className={style.container_modal}>
                <div className={style.header}>
                    <h2>{t('deleteMSG')} <strong>{product.title}</strong>?</h2>
                </div>
                <div className={style.container_btt}>
                    <button
                        className={`${style.button} ${style.close}`}
                        onClick={(e) => closeModal(e, onClose)}
                    >
                        {t('back')}
                    </button>
                    <button
                        className={`${style.button} ${style.delete}`}
                        onClick={(e) => handleDelete(e, reference)}
                    >
                        {t('dlt')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal_delete;
