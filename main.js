let presupuestoTotal = 0
let precioPano = 12000
let cantidadPanos = 0
let marcaAutos = ''
let cantidadAutos = 0
let cotizacionActual

const formulario = document.getElementById("formulario")
formulario.addEventListener('submit', calcularPresupuesto)
const borrar = document.getElementById("borrar")
borrar.addEventListener('click', borrarCotizacion)
let btndetalle = document.getElementById("obtenerDetalle")
btndetalle.onclick = mostrarDetalle

function calcularPresupuesto (e) {
  const autos = document.getElementById("autos").value
  const marca = document.getElementById("marca").value
  const panos = document.getElementById("panos").value
  e.preventDefault()
  if (autos !== '' && marca !== '' && panos !== '') {
    cantidadAutos = Number(autos)
    cantidadPanos = Number(panos)
    marcaAutos = marca

    presupuestoActual = cantidadAutos * cantidadPanos * precioPano

    const precioYaCotizado = buscarCotizacion()
    let presupuestoTotal = presupuestoActual + precioYaCotizado
    formulario.reset()

    cotizacionActual = { autos: cantidadAutos, marca: marcaAutos, panos: cantidadPanos, precio: presupuestoActual }
    guardarCotizacion(cotizacionActual)
    cuadro = document.getElementById("presupuesto")
    cuadro.innerHTML = `<p>El costo de su presupuesto para autos marca ${marcaAutos} es de:$${presupuestoTotal}</p>`
  } else {
    cuadro = document.getElementById("presupuesto")
    cuadro.innerHTML = `<p style="color: red;">Debe completar todos los datos.</p>`
  }

}

function buscarCotizacion () {
  let precioActual = localStorage.getItem("cotizacion")
  if (precioActual === undefined || precioActual === null) {
    return 0
  } else {
    let precioSumado = 0
    for (let cotizacionVieja of JSON.parse(precioActual)) {
      precioSumado += cotizacionVieja.precio
    }
    return precioSumado
  }
}

function guardarCotizacion (cotizacionNueva) {
  const cotizacionVieja = localStorage.getItem("cotizacion")
  if (cotizacionVieja === undefined || cotizacionVieja === null) {
    localStorage.setItem("cotizacion", JSON.stringify([cotizacionNueva]))
  } else {
    let cotizacionActual = [...JSON.parse(cotizacionVieja), cotizacionNueva]
    localStorage.setItem("cotizacion", JSON.stringify(cotizacionActual))
  }
}
function borrarCotizacion () {
  localStorage.removeItem("cotizacion")
}

function mostrarDetalle () {
  document.getElementById("tablaDetalle").innerHTML = `<ul>
    <li>El precio de cada paño es de: $${precioPano}</li>
    <li>Cantidad de paños ingresados: ${cantidadPanos}</li>
    <li>Cantidad de autos ingresados: ${cantidadAutos}</li>
    </ul>`
}

const tablaDatosJSON = async () => {
  const respuesta = await fetch('datos.json')
  const datosDeTabla = await respuesta.json()
  return datosDeTabla
}

const generarTabla = async () => {
  const tabla = document.getElementById('tabla-panios')
  const piezas = await tablaDatosJSON()
  const datosArray = Object.entries(piezas)
  let datosLista = ''
  for (let pieza of datosArray) {
    const parte = pieza[0]
    const panio = pieza[1]
    datosLista = datosLista.concat(`
      <tr>
        <td class="pl-3">${parte}</td>
        <td class="text-right pr-3">${panio}</td>
      </tr>
    `)
  }
  tabla.innerHTML = `
  <table class="border-collapse">
    <tr>
      <th class="text-center">Pieza</th>
      <th class="text-center">Cantidad de paños</th>
    </tr>
        ${datosLista}
  </table>`
}
generarTabla()

const hora = new Date();
document.getElementById("hora").innerHTML = hora;

