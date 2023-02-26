'use strict';

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

    // this._setDescription();
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();

    this._setDescription();
  }

  // Method to calculate pace
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;

    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;

    this.calcSpeed();

    this._setDescription();
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
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  // Private class fields
  // Private instance properties so the properties that are available to all of the objects created through this class
  #map;
  #mapEvent;
  #workouts = [];

  // On page load
  constructor() {
    // this.workouts = [];
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

  _hideForm() {
    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';

    form.classList.add('hidden');

    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  _toggleElevationField(e) {
    console.log(e.target.value);
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // Helper function
    // Rest parameters
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    // Helper function to check positive number
    const allPositive = (...inputs) => inputs.every(input => input > 0);

    e.preventDefault();
    // Display marker
    console.log('Form is submitted!');

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    console.log('Input type value:');
    console.log(type);

    // If workout is running, create running object
    if (type === 'running') {
      // Get cadence
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Inputs have to be positive numbers!');
      }

      workout = new Running([lat, lng], distance, duration, cadence);

      console.log('Running workout:');
      console.log(workout);
    }

    // If workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Inputs have to be positive numbers!');
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);

      console.log('Elevation workout:');
      console.log(workout);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    // Diaplay marker
    // Render workout on map
    console.log(lat, lng);
    this._renderWorkout(workout);

    // Render workout on list
    this._renderWorkoutMarker(workout);

    // Hide form + clear input fields

    // Clear input fields
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords).addTo(this.#map).bindPopup('Workout').openPopup();
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      // .setPopupContent('Workout')
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    console.log('Render workout method:');

    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      `;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
       </li>
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }
}

// Create an actual object from class
const app = new App();
