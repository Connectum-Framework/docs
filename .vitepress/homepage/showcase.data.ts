import { deploymentMarkup } from './deployment-markup.mjs';
import { staticDeploymentSvg } from './static-deployment.mjs';

const loader = {
    watch: ['.vitepress/homepage/*-markup.mjs', '.vitepress/homepage/*-deployment.mjs', '.vitepress/homepage/deployment-model.mjs'],
    load() {
        return {
            deployment: deploymentMarkup(staticDeploymentSvg() + staticDeploymentSvg(true)),
        };
    },
};

export declare const data: ReturnType<typeof loader.load>;
export default loader;
