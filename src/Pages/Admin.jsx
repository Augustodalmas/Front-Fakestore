import React, { useEffect, useState } from "react";
import style from "./SCSS/admin.module.scss";
import Cookies from "js-cookie";
import Users from "../Components/Tabs/Users";
import Products from "../Components/Tabs/Products";
import Categorys from "../Components/Tabs/Categorys";
import Carts from "../Components/Tabs/Carts";
import { useTranslation } from "react-i18next";

const tabs = [
    { key: "usuários", label: "Usuários" },
    { key: "produtos", label: "Produtos" },
    { key: "categorias", label: "Categorias" },
    { key: "carrinhos", label: "Carrinhos" }
];

const TabContent = ({ activeTab }) => {
    switch (activeTab) {
        case "usuários":
            return <Users />;
        case "produtos":
            return <Products />;
        case "categorias":
            return <Categorys />;
        case "carrinhos":
            return <Carts />;
        default:
            return <div>Bem-vindo ao Menu Administrador!</div>;
    }
};

export default function Pageadmin() {
    const [language, setLanguage] = useState(null);
    const [activeTab, setActiveTab] = useState("usuários");
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const lang = Cookies.get("lang") || "en-US";
        i18n.changeLanguage(lang);
        setLanguage(lang);
    }, [i18n]);

    return (
        <div className={style.container_admin}>
            <aside className={style.nav_left}>
                <h1>Menu Administrador</h1>
                <nav>
                    {tabs.map((tab) => (
                        <h3
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={activeTab === tab.key ? style.active : ""}
                        >
                            {tab.label}
                        </h3>
                    ))}
                </nav>
                <a href="/">Voltar</a>
            </aside>
            <main className={style.container_content}>
                <TabContent activeTab={activeTab} />
            </main>
        </div>
    );
}