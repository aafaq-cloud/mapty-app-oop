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

// Parent Class of Running and Cycling
class Workout {
  // We need an id (unique identifier)
  date = new Date();
  // Create id using library
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
  }

  // Method to calculate pace
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;

    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;

    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    // The speed is opposite to the pace
    this.speed = this.distance / (this.duration / 60);

    return this.speed;
  }
}

const running = new Running([39, -12], 5.2, 24, 178);
const cycling = new Cycling([39, -12], 27, 95, 523);

console.log(running);
console.log(cycling);

// Blueprint
//////////////////////////////////////////
// APPLICATION ARCHITECTURE
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
