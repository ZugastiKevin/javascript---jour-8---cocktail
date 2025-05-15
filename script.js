const navItem = document.querySelectorAll('.nav-item')
const list = document.getElementById('list')
const modal = document.getElementById('modal')

navItem[0].classList.add('active')

async function fetchData(category) {
    try {
        const reponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
        const cocktailData = await reponse.json()
        addItems(cocktailData.drinks)
    } catch(error) {
        console.log(error);
    }
}

navItem.forEach(item => {
    item.addEventListener('click', function(event) {
        navItem.forEach(item => item.classList.remove('active'))
        event.currentTarget.classList.add('active')
        fetchData(event.currentTarget.id)
    })
})

function outsideClick(event) {
    if (event.currentTarget !== modal) {
        modal.style.display = "none";
        window.removeEventListener("click", outsideClick);
    };
};

async function seeModal(id) {
    const reponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    const content = await reponse.json()
    const drink = content.drinks[0];
    
    const thumbnail = document.getElementById('drink-image')
    thumbnail.setAttribute('src', drink.strDrinkThumb)

    const name = document.getElementById('drink-name')
    name.textContent = drink.strDrink

    const measureIngredients = document.getElementById('drink-ingredients')
    measureIngredients.innerHTML = '';

    for (let i = 0; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
        const li = document.createElement('li')
        li.textContent =  measure ? `${measure.trim()}  ${ingredient}` : ingredient;
        measureIngredients.appendChild(li)
        }
    }
    
    const instructions = document.getElementById('drink-instructions')
    instructions.textContent = drink.strInstructions
    window.addEventListener("click", outsideClick);
}    

function addItems(drinks) {
    list.innerHTML = ''
    drinks.forEach(drink => {
        const container = document.createElement('div')
        container.classList.add('list-item', 'col-12', 'col-sm-3')
        const title = document.createElement('h3')
        title.textContent = drink.strDrink
        const thumbnail = document.createElement('img')
        thumbnail.setAttribute('src', drink.strDrinkThumb)
        thumbnail.classList.add('thumbnail')

        container.addEventListener('click', function() {
            seeModal(drink.idDrink)
            modal.style.display = 'flex'
        })

        container.appendChild(thumbnail)
        container.appendChild(title)
        list.appendChild(container)
    })
}

fetchData('Cocktail')