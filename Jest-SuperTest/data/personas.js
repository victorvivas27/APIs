const personas = {
  persona: { nombre: "Juan", apellido: "Perez", edad: 40 },
  modificarPersona: { nuevoNombre: "Juan Carlos", apellido: "Perez", edad: 41 }
  };


const erroresApi = {
  errorApi: {
    errorServidor: "Error en el servidor",
    personaNoEncontrada: "Persona no encontrada", 
    faltanDatos: "Faltan datos requeridos (nombre, apellido, edad)"
  },

}
module.exports = { personas, erroresApi };