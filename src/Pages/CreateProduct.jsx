import { useEffect, useState } from "react";
import style from './SCSS/CreateProduct.module.scss';
import showToast from '../utils/toast'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import {
    FakestoreAddProduct,
    FakestoreCat
} from "../Services/fakestore";

const CreateProduct = () => {
    const [categories, setCategory] = useState([]);
    const [lang, setLang] = useState('pt');
    const [inputs, setInputs] = useState({
        pt: { title: '', description: '' },
        en: { title: '', description: '' },
        es: { title: '', description: '' }
    });
    const [imgs, SetImg] = useState([]);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()

    const handleChangeTitle = (e) => {
        setInputs({
            ...inputs,
            [lang]: { ...inputs[lang], title: e.target.value }
        });
    };

    const handleChangeDescription = (e) => {
        setInputs({
            ...inputs,
            [lang]: { ...inputs[lang], description: e.target.value }
        });
    };

    const currentLanguage = () => {
        const lang = Cookies.get('lang');
        i18n.changeLanguage(lang);
    };

    const convertIMG = (e) => {
        const files = Array.from(e.target.files);
        const fileReaders = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                SetImg((prevImgs) => [...(prevImgs || []), reader.result]);
            };
            reader.readAsDataURL(file);
            fileReaders.push(reader);
        });
    };

    const voltar = () => navigate("/");

    const onSubmit = async (data) => {
        try {
            const dataProduct = new FormData();
            dataProduct.append("title[title_pt]", inputs.pt.title);
            dataProduct.append("title[title_en]", inputs.en.title);
            dataProduct.append("title[title_es]", inputs.es.title);
            dataProduct.append("description[description_pt]", inputs.pt.description);
            dataProduct.append("description[description_en]", inputs.en.description);
            dataProduct.append("description[description_es]", inputs.es.description);
            dataProduct.append("price", data.price);
            Array.from(data.imagem).forEach((file) => {
                dataProduct.append("imagem", file);
            });
            dataProduct.append("category", data.category);

            const result = await FakestoreAddProduct(dataProduct);

            if (result.status === 201) {
                showToast('success', t('toasty_cre'))
                navigate("/");
            } else if (result.status === 403) {
                showToast('error', t('permissionError'))
                navigate("/");
            } else {
                showToast('error', t('formError'))
            }
        } catch (error) {
            console.error(error);
            showToast('error', t('formError'))
        }
    };

    useEffect(() => {
        const getCategories = async () => {
            const response = await FakestoreCat();
            setCategory(response);
        };
        getCategories();
        currentLanguage();
    }, []);

    return (
        <div className={style.container}>
            <div className={style.filho}>
                <h1>{t('add')}</h1>
                <hr />
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className={style.fields}>
                        <div>
                            <div>
                                <button type="button" onClick={() => setLang('pt')}>PT</button>
                                <button type="button" onClick={() => setLang('en')}>EN</button>
                                <button type="button" onClick={() => setLang('es')}>ES</button>
                            </div>

                            <label>{t('name')} ({lang.toUpperCase()})</label>
                            <input
                                className={style.campos}
                                placeholder={t('placeName')}
                                value={inputs[lang].title}
                                onChange={handleChangeTitle}
                                required
                            />

                            <label>{t('description')} ({lang.toUpperCase()})</label>
                            <textarea
                                className={style.description}
                                placeholder={t('placeDescription')}
                                value={inputs[lang].description}
                                onChange={handleChangeDescription}
                                required
                            />
                        </div>

                        <label>{t('price')}</label>
                        <input
                            className={style.campos}
                            placeholder={t('placePrice')}
                            type="number"
                            step="0.01"
                            {...register("price", { required: true })}
                        />

                        <label>{t('category')}</label>
                        <select name='category' id={style.category} {...register('category')}>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <label>{t('image')}</label>
                        <input
                            onChange={convertIMG}
                            type='file'
                            name="imagem"
                            {...register("imagem")}
                            multiple
                        />

                        {imgs?.map((img, i) => (
                            <img key={i} src={img} alt={`preview ${i}`} className={style.previewImg} />
                        ))}

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

export default CreateProduct;
