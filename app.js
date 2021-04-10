// API keys Pexels
const auth = ""

//Accesseurs
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-form");
const moreBtn = document.querySelector(".more-btn");
const gallery = document.querySelector(".gallery");
let searchValue;
let page =1;
let currentSearch ="";

//Eventlisteners
searchInput.addEventListener("input", setInputValue);
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    clear();
    currentSearch = searchValue;
    searchPictures(currentSearch);
});
moreBtn.addEventListener("click", loadMore);

//Function
function setInputValue(e){
    searchValue = e.target.value;
}

function clear(){
    searchInput.value = "";
    gallery.innerHTML = "";
}

function generatePictures(data){
    let photos = data.photos;
    photos.forEach(photo => {
        const galleryImg = document.createElement("div");
        galleryImg.classList.add("gallery-img");
        galleryImg.innerHTML = `
        <div class="gallery-info">
            <p class="photographer-name">${photo.photographer}</p>
            <a href=${photo.src.large}>Download</a>
        </div>
        <img src=${photo.src.large}></img>
        `
        gallery.appendChild(galleryImg);
    })
}

//Asynch function

async function fetchAPI(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers:{
            Accept: "application/json",
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data
}

//First population of the gallery
async function fillGalery() {
    const url = "https://api.pexels.com/v1/curated?per_page=15&page=1";
    const data = await fetchAPI(url);
    generatePictures(data);
}

//Gallery update with search value
async function searchPictures(query){
    const url = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
    const data = await fetchAPI(url);
    generatePictures(data)
}

// Adding pictures by loading more from the API
async function loadMore(){
    //On ajoute la notion de page pour loaded les pages suivantes renvoyé par l'API
    page++;
    //S'il y a une current search alors on prend l'url avec query
    if(currentSearch){
        const data = await fetchAPI(`https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`);
        generatePictures(data);
    }else{
        const data = await fetchAPI(`https://api.pexels.com/v1/curated?per_page=15&page=${page}`);
        generatePictures(data);
    }
    
}

fillGalery();