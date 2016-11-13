/* global document, window, layOutDay */
/* eslint-disable no-console */

import EventChain from './calendar/event-chain';
import minutesToTime from './helpers/minutes-to-time';
import randomInt from './helpers/random-int';

const startCalendar = () => {
  let events = [];
  let eventChains = [];
  const maxEventWidth = 600;
  const startHour = 9;
  const totalHours = 12;

  const calendarEventsElement = document.querySelector('.calendarEvents');
  const calendarHoursElement = document.querySelector('.calendarHours');

  function addEvent(eventParam) {
    const event = eventParam;

    console.log('Adding event:');
    console.log(event);
    console.log('------------');

    event.isDrawn = false;
    event.width = 600;
    event.left = 0;
    events.push(event);
    events[events.length - 1].index = events.length - 1;
    event.index = events.length - 1;

    let foundCollision = false;

    eventChains.forEach((eventChain) => {
      if (eventChain.collidesWith(event.index)) {
        eventChain.addEvent(event.index);
        foundCollision = true;
      }
    });

    if (!foundCollision) {
      eventChains.push(new EventChain(events, event.index));
    }
  }

  function drawEvent(event) {
    const eventElement = document.createElement('div');
    const eventElementText = document.createElement('div');

    eventElementText.className = 'eventText';
    eventElementText.innerHTML = event.name || 'Sample Item';

    eventElement.style.top = event.start;
    eventElement.style.width = event.width;
    eventElement.style.left = event.left;
    eventElement.style.height = event.end - event.start;

    eventElement.appendChild(eventElementText);
    calendarEventsElement.appendChild(eventElement);

    events[event.index].isDrawn = true;
  }

  function renderHours() {
    for (let i = 0; i <= totalHours * 2; i += 1) {
      const element = document.createElement('div');
      const time = minutesToTime((startHour * 60) + (i * 30));
      const amPm = time.hour >= startHour && time.hour < 12 ? 'AM' : 'PM';
      element.innerHTML = `${time.hour}: ${time.minutes} ${amPm}`;
      if (time.minutes === '00') {
        element.className = 'fullHour';
      } else {
        element.className = 'halfHour';
      }
      calendarHoursElement.appendChild(element);
    }
  }

  function canDrawEvent(start, end, drawn) {
    let canDraw = true;
    drawn.forEach((eventIndex) => {
      if (end > events[eventIndex].left &&
        start < events[eventIndex].left + events[eventIndex].width) {
        canDraw = false;
      }
    });

    return canDraw;
  }

  function renderEvents() {
    eventChains.sort((chain1, chain2) => {
      if (chain1.events.length > chain2.events.length) {
        return 0;
      } else if (chain1.events.length < chain2.events.length) {
        return 1;
      }
      return 0;
    });

    eventChains.forEach((eventChain) => {
      eventChain.print();

      const doDraw = [];
      const drawn = [];

      let width = maxEventWidth / eventChain.events.length;
      eventChain.events.forEach((eventIndex) => {
        if (!events[eventIndex].isDrawn) {
          doDraw.push(eventIndex);
        } else {
          width = events[eventIndex].width;
          drawn.push(eventIndex);
        }
      });

      let positionIndex = 0;

      doDraw.forEach((eventIndex) => {
        let left = width * positionIndex;
        let canDraw = canDrawEvent(left, left + width, drawn);
        while (!canDraw) {
          positionIndex += 1;
          left = width * positionIndex;
          canDraw = canDrawEvent(left, left + width, drawn);
        }
        events[eventIndex].width = width;
        events[eventIndex].left = width * positionIndex;
        positionIndex += 1;
        drawEvent(events[eventIndex]);
      });
    });
  }

  function layOutDay(eventArray) {
    calendarEventsElement.innerHTML = '';
    calendarHoursElement.innerHTML = '';

    events = [];
    eventChains = [];

    eventArray.forEach(addEvent);
    renderEvents();
    renderHours();
  }

  function generateRandomEvents(n = 5) {
    const eventsToAdd = [];

    for (let i = 0; i < n; i += 1) {
      const start = randomInt(0, 720 - 30);
      const end = randomInt(start + 30, 720);
      eventsToAdd.push({ start, end });
    }

    layOutDay(eventsToAdd);
  }

  window.layOutDay = layOutDay;
  window.generateRandomEvents = generateRandomEvents;
};

window.onload = () => {
  startCalendar();

  layOutDay([
    { start: 30, end: 150 },
    { start: 540, end: 600 },
    { start: 560, end: 620 },
    { start: 610, end: 670 },
  ]);
};
