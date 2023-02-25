'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Global variables
// let map, mapEvent;

// Blueprint
class App {
  // Private class fields
  // Private instance properties so the properties that are available to all of the objects created through this class
  #map;
  #mapEvent;

  // On page load
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position!');
        }
      );
    }
  }

  _loadMap(position) {
    console.log('Position:');
    console.log(position);
    console.log(position.coords);

    // Object destructuring
    const { latitude, longitude } = position.coords;
    console.log(latitude);
    console.log(longitude);

    //   https://www.google.com/maps/@31.4497036,74.4173874
    console.log(`https://www.google.com/maps/@${latitude},${longitude})`);

    const coords = [latitude, longitude];

    console.log('this keyword:');
    console.log(this);

    //   Leaflet Library
    //   var map = L.map('map').setView([51.505, -0.09], 13);
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    console.log('Map:');
    console.log(this.#map);

    // User clicks on map
    // Lost the this keyword
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    console.log(this.#mapEvent);
    console.log(this.#mapEvent.latlng);

    const { lat, lng } = this.#mapEvent.latlng;
    console.log(lat, lng);

    // Render form
    form.classList.remove('hidden');

    //   Focus on distance input field
    inputDistance.focus();
  }

  _toggleElevationField(e) {
    console.log(e.target.value);
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    // Display marker
    console.log('Form is submitted!');

    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Diaplay marker
    // Render workout on map
    const { lat, lng } = this.#mapEvent.latlng;
    console.log(lat, lng);

    L.marker([lat, lng]).addTo(this.#map).bindPopup('Workout').openPopup();
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

// Create an actual object from class
const app = new App();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       console.log('Position:');
//       console.log(position);
//       console.log(position.coords);

//       // Object destructuring
//       const { latitude, longitude } = position.coords;
//       console.log(latitude);
//       console.log(longitude);

//       //   https://www.google.com/maps/@31.4497036,74.4173874
//       console.log(`https://www.google.com/maps/@${latitude},${longitude})`);

//       const coords = [latitude, longitude];

//       //   Leaflet Library
//       //   var map = L.map('map').setView([51.505, -0.09], 13);
//       map = L.map('map').setView(coords, 13);

//       //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       //     attribution:
//       //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       //   }).addTo(map);
//       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       //   L.marker([51.5, -0.09])
//       //     .addTo(map)
//       //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//       //     .openPopup();
//       //   L.marker(coords)
//       //     .addTo(map)
//       //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//       //     .openPopup();

//       console.log('Map:');
//       console.log(map);

//       //   Add event listener on map
//       //   map.on('click', function (e) {
//       //     console.log(e);
//       //     new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
//       //   });

//       // User clicks on map
//       map.on('click', function (mapE) {
//         mapEvent = mapE;
//         console.log(mapEvent);
//         console.log(mapEvent.latlng);

//         const { lat, lng } = mapEvent.latlng;
//         console.log(lat, lng);

//         // Render form
//         form.classList.remove('hidden');

//         //   Focus on distance input field
//         inputDistance.focus();

//         // L.marker([lat, lng]).addTo(map).bindPopup('Workout').openPopup();
//         // L.marker([lat, lng])
//         //   .addTo(map)
//         //   .bindPopup(
//         //     L.popup({
//         //       maxWidth: 250,
//         //       minWidth: 100,
//         //       autoClose: false,
//         //       closeOnClick: false,
//         //       className: 'running-popup',
//         //     })
//         //   )
//         //   .setPopupContent('Workout')
//         //   .openPopup();

//         // Render form
//         //   DOM Manipulation
//       });
//     },
//     function () {
//       alert('Could not get your position!');
//     }
//   );
// }

// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   // Display marker
//   console.log('Form is submitted!');

//   // Clear input fields
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       '';

//   // Diaplay marker
//   // Render workout on map
//   const { lat, lng } = mapEvent.latlng;
//   console.log(lat, lng);

//   L.marker([lat, lng]).addTo(map).bindPopup('Workout').openPopup();
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: 'running-popup',
//       })
//     )
//     .setPopupContent('Workout')
//     .openPopup();
// });

// inputType.addEventListener('change', function (e) {
//   console.log(e.target.value);
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
// });
