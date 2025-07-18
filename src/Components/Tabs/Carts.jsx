import { useEffect, useState } from "react";
import { FakestoreCart } from "../../Services/fakestore";
import style from '../../Pages/SCSS/Admin.module.scss'

export default function Carts() {
    const [carts, setCarts] = useState([])
    useEffect(() => {
        const getProducts = async () => {
            const response = await FakestoreCart();
            setCarts(response);
        };
        getProducts()
    }, [])
    return (
        <div className={style.container_carts}>
            <h1>Carrinhos do sistema</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Products</th>
                        <th>Quantidade</th>
                        <th>Valor Total</th>
                        <th>Status carrinho</th>
                    </tr>
                </thead>
                <tbody>
                    {carts.map(cart => (
                        <tr key={cart._id}>
                            <td>{cart.user.username}</td>
                            <td>
                                {cart.product.map(prod => prod.title.title_pt).join(" | ")}
                            </td>
                            <td>{cart.product.length}</td>
                            <td>R$ {cart.totalprice}</td>
                            <td>{cart.status ? "Finalizado" : "Aberto"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}