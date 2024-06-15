// script.js
document.addEventListener('DOMContentLoaded', () => {
    const scrapeBtn = document.getElementById('scrapeBtn');
    const resultsDiv = document.getElementById('results');
// Adiciona um evento de clique ao botão de scrape
    scrapeBtn.addEventListener('click', async () => {
        const keyword = document.getElementById('keyword').value.trim();
        if (keyword === '') {
             // Se a palavra-chave estiver vazia, exibe um alerta e interrompe a execução
            alert('Por favor, entre com a palavra chave');
            return;
        }

        try {
            // Faz uma requisição GET para a API de scrape com a palavra-chave
            const response = await axios.get(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
            const data = response.data;

            if (data.length === 0) {
                resultsDiv.innerHTML = '<p>No products found.</p>';
            } else {
                 // Se houver produtos, mapeia os dados para HTML e insere na div de resultados
                resultsDiv.innerHTML = data.map(product => (
                    `<div class="product">
                        <img src="${product.imageUrl}" alt="Product Image">
                        <div>
                            <p><strong>Title:</strong> ${product.title}</p>
                            <p><strong>Rating:</strong> ${product.rating}</p>
                            <p><strong>Number of Reviews:</strong> ${product.numReviews}</p>
                        </div>
                    </div>`
                )).join('');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        }
    });
});
