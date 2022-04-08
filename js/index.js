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