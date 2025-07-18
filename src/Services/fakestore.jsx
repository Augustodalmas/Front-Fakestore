import showToast from '../utils/toast'

const URL = 'http://localhost:3000/products/'
const URL_user = 'http://localhost:3000/user/'
const URL_cart = 'http://localhost:3000/cart/'
const URL_address = 'http://localhost:3000/address/'
const URL_cep = 'https://viacep.com.br/ws/'
const token = localStorage.getItem('JsonWebToken')

export async function FakestoreALL(page) {
    try {
        const response = await fetch(URL + `?p=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreCat() {
    try {
        const response = await fetch(URL + `categories/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreByCat(category) {
    try {
        const response = await fetch(URL + `category/${category}`, { credentials: 'include' })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreSingle(id) {
    try {
        const response = await fetch(URL + `${id}`, { credentials: 'include' })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreSort(sort) {
    try {
        const response = await fetch(URL + `?sort=${sort}`)
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreAddProduct(data) {
    try {
        const response = await fetch(URL, {
            method: "POST",
            credentials: 'include',
            body: data,
        })
        if (!response.ok) {
            if (response.status === 403) {
                console.log("erro de permissão")
            } else {
                console.log("Erro ao adicionar produto", response)
            }
        }
        return response;
    } catch (error) {
        throw (error)
    }
}

export async function FakestoreAddCategory(data) {
    try {
        const response = await fetch(URL + `categories/`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name_pt: data.name_pt,
                name_en: data.name_en,
                name_es: data.name_es,
            }),
        })
        if (!response.ok) {
            if (response.status === 403) {
                console.log("erro de permissão")
            } else {
                console.log("Erro ao adicionar categoria", response)
            }
        }
        return await response.json();
    } catch (error) {
        throw (error)
    }
}

export async function FakestoreDelete(id) {
    try {
        const response = await fetch(URL + `${id}`, {
            credentials: 'include',
            method: 'DELETE',
        })
        if (!response.ok) {
            if (response.status === 403) {
                console.log("erro de permissão")
            }
        }
        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function FakestoreUpdate(data, id) {
    try {
        const response = await fetch(URL + `${id}`, {
            credentials: 'include',
            method: "PUT",
            body: data,
        })
        if (!response.ok) {
            if (response.status === 403) {
                console.log("erro de permissão")
            } else {
                console.log("Erro ao atualizar produto", response)
            }
        }
        return await response.json();
    } catch (error) {
        throw (error)
    }
}

export async function FakestoreRate(data, iduser, idproduct) {
    try {
        const response = await fetch(URL + `${iduser}/${idproduct}`, {
            credentials: 'include',
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            console.log("Erro ao atualizar produto", response)
        }
        return await response.json();
    } catch (error) {
        throw (error)
    }
}

export async function FakestoreUsers() {
    try {
        const response = await fetch(URL_user, {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreLogin(data) {
    try {
        const response = await fetch(URL_user + 'login', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: data.username,
                password1: data.password1,
            }),
        })
        if (response.status === 403 && data.username) {
            const logdata = await response.json()
            showToast('info', logdata.msg)
        }
        const data2 = await response.json()
        localStorage.setItem('JsonWebToken', data2.token)


        return response
    } catch (error) {
        throw error;
    }
}

export async function FakestoreRegister(data) {
    try {
        const response = await fetch(URL_user, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: data.username,
                name: data.name,
                password1: data.password1,
                password2: data.password2,
                vendedor: data.vendedor
            }),
        })
        const data2 = await response.json()
        localStorage.setItem('JsonWebToken', data2.token)
        return response
    } catch (error) {
        throw error;

    }
}

export async function FakestoreEditUser(data, id) {
    try {
        const response = await fetch(URL_user + `${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                data_nascimento: data.data_nascimento,
                telefone: data.telefone,
                favorite_address: data.favorite_address
            }),
        })
        return response
    } catch (error) {
        throw error;
    }
}

export async function FakestoreEditRole(data, id) {
    try {
        const response = await fetch(URL_user + `admin/${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: data
            }),
        })
        return response
    } catch (error) {
        throw error;
    }
}

export async function FakestoreEditAcess(data, id) {
    try {
        const response = await fetch(URL_user + `acess/${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                block: data,
            }),
        })
        console.log(response);

        return response
    } catch (error) {
        throw error;
    }
}

export async function FakestoreCheck() {
    try {
        const response = await fetch(URL_user + 'checklogin', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.status === 404 & localStorage.getItem('JsonWebToken') === undefined) {
            showToast('error', 'Erro de Autenticação!!')
        }
        if (response.status === 200) {
            const data = response.json()
            return data
        }
    } catch (error) {
        throw error;
    }
}

export async function FakestoreLogout() {
    try {
        const response = await fetch(URL_user + "logout", { credentials: 'include' })
        const data = response.json()
        return data
    } catch (error) {
        throw error;

    }
}

export async function FakestoreCart() {
    try {
        const response = await fetch(URL_cart, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartCreate(data) {
    try {
        const response = await fetch(URL_cart, {
            method: "POST",
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product: data.product,
                quantity: data.quantity
            }),
        })
        return response
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartDelete() {
    try {
        const response = await fetch(URL_cart + '67e587f37317e2168b4d89a9', {
            method: 'DELETE',
            credentials: 'include',
        })
        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartDeleteItem(data) {
    try {
        const response = await fetch(URL_cart + 'mycart/remove', {
            method: 'DELETE',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product: data }),
        })
        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartUnique() {
    try {
        const response = await fetch(URL_cart + 'mycart', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartByUser(id) {
    try {
        const response = await fetch(URL_cart + `/user/${id}`, { credentials: 'include' })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function FakestoreCartId(id) {
    try {
        const response = await fetch(URL_cart + `${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function fakestorePDFcart(id) {
    try {
        const response = await fetch(URL_cart + `pdf/${id}`, { credentials: 'include' })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function fakestoreAddress(data) {
    try {
        const response = await fetch(URL_address, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return response
    } catch (error) {
        throw error
    }
}

export async function fakestoreGetAddress(id) {
    try {
        const response = await fetch(URL_address + `${id}`)
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function fakestoreGetAddressByUser(id) {
    try {
        const response = await fetch(URL_address + `user/${id}`, { credentials: 'include', })
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function buscarCEP(cep) {
    try {
        const response = await fetch(URL_cep + `${cep.cep}/json/`)
        const data = response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function getStripe() {
    try {
        const response = await fetch('http://localhost:3000/pagamento', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
        const data = response.json()
        return data
    } catch (error) {
        return error
    }
}

export async function verify() {
    try {
        const response = await fetch('http://localhost:3000/pagamento', { credentials: 'include', })
        const data = response.json()
        return data
    } catch (error) {
        return error
    }
}