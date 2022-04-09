const url = 'https://api.opendota.com'

async function getFetch(link) {
    try {
        let responseJson = await fetch(link)
        let response = await responseJson.json()
        return response
    } catch (error) {
        console.error("Hubo un error en la peticion: ", error)
    }
}

async function obtenerHeroes( ){
    let heroes = await getFetch(`${url}/api/heroStats`)
    cargaTablero(heroes)
}

function cargaTablero(heroes){
    let arrayIdsAleatorios = genedadorArrayIds()
    for (let i = 0; i < 10; i++) {
        cargaDatos(heroes[arrayIdsAleatorios[i]],i+1)    
    }
}

function genedadorArrayIds(){
    let array = []
    for (let i = 0; i < 10; i++) { 
        let id = generadorIdHeroe()
        if(array.includes(id)){
            id = id + 1
        }
        array.push(id)
    }
    return array
}

function generadorIdHeroe(){
    return Math.floor(Math.random() * 124)
}

async function cargaDatos(heroe,id){
    const img = document.getElementById(`img-hero-${id}`)
    img.src = `${url}${heroe.img}`

    const icon = document.getElementById(`icon-hero-${id}`)
    icon.src = `${url}${heroe.icon}`

    const nombre = document.getElementById(`nombre-hero-${id}`)
    nombre.innerHTML = heroe.localized_name

    const baseAgi = document.getElementById(`base-agi-${id}`)
    baseAgi.innerText = `Agi: ${heroe.base_agi}`

    const baseInt = document.getElementById(`base-int-${id}`)
    baseInt.innerText = `Int: ${heroe.base_int}`

    const baseStr = document.getElementById(`base-str-${id}`)
    baseStr.innerText = `Str: ${heroe.base_str}`

    const baseAttack = document.getElementById(`base-attack-${id}`)
    baseAttack.innerText = `${heroe.attack_type} [${heroe.base_attack_min}-${heroe.base_attack_max}]`

    const textoKDA = document.querySelector(`.card-results-${id} p`)
    textoKDA.innerHTML = 'Cargando k/d/a...'
    await retardo()
    textoKDA.innerHTML = generadorKDA()

}

function retardo(time = 2000){
    return new Promise (resolve => setTimeout(resolve, time))
}

function generadorKDA(){
    let k = Math.floor(Math.random() * 30)
    let d = Math.floor(Math.random() * 22)
    let a = Math.floor(Math.random() * 30)
    const texto = `${k} / ${d} / ${a}`  

    return texto
}

function mostrarTablero(){
    const tablero = document.querySelector('.tablero')
    tablero.style.display = 'block'
    tablero.style.backgroundImage = "url('./imagenes/mapa-dota2.jpg')"
}

function ocultarTablero(){
    const tablero = document.querySelector('.tablero')
    tablero.style.display = 'none'
}

function ocultarEstadisticas(){
    const div = document.querySelector('.informacion')
    div.style.display = 'none'
}

function mostrarEstadisticas(estadisticas){
    const div = document.querySelector('.informacion')
    div.style.display = 'block'

    const texto = document.querySelector('.informacion h2')
    texto.innerHTML = `Victoria ${estadisticas.ganador.toUpperCase()}`

    const mvps = document.querySelector('.destacados')
    mvps.style.display = 'block'

    const parrafo = document.querySelectorAll('.informacion p')
    let tiempo = {
        minutos: generadorTiempoDeJuego() + 15,
        segundos: generadorTiempoDeJuego()
    }
    parrafo[0].innerHTML = `Tiempo de juego ${tiempo.minutos}:${tiempo.segundos}`
    parrafo[1].innerHTML = ` Kills Radiant ${estadisticas.killsRadiant} - Kills Dire ${estadisticas.killsDire}`

    elegirHeroesDestacados(estadisticas.ganador)
}

function generadorTiempoDeJuego(){
    return Math.ceil(Math.random() * 60)
}

function elegirHeroesDestacados(ganador){
    const cartasHeroes = document.querySelectorAll(`.team-${ganador} .card`) /* los 5 divs del ganador */
    let mvpId = generadorMvp()

    const mvp = {
        nombre: cartasHeroes[mvpId].querySelector('.card-name').textContent,
        url: cartasHeroes[mvpId].querySelector('img').src,
        stats: cartasHeroes[mvpId].querySelector('.stats p').textContent
    } 

    const $div = document.querySelector('.destacados')

    const contenedor = document.createElement('div')
    contenedor.classList.add('card-mvp')

    const textoMvp = document.createElement('p')
    textoMvp.innerHTML = `<i> MVP de la partida </i>`

    const img = document.createElement('img')
    img.src = mvp.url

    const nombre = document.createElement('h2')
    nombre.innerText = mvp.nombre

    const stats = document.createElement('p')
    stats.innerText = mvp.stats 

    contenedor.appendChild(textoMvp)
    contenedor.appendChild(img)
    contenedor.appendChild(nombre)
    contenedor.appendChild(stats)

    $div.appendChild(contenedor)

}

function obtenerGanador(){
    let estadisticas = {
        killsRadiant: 0,
        killsDire: 0,
    }

    for (let i = 1; i <= 5; i++) {
        estadisticas.killsRadiant = estadisticas.killsRadiant + analizaEstadisticas(i)
    }
    for (let i = 6; i <= 10; i++) {
        estadisticas.killsDire = estadisticas.killsDire + analizaEstadisticas(i)
    }
    
    if(estadisticas.killsRadiant < 0) estadisticas.killsRadiant = Math.abs(estadisticas.killsRadiant)
    
    if(estadisticas.killsDire < 0) estadisticas.killsDire = Math.abs(estadisticas.killsDire)

    estadisticas.killsRadiant > estadisticas.killsDire? estadisticas.ganador = 'radiant' : estadisticas.ganador ='dire' 

    return estadisticas
}

function analizaEstadisticas(id){
    let estadisticas = document.querySelector(`.card-results-${id} p`).textContent.split('/')
    const k = Number(estadisticas[0])
    const d = Number(estadisticas[1])
    let dif = k - d
    
    return  dif
}

const btnJugar = document.getElementById('jugar')
const btnEstadisticas = document.getElementById('estadisticas')
btnEstadisticas.disabled = true

async function habilitarBotonEstadisticas(){
    await retardo(3000)
    btnEstadisticas.disabled = false
}

function deshabilitarBotonEstadisticas(){
    btnEstadisticas.disabled = true
}

btnJugar.addEventListener('click', () => {
    ocultarEstadisticas()
    mostrarTablero()
    obtenerHeroes()
    habilitarBotonEstadisticas()
})


btnEstadisticas.addEventListener('click', () => {
    ocultarTablero()
    deshabilitarBotonEstadisticas()
    let ganador = obtenerGanador()
    mostrarEstadisticas(ganador)
})