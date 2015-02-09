"use strict";
var planets = { /*This object stores the gravities and names of the planets*/
    sun: {
        gravity: 274.53996,
        name: "Sun"
    },
    mercury: {
        gravity: 3.72324,
        name: "Mercury"
    },
    venus: {
        gravity: 8.8182,
        name: "Venus"
    },
    earth: {
        gravity: 9.798,
        name: "Earth"
    },
    moon: {
        gravity: 1.61667,
        name: "Moon"
    },
    mars: {
        gravity: 3.72324,
        name: "Mars"
    },
    phobos: {
        gravity: 0.0056965572,
        name: "Phobos"
    },
    deimos: {
        gravity: 0.002998188,
        name: "Demos"
    },
    ceres: {
        gravity: 0.269445,
        name: "Ceres"
    },
    jupiter: {
        gravity: 24.78894,
        name: "Jupiter"
    },
    io: {
        gravity: 1.793034,
        name: "Io"
    },
    europa: {
        gravity: 1.312932,
        name: "Europa"
    },
    ganymede: {
        gravity: 1.4697,
        name: "Ganymede"
    },
    callisto: {
        gravity: 1.234548,
        name: "Callisto"
    },
    saturn: {
        gravity: 10.48386,
        name: "Saturn"
    },
    titan: {
        gravity: 1.37172,
        name: "Titan"
    },
    enceladus: {
        gravity: 0.1107174,
        name: "Enceladus"
    },
    uranus: {
        gravity: 8.72022,
        name: "Uranus"
    },
    neptune: {
        gravity: 11.16972,
        name: "Neptune"
    },
    triton: {
        gravity: 0.7809006,
        name: "Triton"
    },
    pluto: {
        gravity: 0.656466,
        name: "Pluto"
    },
    eris: {
        gravity: 0.6633246,
        name: "Eris"
    },
    space: {
        gravity: 0,
        name: "Outer Space"
    }
};

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    lastPlanet: null, //start with no planet history

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //    We bind the 
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false); //when the device is ready, call the function to get rid of the loading screen
        document.getElementById('updateButton').addEventListener('touchstart', this.update, false); //when the user touches the update button, call the update function

    },

    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent();
    },

    // once the device is ready, remove the loading screen.
    receivedEvent: function () {
        var parentElement = document.querySelector('.app'),
            receivedElement = document.getElementById('loading-screen');
        document.getElementById("loading-title").innerHTML = "Ready!"; //change loading to ready
        setTimeout(function () {
            receivedElement.className += " fade";
            document.getElementById('loading-title').className += " slide-up";
            document.getElementById('loading-bar').className += " slide-down";
        }, 200); //after 1/10 second, slide the loading screen off
        setTimeout(function () {
            parentElement.removeChild(receivedElement);
        }, 2100); //after the loading screen is off canvas, delete it
        var imageHolder = document.getElementById('hero-area'),
            newImages = document.createElement('div');
        newImages.setAttribute('id', 'hero-images');

        for (var planet in planets) { //iterate through planets and add the images to the DOM so they load quickly later
            if (planets.hasOwnProperty(planet)) { //only iterate over properties of this object, not ones from the prototype
                var thisPlanet = planets[planet];
                var planetImage = document.createElement('img');
                planetImage.setAttribute('src', '../img/' + thisPlanet.name + '.png');
                planetImage.setAttribute('id', thisPlanet.name + '-img');
                planetImage.setAttribute('class', 'off-canvas');
                newImages.appendChild(planetImage);
                console.log('Adding ' + thisPlanet.name + ' to preload');
            }
        }
        imageHolder.appendChild(newImages);
        StatusBar.hide();
    },

    //When user clicks button, find acceleration and update the readout
    update: function () {
        function onSuccess(acceleration) { //called once accelerometer succeeds

            var readout = document.getElementById("readout"),
                totalAcceleration = Math.sqrt(Math.pow(acceleration.x, 2) + Math.pow(acceleration.y, 2) + Math.pow(acceleration.z, 2)), //adds the accelerations in three directions to get the total. a^2 = x^2 + y^2 + z^2

                closestPlanet,
                smallestDifference = Number.MAX_VALUE, //default difference to absurdly large number
                planet,
                thisPlanet,
                currentDifference;
            for (planet in planets) { //iterate through planets and find the one with the lowest difference in surface acceleration
                if (planets.hasOwnProperty(planet)) { //only iterate over properties of this object, not ones from the prototype
                    thisPlanet = planets[planet];
                    currentDifference = Math.abs(thisPlanet.gravity - totalAcceleration);
                    if (currentDifference < smallestDifference) { //if this is the closest yet, store the planet and the difference
                        closestPlanet = thisPlanet;
                        smallestDifference = currentDifference;
                    }
                }
            }
            if (closestPlanet.name === "Outer Space") {
                readout.innerHTML = 'You are <span id="probably">(probably)</span> in<br><span id = "planet-name">' + closestPlanet.name + '</span>.<br>Total Acceleration : ' + totalAcceleration.toFixed(2) + 'm/s<sup>2</sup>'; //Correct grammar for Outer Space. "in" not "on"
            } else {
                readout.innerHTML = 'You are <span id="probably">(probably)</span> on<br><span id = "planet-name">' + closestPlanet.name + '</span>.<br>Total Acceleration : ' + totalAcceleration.toFixed(2) + 'm/s<sup>2</sup>';
            }
            /*You are (probably) on Earth.
            Total Acceleration : 9.86m/s2
            */
            var heroArea = document.getElementById("hero-area"),
                lastPlanet = app.lastPlanet,
                solarSystem = document.getElementById('hero-image');
            if (solarSystem) {
                heroArea.removeChild(solarSystem);
            }
            if (!lastPlanet || (lastPlanet.name !== closestPlanet.name)) { //if there is no last planet, or if the last planet is different from the current planet, change the background image
                var newImage = document.getElementById(closestPlanet.name + '-img');
                newImage.setAttribute('class', 'on-canvas planet-slide-in');
                if (lastPlanet) {
                    var oldImage = document.getElementById(lastPlanet.name + '-img');
                    oldImage.setAttribute('class', 'on-canvas planet-slide-out');
                    console.log('Planet classes: old:' + (oldImage ? oldImage.getAttribute('class') : "none") + ' + new:' + newImage.getAttribute('class'));
                }
            }
            console.log('Planet names: ' + (lastPlanet ? lastPlanet.name : "none") + ' + ' + closestPlanet.name);
            if (lastPlanet && (lastPlanet.name === closestPlanet.name)) { //if there is a last planet, and it's the same as the current one, add some text to the planet name.
                var planetName = document.getElementById("planet-name"),
                    still = Math.random() > 0.5 ? ", still" : ", again"; //randomly add one string to the end of the planet name
                planetName.innerHTML += still;
            }
            app.lastPlanet = closestPlanet; //save the planet to compare with the one chosen next time



        }

        function onError() {
            navigator.notification.alert('Unable to find acceleration!');
        }

        navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
        navigator.notification.vibrate(100);
    }

};