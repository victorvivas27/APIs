const request = require('supertest');
const { app, server } = require('../app.js');

const dotenv = require('dotenv');
const { default: personas } = require('../data/personas.js');

dotenv.config();
let idCreado;
let rutaPersonas;
let nombre;
let apellido;
let edad;

describe("✅ Pruebas completas del modelo Personas", () => {
  
  beforeAll(async () => {
    rutaPersonas = process.env.RUTA_PERSONAS ;
   
  });
  beforeEach(() => {
     ({nombre,apellido,edad}=personas.persona_01)
   
  });


  // 1. Registrar una persona.
  test.only("POST /personas - Crear persona", async () => {
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

  // 2. Consultar todas las personas.
  test("GET /personas - Obtener lista", async () => {
    const res = await request(app).get(rutaPersonas).expect(200); 
    expect(Array.isArray(res.body)).toBe(true); 
    expect(res.body.length).toBeGreaterThan(0); 
  });

  // 3. Consultar la persona que inserté
  test("GET /personas/:id - Obtener persona por ID", async () => {
    const res = await request(app).get(`${rutaPersonas}/${idCreado}`).expect(200);
    expect(res.body).toBeInstanceOf(Object); 
    expect(res.body.id).toBe(idCreado); 
  });

  // 4. Actualizar la persona.
  test("PUT /personas/:id - Actualizar nombre", async () => {
    const res = await request(app)
      .put(`${rutaPersonas}/${idCreado}`)
      .send({ nombre: "Juan Carlos" })
      .expect(200);
    expect(res.body.nombre).toBe("Juan Carlos"); 
  });

  // 5. Borrar la persona.
  test("DELETE /personas/:id - Eliminar persona", async () => {
    await request(app).delete(`${rutaPersonas}/${idCreado}`).expect(204);  
 });

  // 6. Consultar todas las personas (debería estar vacía si era la única)
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
