import { useState, useEffect } from "react"
import style from './SCSS/Main.module.scss'
import showToast from '../utils/toast'
import Cookies from 'js-cookie'
import Product from '../Components/Product'
import Loading from '../Components/Loading'
import ProductTable from '../Components/ProductLine';
import Modal from './Modals/Modal'
import Modal_update from './Modals/Modal_update';
import Modal_delete from './Modals/Modal_delete';
import Modal_cart from './Modals/Modal_cart';
import { useTranslation } from 'react-i18next'
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import {
    sortProd,
    filterCategory,
    searchProduct
} from '../utils/utils'
import {
    FakestoreALL,
    FakestoreCat,
    FakestoreByCat,
    FakestoreSingle,
    FakestoreSort,
    FakestoreCheck,
    FakestoreLogout,
    FakestoreCartCreate,
} from '../Services/fakestore'

export default function Main() {
    {/*Const's*/ }
    const [arrayProducts, setProducts] = useState([])
    const [categories, setCategory] = useState([]);
    const [viewlist, setViewList] = useState("content_product");
    const [icon, setIcon] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(true)
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false)
    const [modalOpenCart, setModalOpenCart] = useState(false)
    const [idProductModal, setIdModal] = useState([])
    const [username, setUser] = useState(null)
    const [selectProduct, setSelectProduct] = useState(null)
    const [selectProductId, setSelectProductId] = useState(null)
    const [removeLoading, setLoading] = useState(false)
    const [language, setLanguage] = useState(null)
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const { t, i18n } = useTranslation()

    const itemsPerPage = 6

    const alternarClasse = () => {
        setViewList(viewlist === "content_product" ? "content_table" : "content_product");
        setIcon(!icon)
        Cookies.set('view', viewlist)
    };

    const filterLanguage = (lang) => {
        let langToast = ""
        setLoading(false);
        i18n.changeLanguage(lang)
        setTimeout(() => { setLoading(true) }, 1500)
        Cookies.set("lang", lang)
        setLanguage(lang)
        switch (lang) {
            case 'pt-BR':
                langToast = 'Português';
                break;
            case 'en-US':
                langToast = 'English';
                break;
            case 'es':
                langToast = 'Español';
                break;
            default:
                langToast = 'Português';
        }
        showToast('info', `${t('toasty_lang')}${langToast}`)
    }

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setIdModal(id)
        setModalOpenDelete(true)
    };

    const handleUpdate = (e, id) => {
        e.stopPropagation();
        setIdModal(id)
        Cookies.set("update", 1)
        setModalOpenUpdate(true)
    };

    const handleCart = (e) => {
        e.stopPropagation();
        setModalOpenCart(true)
    };

    const handleNextPage = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const addCart = async (e, data, quantity) => {
        e.stopPropagation();
        try {
            const dataProduct = ({
                product: data,
                quantity: quantity
            })
            const result = await FakestoreCartCreate(dataProduct);
            showToast('success', t('addCart'))
        } catch (error) {
            throw (error);
        }
    };

    {/*Function's*/ }
    function openModal(product) {
        setSelectProductId(product);
        setIsOpen(false)
    }

    {/*Effect's*/ }
    useEffect(() => {
        const getProducts = async (page) => {
            const response = await FakestoreALL(page);
            setCurrentPage(response.page)
            setPageCount(response.pageCount)
            setProducts(response.products);
            setTimeout(() => { setLoading(true) }, 1500)
        };
        getProducts(currentPage)
    }, [language, modalOpenUpdate, modalOpenDelete, currentPage])

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            setUser(response)
            if (response.user.role === undefined) {
            } else {
                sessionStorage.setItem('User', response.user.role)
            }
        };
        checklogin()
    }, []);

    useEffect(() => {
        const getCategories = async () => {
            const response = await FakestoreCat(); // Adiciona as categorias
            setCategory(response);
        };
        getCategories();
    }, [language]);

    useEffect(() => {
        const getSingleProduct = async (product) => {
            const response = await FakestoreSingle(product); // Recebe o ID e envia para o FakestoreAPI
            if (response) {
                setSelectProduct(response);
            }
        };
        if (selectProductId) {
            getSingleProduct(selectProductId);
        }
    }, [selectProductId, language]); // Quando houver alteração no selectProductID, ele faz requisição do mesmo

    useEffect(() => {
        if (Cookies.get("lang")) {
            const language = Cookies.get('lang')
            i18n.changeLanguage(language)
            setLanguage(language)
        } else {
            i18n.changeLanguage('en-US')
            setLanguage('en-US')
        }
    }, [i18n])

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div>
            <div className={style.cabecalho}>
                <div className={style.esquerda}>
                    <img src="./imagens/Logo.svg" alt="BearByte" />
                </div>
                <div className={style.direita}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown();
                        }}>{t('actions')}</a>
                        {isDropdownOpen && (
                            <ul className={style.dropdown}>
                                <li><a href="/create-product">{t('createProduct')}</a></li>
                                <li><a href="/create-category">{t('createCategory')}</a></li>
                                <li><a href="/history">{t('history')}</a></li>
                                <li><a href='/admin'>admin</a></li>
                            </ul>
                        )}
                    </div>
                    <a href="#">{t('about')}</a>
                    {username ? (
                        <a className={style.button} href="/profile">{t('profile')}</a>
                    ) : (
                        <a className={style.button} href="/login">{t('profile')}</a>
                    )}
                    <div className={style.bandeiras}>
                        <img src="https://flagcdn.com/w40/br.png" alt="Português" onClick={() => filterLanguage("pt-BR")} />
                        <img src="https://flagcdn.com/w40/us.png" alt="English" onClick={() => filterLanguage("en-US")} />
                        <img src="https://flagcdn.com/w40/es.png" alt="Español" onClick={() => filterLanguage("es")} />
                    </div>
                    <div onClick={handleCart} className={style.carrinho}>
                        <a href="#"><img src="./imagens/carrinho.png" alt="Carrinho" /></a>
                    </div>
                </div>
            </div>
            <div className={style.menu}>
                <div>
                    <div className={style.pesquisar}>
                        <input onChange={(event) => searchProduct(event, FakestoreALL, setProducts, currentPage)} type="search" name="search" id="search" placeholder={t('search')} />
                        <a href="#"><img src="./imagens/lupa.png" alt="lupa" /></a>
                    </div>
                </div>
                <div>
                    <div>
                        <select onChange={(event) => filterCategory(event, setLoading, setProducts, FakestoreByCat, FakestoreALL, currentPage)} name='categoy' id={style.category}>
                            <option value="Default" key={t('searchCategory')}>{t('searchCategory')}</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        <select onChange={(event) => sortProd(event, setLoading, setProducts, arrayProducts, FakestoreSort)} name="sort" id={style.category} >
                            {/* <option value="Default">{t('sort')}</option> */}
                            <option value="desc">{t('desc')}</option>
                            <option value="asc">{t('asc')}</option>
                            <option value="upPrice">{t('upPrice')}</option>
                            <option value="downPrice">{t('downPrice')}</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={style.container_products}>
                <div className={style.head}>
                    <h2>{t('product')}</h2>
                </div>
                <div className={style.line}>
                    <div className={style.line_1}></div>
                </div>
            </div>
            <div className={style[viewlist]}>
                {arrayProducts.map(product => (
                    viewlist === "content_product" ? (
                        <a key={product.id} onClick={(e) => {
                            if (!e.target.closest('.no-modal')) {
                                openModal(product.id);
                            }
                        }}>
                            <Product
                                id={product.id}
                                name={product.title}
                                url={product.imagem}
                                imagensSecundarias={[
                                    `http://localhost:3000/img/${product.imagem[1]}`,
                                    "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
                                    "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
                                    "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
                                ]}
                                categoria={product.category}
                                rating={product.rating.rate}
                                avaliacao={product.rating.count}
                                valor={product.price}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                                onCart={addCart}
                            />
                        </a>
                    ) : (
                        <a key={product.id} onClick={() => openModal(product.id)}>
                            <ProductTable
                                key={product.id}
                                id={product.id}
                                name={product.title}
                                url={product.imagem}
                                categoria={product.category}
                                rating={product.rating.rate}
                                avaliacao={product.rating.count}
                                valor={product.price}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                                onCart={addCart}
                            />
                        </a>
                    )
                ))}
                <Modal_cart isOpen={modalOpenCart} onClose={() => setModalOpenCart(false)} />
                <Modal_delete isOpen={modalOpenDelete} onClose={() => setModalOpenDelete(false)} reference={idProductModal} />
                <Modal_update isOpen={modalOpenUpdate} onClose={() => setModalOpenUpdate(false)} reference={idProductModal} />
                <Modal IsOpen={!modalIsOpen} setModalOpen={() => setIsOpen(true)} product={selectProduct} />
                {!removeLoading && <Loading />}
            </div>
            <div className={style.containerArray}>
                <button className={style.arrow} onClick={handlePreviousPage}><IoIosArrowBack /></button>
                {Array.from({ length: pageCount }, (_, index) => (
                    <button disabled
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? style.activeButton : style.arrayButton}
                    >
                        {index + 1}
                    </button>
                ))}
                <button className={style.arrow} onClick={handleNextPage}><IoIosArrowForward /></button>
            </div>
            <div className={style.footer}>
                <h1>{t('footer')}</h1>
            </div>
        </div>

    )
}