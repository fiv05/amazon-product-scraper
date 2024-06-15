const puppeteer = require('puppeteer'); // Importa o módulo Puppeteer para controle de navegadores
const express = require('express'); // Importa o framework Express para criação de servidores web
const axios = require('axios');
const path = require('path'); arquivos

const app = express(); // Cria uma instância do Express
const port = 3000; // Define a porta onde o servidor irá escutar

app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

app.get('/api/scrape', async (req, res) => { // Define uma rota GET para '/api/scrape'
    const keyword = req.query.keyword; // Obtém a palavra-chave dos parâmetros de consulta

    try {
        const browser = await puppeteer.launch(); // Inicia uma nova instância do navegador com Puppeteer
        const page = await browser.newPage(); // Abre uma nova página no navegador

        // Navega para a página de resultados da Amazon com a palavra-chave fornecida
        await page.goto(`https://www.amazon.com.br/s?k=${keyword}`);
        await page.waitForSelector('.s-result-item'); // Aguarda que os elementos de resultado apareçam

        // Avalia o conteúdo da página para extrair detalhes dos produtos
        const productDetails = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('.s-result-item')); // Seleciona todos os itens de resultado
            
            return products.map(product => { // Mapeia cada produto para um objeto com detalhes
                const titleElement = product.querySelector('h2'); // Seleciona o elemento do título
                const title = titleElement ? titleElement.textContent.trim() : 'N/A'; // Obtém o texto do título ou 'N/A' se não existir

                const ratingElement = product.querySelector('.a-icon-star-small'); // Seleciona o elemento de classificação
                const rating = ratingElement ? ratingElement.getAttribute('aria-label') : 'N/A'; // Obtém a classificação ou 'N/A' se não existir

                const numReviewsElement = product.querySelector('.a-size-base'); // Seleciona o elemento de número de avaliações
                const numReviews = numReviewsElement ? numReviewsElement.textContent.trim() : 'N/A'; // Obtém o texto do número de avaliações ou 'N/A' se não existir

                const imageElement = product.querySelector('.s-image'); // Seleciona o elemento de imagem
                const imageUrl = imageElement ? imageElement.getAttribute('src') : 'N/A'; // Obtém a URL da imagem ou 'N/A' se não existir

                return { title, rating, numReviews, imageUrl }; // Retorna um objeto com os detalhes do produto
            });
        });

        await browser.close(); // Fecha o navegador

        res.json(productDetails); // Envia os detalhes dos produtos como resposta em formato JSON
    } catch (error) {
        console.error('Error scraping Amazon:', error); // Loga o erro no console
        res.status(500).json({ error: 'Error scraping Amazon' }); // Envia uma resposta de erro em caso de falha
    }
});

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Envia o arquivo 'index.html' como resposta
});

app.listen(port, () => { 
    console.log(`Server running at http://localhost:${port}`); // Loga uma mensagem indicando que o servidor está funcionando
});
