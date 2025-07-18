import { useEffect, useState } from "react";
import style from '../../Pages/SCSS/Admin.module.scss'
import showToast from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import {
    FakestoreEditAcess,
    FakestoreEditRole,
    FakestoreUsers
} from "../../Services/fakestore";

export default function Users() {
    const [users, setUsers] = useState([])
    const [role, setRole] = useState([])
    const [acess, setAcess] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            const response = await FakestoreUsers();
            if (response.status === 403) {
                showToast('error', response.msg)
                navigate('/')
            }
            setUsers(response);
        };
        getProducts()
    }, [role, acess])
    return (
        <div className={style.container_users}>
            <h1>Usuários do sistema</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>username</th>
                        <th>Situação</th>
                        <th>Funções</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>
                                <select
                                    value={user.block}
                                    onChange={(e) => setAcess(FakestoreEditAcess(e.target.value, user._id))}
                                >
                                    <option value={false}>Acesso</option>
                                    <option value={true}>Bloqueado</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => setRole(FakestoreEditRole(e.target.value, user._id))}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="gerente">Gerente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="comprador">Comprador</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}