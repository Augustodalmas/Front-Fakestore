import { useEffect, useState } from "react";
import { FakestoreALL } from "../../Services/fakestore";
import style from '../../Pages/SCSS/Admin.module.scss'

export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getProducts = async () => {
            const response = await FakestoreALL();
            setProducts(response.products);
        };
        getProducts()
    }, [])
    return (
        <div className={style.container_products}>
            <h1>Produtos do sistema</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>price</th>
                        <th>Category</th>
                        <th>Rate</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>R$ {product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.rating.rate}</td>
                            <td>{product.rating.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}