// data for 5 places (replace image paths with your own in images/)
const places = [
  {
    id:1, title:"Eiffel Tower", country:"France",
    img:"images/eiffel.jpg",
    coords:"48.858370,2.294481",
    desc:"Iconic iron tower in Paris with observation decks and city views."
  },
  {
    id:2, title:"Taj Mahal", country:"India",
    img:"images/tajmahal.jpg",
    coords:"27.175015,78.042155",
    desc:"White marble mausoleum in Agra — a UNESCO World Heritage site."
  },
  {
    id:3, title:"Grand Canyon", country:"United States",
    img:"images/grandcanyon.jpg",
    coords:"36.106965,-112.112997",
    desc:"A massive canyon carved by the Colorado River."
  },
  {
    id:4, title:"Mount Fuji", country:"Japan",
    img:"images/fuji.jpg",
    coords:"35.360555,138.727778",
    desc:"Japan's tallest peak and a cultural icon."
  },
  {
    id:5, title:"Christ the Redeemer", country:"Brazil",
    img:"images/christ.jpg",
    coords:"-22.951916,-43.210487",
    desc:"Giant statue overlooking Rio de Janeiro from Corcovado mountain."
  }
];

// --- DOM refs ---
const gallery = document.getElementById('gallery');
const countryFilter = document.getElementById('countryFilter');
const searchInput = document.getElementById('search');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCountry = document.getElementById('modalCountry');
const mapLink = document.getElementById('mapLink');
const favBtn = document.getElementById('favBtn');

let favorites = new Set(JSON.parse(localStorage.getItem('wex_favs')||'[]'));

// render country options
function populateCountries(){
  const countries = [...new Set(places.map(p=>p.country))].sort();
  countries.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    countryFilter.appendChild(opt);
  });
}

// render cards
function renderCards(filterText='', filterCountry=''){
  gallery.innerHTML='';
  const q = filterText.trim().toLowerCase();
  const results = places.filter(p=>{
    const matchText = p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
    const matchCountry = filterCountry ? p.country === filterCountry : true;
    return matchText && matchCountry;
  });
  if(results.length === 0){
    gallery.innerHTML = '<p style="padding:24px;color:#555">No places found.</p>';
    return;
  }
  results.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}" />
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.desc.slice(0,90)}${p.desc.length>90?'…':''}</p>
        <div class="meta">
          <small>${p.country}</small>
          <div>
            <button class="view" data-id="${p.id}">View</button>
            <button class="fav" data-id="${p.id}">${favorites.has(p.id) ? '★' : '☆'}</button>
          </div>
        </div>
      </div>
    `;
    gallery.appendChild(card);
  });
  // attach listeners
  document.querySelectorAll('.view').forEach(btn=>{
    btn.addEventListener('click', ()=> openModal(places.find(x=>x.id==btn.dataset.id)));
  });
  document.querySelectorAll('.fav').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
      localStorage.setItem('wex_favs', JSON.stringify([...favorites]));
      renderCards(searchInput.value, countryFilter.value);
    });
  });
}

// modal open
function openModal(place){
  modalImg.src = place.img;
  modalTitle.textContent = place.title;
  modalDesc.textContent = place.desc;
  modalCountry.textContent = place.country;
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.coords)}`;
  favBtn.textContent = favorites.has(place.id) ? 'Remove from favorites' : 'Add to favorites';
  favBtn.onclick = ()=>{
    if(favorites.has(place.id)) favorites.delete(place.id); else favorites.add(place.id);
    localStorage.setItem('wex_favs', JSON.stringify([...favorites]));
    favBtn.textContent = favorites.has(place.id) ? 'Remove from favorites' : 'Add to favorites';
    renderCards(searchInput.value, countryFilter.value);
  };
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}

// modal close
closeModal.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); });

// search & filter events
searchInput.addEventListener('input', ()=> renderCards(searchInput.value, countryFilter.value));
countryFilter.addEventListener('change', ()=> renderCards(searchInput.value, countryFilter.value));

// init
populateCountries();
renderCards();
