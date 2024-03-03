import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { tag } = req.query;

    const randomPage = Math.floor(Math.random() * 5) + 1;

    // Form the website URL using the tag
    // const url = `https://www.goodreads.com/quotes/tag/${tag}`;
    const url = `https://www.goodreads.com/quotes/tag/${tag}?page=${randomPage}`;
    // Fetch the page
    const { data } = await axios.get(url);

    // Parse the page with Cheerio
    const $ = cheerio.load(data);

    // Find the quotes
    const quotes = [];
    $('div.quote').each((i, elem) => {
        const quote = $(elem).find('div.quoteText').text().trim();
        // const author = $(elem).find('span.authorOrTitle').text().trim();
        quotes.push(quote);
    });

    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
    }

    const limitedQuotes = quotes.slice(0, 10);
    // const specialQuote = quotes[0];

    // Sending Random Special Quote from all 10 Quotes
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const specialQuote = quotes[randomIndex];

    // Return the quotes
    res.status(200).json({ quotes: limitedQuotes, specialQuote: specialQuote });
}
