const { io } = require("../server");
const { Usuarios } = require("../classes/usuario");
const { crearMensaje } = require("../utilidades/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
    client.on("entrarChat", (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: "el nombre/sala es necesario",
            });
        }
        console.log(data);
        console.log('conectado')

        client.join(data.sala);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast
            .to(data.sala)
            .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje("Admin", `${data.nombre} se unio el chat :)`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on("crearMensaje", (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
        callback(mensaje)
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