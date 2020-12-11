const { io } = require("../server");
const { Usuarios } = require("../classes/usuario");
const { crearMensaje } = require("../utilidades/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("entrarAlChat", (data, callback) => {
    if (!data.usuario.nombre || !data.usuario.sala) {
      return callback({
        err: true,
        mensaje: "el nombre/sala es necesario",
      });
    }

    client.join(data.usuario.sala);
    usuarios.agregarPersona(
      client.id,
      data.usuario.nombre,
      data.usuario.sala
    );

    client.broadcast.to(data.usuario.sala).emit("listaPersona", usuarios.getPersonasPorSala(data.usuario.sala));
    callback(usuarios.getPersonasPorSala(data.usuario.sala));
  });

  client.on("crearMensaje", (data) => {
    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
  });

  //mensaje privv
  client.on("mensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });

  client.on("disconnect", () => {
    let personaBorrada = usuarios.borrarPersona(client.id);
    client.broadcast.to(personaBorrada.sala).emit(
      "crearMensaje",
      crearMensaje("Admin", `${personaBorrada.nombre} abandono el chat :(`)
    );

    client.broadcast.to(personaBorrada.sala).emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
  });
});
