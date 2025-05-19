import 'dotenv/config';

const config = {
    MORALIS_KEY : process.env.MORALIS_KEY as string,
    OPENAI_API_KEY : process.env.OPENAI_API_KEY as string,
    PORT : process.env.PORT as string || 3000,
}

export default config