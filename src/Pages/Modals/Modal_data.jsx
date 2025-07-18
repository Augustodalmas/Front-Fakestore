import { useEffect, useState } from 'react';
import style from '../../Pages/Modals/SCSS/Modal_data.module.scss'
import { useForm } from 'react-hook-form';
import {
    FakestoreCheck,
    FakestoreEditUser,
    fakestoreGetAddressByUser
} from '../../Services/fakestore';

export default function Modal_data({ isOpen, onClose, reference }) {
    if (!isOpen) return null;
    const [users, setUsers] = useState(null)
    const [address, setAddress] = useState(null)
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const checklogin = async () => {
            const response = await FakestoreCheck();
            setUsers(response)
        };
        checklogin()
    }, []);

    useEffect(() => {
        if (users) {
            const addressByUser = async () => {
                const response = await fakestoreGetAddressByUser(users.user._id);
                setAddress(response)
            };
            addressByUser()
        }
    }, [users]);

    const onSubmit = async (data) => {
        const dataUser = ({
            name: data.name,
            email: data.email,
            data_nascimento: data.date,
            telefone: data.telefone,
            favorite_address: data.favorite_address,
        })
        const response = await FakestoreEditUser(dataUser, reference)
        onClose()
    }
    return (
        <div className={style.modal}>
            <div className={style.container_modal}>
                {users && address ?
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <table className={style.body_profile}>
                            <tbody>
                                <tr>
                                    <td><label htmlFor='name'>Nome Completo</label></td>
                                    <td><input type='text' name='name' defaultValue={users.user.name} {...register('name')} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='Email'>Email</label></td>
                                    <td><input type='text' name='Email' defaultValue={users.user.email} {...register('email')} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='date'>Data Nascimento</label></td>
                                    <td><input type='date' name='date' defaultValue={users.user.data_nascimento.slice(0, 10)} {...register('date')} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='telefone'>Telefone</label></td>
                                    <td><input type='text' name='telefone' defaultValue={users.user.telefone} {...register('telefone')} /></td>
                                </tr>
                                <tr>
                                    <td>endereço</td>
                                    <td><select name='categoy' id={style.category} defaultValue={users?.user.favorite_address} {...register('favorite_address')}>
                                        {address.map(address => (
                                            <option key={address._id} value={address._id}>
                                                {address.Complemento}
                                            </option>
                                        ))}
                                    </select></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='address'></label></td>
                                    <td><button type='submit'>Atualizar</button><button onClick={onClose}>Fechar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                    :
                    <></>
                }
            </div>
        </div>
    )
}