# QuotesAI

QuotesAI is built using Next.js, Tailwind CSS, Shadcn-ui, Magic-ui, Supabase, NextAuth, and Prisma. It is powered by Vercel and the OpenAI API. It uses the Goodreads API to generate category-based quotes as per your current mood/vibe.

## Video Overview

Watch the video below for a quick overview of QuotesAI:

https://github.com/DarkInventor/QuotesAI/assets/67015517/e59b2402-772b-4ede-a28d-951278e6c555


## Environment Variables

### Supabase Connection Pooling

```
DATABASE_URL=
```

### NextAuth Configuration

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### Google OAuth Configuration

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### GitHub OAuth Configuration

```
GITHUB_ID=
GITHUB_SECRET=
GITHUB_ACCESS_TOKEN=
```

### Stripe Configuration

```
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/DarkInventor/QuotesAI.git
   cd QuotesAI
   ```

2. **Create and populate the `.env` file:**
   ```sh
   cp .env.example .env
   ```
   Edit the `.env` file and add your credentials.

3. **Install dependencies:**
   ```sh
   pnpm install
   ```

4. **Run the development server:**
   ```sh
   pnpm run dev
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DarkInventor/QuotesAI/blob/main/License.md) file for details.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.