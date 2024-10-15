// File: index.ts
const {Elysia} = require('elysia')

import mainhtml from "./index.html"

const app = new Elysia()
    // 1. use as plugin
    .use("/", mainhtml)
    .listen(3000)

// goto http://localhost:3000/app