export const sortProd = async (event, setLoading, setProducts, products, FakestoreSort) => {
    const sort = event.target.value;
    const arrayProducts = [...products]
    setLoading(true); // Tela de Loading fechada
    if (sort === 'upPrice') {
        let produtos = arrayProducts;
        produtos.sort((a, b) => b.price - a.price); // Realiza a ordenação comparando preços Maior para Menor
        setProducts(produtos);
    } else if (sort === 'downPrice') {
        let produtos = arrayProducts;
        produtos.sort((a, b) => a.price - b.price);
        setProducts(produtos);
    } else if (sort === 'a-z') {
        let produtos = arrayProducts;
        produtos.sort((a, b) => a.title.localeCompare(b.title)); // Compara o title de A com B e verifica qual alfabeticamente é maior
        setProducts(produtos); // Suponho que ordene seguindo a tabela ASCII
    } else if (sort === 'z-a') {
        let produtos = arrayProducts;
        produtos.sort((a, b) => b.title.localeCompare(a.title));
        setProducts(produtos);
    } else if (sort !== "Default") {
        setLoading(false);
        const response = await FakestoreSort(sort); // Faz requisição no FakestoreAPI pegando ordenção de IDs
        console.log(response);
        setLoading(true);
        setProducts(response.products);
    } else {
        setLoading(false);
        const result = arrayProducts;
        setLoading(true);
        setProducts(result.products);
    }
};

export const filterCategory = async (event, setLoading, setProducts, FakestoreByCat, FakestoreALL, currentPage) => {
    const category = event.target.value;
    console.log(category);

    setLoading(true)
    if (category !== "Default") {
        setLoading(false)
        const response = await FakestoreByCat(category);
        setLoading(true)
        setProducts(response);
    } else {
        setLoading(false)
        const result = await FakestoreALL(currentPage);
        setLoading(true)
        setProducts(result.products);
    }
};

export const searchProduct = async (event, FakestoreALL, setProducts, currentPage) => {
    const search = event.target.value.toLowerCase();
    if (search) {
        const response = await FakestoreALL(currentPage);
        let produtos = response;
        const produtosFiltrados = produtos.products.filter(produto =>
            produto.title.toLowerCase().includes(search)
        ); //Filtra o valor de produtos pesquisando pela inclusão do seatch inserido pelo usuário
        setProducts(produtosFiltrados);
    } else {
        const response = await FakestoreALL(currentPage);
        setProducts(response.products);
    }
};