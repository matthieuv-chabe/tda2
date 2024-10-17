# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list









YZEEL - Chabé Services:

Production: 
	- Host		:https://chabegateway-prod.azure-api.net/chabe-services
	- ApiKeyName	:Ocp-Apim-Subscription-Key
	- ApiKeyValue	: 5b5a9ab3be8e42e2a15aff295bcb2638

Staing: 
	- Host		:https://chabe-api-management-dev.azure-api.net/chabe-services
	- ApiKeyName	:Ocp-Apim-Subscription-Key
	- ApiKeyValue	: 246724d1e066440bb428e88393f0d4a4

   Pour récupérer les missions d’un client, utilise l'endpoint suivant :

Méthode : PUT

URL :  {{host}}/waynium/getMissionsWithSpecificWhereClause?dispatch=chabe

Body :

{

    "nf_gen_mission": "MIS_COM_ID IN (SELECT COM_ID FROM nf_com_commande WHERE COM_CLI_ID IN (ClientId))"

}