import { useEffect, useState } from "react";
import { FakestoreCat } from "../../Services/fakestore";
import style from '../../Pages/SCSS/Admin.module.scss'

export default function Categorys() {
    const [categorys, setCategory] = useState([])
    useEffect(() => {
        const getProducts = async () => {
            const response = await FakestoreCat();
            setCategory(response);
        };
        getProducts()
    }, [])
    return (
        <div className={style.container_categorys}>
            <h1>Categorias do sistema</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {categorys.map(category => (
                        <tr key={category}>
                            <td>{category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}