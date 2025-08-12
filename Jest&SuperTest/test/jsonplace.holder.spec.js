import supertest from 'supertest';
import dotenv from 'dotenv';
import dummyData from './data/dummiData';

dotenv.config();

let api;
let PRODUCTS;
let ADD;
let id;
let title;
let newTitle;
let price;
let discountPercentage;
let stock;
let rating;
let description;
let brand;
let category;
let nuevoProducto;

beforeAll(() => {
    // Inicializamos una sola vez
    api = supertest(process.env.API_URL);
    PRODUCTS = process.env.PRODUCTS;
    ADD = process.env.ADD;

    // Cargamos valores fijos desde dummyData
    ({ id, title } = dummyData.products);
    ({ newTitle, price, discountPercentage, stock, rating, description, brand, category } = dummyData.newProduct);
});

beforeEach(() => {
    // Cada test arranca con un objeto limpio
    nuevoProducto = {
        title: newTitle,
        price,
        discountPercentage,
        stock,
        rating,
        description,
        brand,
        category
    };
});

describe("Verificar Modelo Products de DummyJSON", () => {

    test("Validar código de estado 200", async () => {
        const response = await api.get(PRODUCTS);
        expect(response.statusCode).toBe(200);
    });

    test("Validar que el campo 'products' sea un array", async () => {
        const response = await api.get(PRODUCTS);
        expect(response.body.products).toBeInstanceOf(Array);
        expect(Array.isArray(response.body.products)).toBe(true);
    });

    test("Validar producto con ID 1 y su título sea 'Essence Mascara Lash Princess'", async () => {
        const response = await api.get(`${PRODUCTS}/${id}`);
        expect(response.body.title).toBe(title);
    });

    test("Crear un nuevo producto", async () => {
        const response = await api
            .post(`${PRODUCTS}${ADD}`)
            .send(nuevoProducto);
        expect(response.body.title).toBe(newTitle);
        expect(response.body.id).toBeDefined();
        expect(response.body).toHaveProperty("id");
    });

    test("Eliminar un producto", async () => {
        const response = await api.delete(`${PRODUCTS}/${id}`).expect(200);
        expect(response.body).toHaveProperty("id", id);
        expect(response.body).toHaveProperty("isDeleted", true);
    });

    test("Actualizar el título de un producto", async () => {
        const response = await api
            .patch(`${PRODUCTS}/${id}`)
            .send({ title: newTitle })
            .expect(200);
        expect(response.body).toHaveProperty("id", id);
        expect(response.body).toHaveProperty("title", newTitle);
    });
});