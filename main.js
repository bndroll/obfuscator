import { App } from './src/app.js';


const bootstrap = async () => {
    const app = new App();
    app.init();
};

bootstrap();