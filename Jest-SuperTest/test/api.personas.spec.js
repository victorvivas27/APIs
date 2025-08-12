const request = require('supertest');
const { app, server } = require('../app.js');

const dotenv = require('dotenv');
const { personas, erroresApi } = require('../data/personas.js');
dotenv.config();
let idCreado;
let rutaPersonas;
let nombre;
let apellido;
let edad;
let nuevoNombre;
let personaNoEncontrada;
let faltanDatos;


describe("✅ Pruebas completas del modelo Personas", () => {

  beforeAll(async () => {
    rutaPersonas = process.env.RUTA_PERSONAS;
  });

  beforeEach(() => {
    ({ nombre, apellido, edad } = personas.persona);
    ({ nuevoNombre } = personas.modificarPersona);
    ({ personaNoEncontrada, faltanDatos } = erroresApi.errorApi);
  });

  //1. Validar mensaje de bienvenida.
  test('Mensaje bienvenida', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).toBe('¡Bienvenido a la API de Personas!');
  });

  // 2. Registrar una persona.
  test("POST /personas - Crear persona", async () => {
    const nuevaPersona = {
      nombre,
      apellido,
      edad
    };

    const res = await request(app).post(rutaPersonas).send(nuevaPersona).expect(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nombre).toBe(nombre);
    idCreado = res.body.id;

  });

  // 3. Faltan datos validar status code.
  test("POST /personas - Crear persona con falta de datos ", async () => {
    const nuevaPersona = { nombre, apellido };
    const res = await request(app).post(rutaPersonas).send(nuevaPersona).expect(400);
    expect(res.body).toEqual({ message: faltanDatos });
  });

  // 4. Consultar todas las personas.
  test("GET /personas - Obtener lista", async () => {
    const res = await request(app).get(rutaPersonas).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 5. Consultar la persona que inserté
  test("GET /personas/:id - Obtener persona por ID", async () => {
    const res = await request(app).get(`${rutaPersonas}/${idCreado}`).expect(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.id).toBe(idCreado);
  });
  // 5. Consultar la persona que no existe
  test("GET /personas/:id - No encontrado con id no existente", async () => {
    const res = await request(app).get(`${rutaPersonas}/99999`).expect(404);
    expect(res.body).toEqual({ message: personaNoEncontrada });

  });

  // 6. Actualizar la persona.
  test("PUT /personas/:id - Actualizar nombre", async () => {
    const res = await request(app)
      .put(`${rutaPersonas}/${idCreado}`)
      .send({ nombre: nuevoNombre })
      .expect(200);
    expect(res.body.nombre).toBe(nuevoNombre);

  });

  // 7.Persona con id no existente.
  test("PUT /personas/:id - Actualizar nombre", async () => {
    const res = await request(app)
      .put(`${rutaPersonas}/99999`)
      .send({ nombre: nuevoNombre })
      .expect(404);
    expect(res.body).toEqual({ message: personaNoEncontrada });
  });

  // 8. Borrar la persona con id no existente.
  test("DELETE /personas/:id - Eliminar persona", async () => {
    const res = await request(app).delete(`${rutaPersonas}/99999`).expect(404);
    expect(res.body).toEqual({ message: personaNoEncontrada });
  });



  // 9. Borrar la persona.
  test("DELETE /personas/:id - Eliminar persona", async () => {
    await request(app).delete(`${rutaPersonas}/${idCreado}`).expect(204);
  });


  // 10. Consultar todas las personas (debería estar vacía si era la única)
  test("GET /personas - Lista vacía tras eliminar", async () => {
    const res = await request(app).get(rutaPersonas).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(p => p.id === idCreado)).toBeUndefined();
  });


  afterAll((done) => {
    console.log("--- [afterAll] Cerrando servidor ---");
    server.close(done);
  });
});
