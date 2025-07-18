import { useState } from 'react';
import style from '../../Pages/Modals/SCSS/ModalDelete.module.scss'
import { useForm } from 'react-hook-form';
import {
    buscarCEP,
    fakestoreAddress
} from '../../Services/fakestore';

export default function Modal_address({ isOpen, onClose, reference }) {
    if (!isOpen) return null;
    const [address, setAddress] = useState(null)
    const { register, handleSubmit } = useForm();

    const buscarCEPS = async (cep) => {
        const response = await buscarCEP(cep)
        setAddress(response)
    }

    const createAddress = async (data) => {
        const dataAndress = ({
            user: reference,
            cep: data.cep,
            bairro: data.bairro,
            estado: data.estado,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            uf: data.uf,
            nome: data.nome
        })
        const response = await fakestoreAddress(dataAndress)
        onClose()
    }

    return (
        <div className={style.modal}>
            <div className={style.container_modal}>
                <form onSubmit={handleSubmit(buscarCEPS)}>
                    <div className={style.cep_search}>
                        <input placeholder='CEP somente números   ' type='text' {...register('cep')} required />
                        <button>Enviar CEP</button>
                        <button onClick={onClose}>Fechar</button>
                    </div>
                </form>
                {
                    address && (
                        <form onSubmit={handleSubmit(createAddress)}>
                            <table className={style.body_profile}>
                                <tbody>
                                    <tr>
                                        <td><label htmlFor='cep'>CEP</label></td>
                                        <td><input type='text' name='cep' defaultValue={address.cep} {...register('cep2')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='bairro'>Bairro</label></td>
                                        <td><input type='text' name='bairro' defaultValue={address.bairro} {...register('bairro')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='estado'>Estado</label></td>
                                        <td><input type='text' name='estado' defaultValue={address.estado} {...register('estado')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='uf'>UF</label></td>
                                        <td><input type='text' name='uf' defaultValue={address.uf} {...register('uf')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='localidade'>Localidade</label></td>
                                        <td><input type='text' name='localidade' defaultValue={address.localidade} {...register('logradouro')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='complemento'>Complemento</label></td>
                                        <td><input type='text' name='complemento' defaultValue={address.complemento} {...register('complemento')} required /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='numero'>Número</label></td>
                                        <td><input type='text' name='numero' defaultValue={address.numero} {...register('numero')} /></td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor='address'></label></td>
                                        <td><button type='submit'>Criar</button><button onClick={onClose}>Fechar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    )
                }
            </div >
        </div >
    )
}