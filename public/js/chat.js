var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("El nombre es necesario");
}

var usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");

  socket.emit("entrarAlChat", { usuario: usuario }, function (resp) {
    console.log(resp);
  });
});

socket.on("crearMensaje", function (mensaje) {
  console.log("Servidor", mensaje);
});

//cuando u user entra o sale del chat
socket.on("listaPersona", function (personas) {
  console.log(personas);
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

//mensaje privado
socket.on("mensajePrivado", function (mensaje) {
  console.log("mP", tmensaje);
});
