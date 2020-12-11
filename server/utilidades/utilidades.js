const crearMensaje = (nombre, mensaje) => {
  return {
    nombre,
    mensaje,
    fehca: new Date().getTime(),
  };
};

module.exports = {
  crearMensaje,
};
