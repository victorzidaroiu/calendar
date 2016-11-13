/* eslint-disable no-console */
/* global events */

const doEventsColide = (event1, event2) => event1.end >= event2.start && event1.start <= event2.end;

export default class EventChain {
  constructor(events, eventIndex) {
    this.chain = [eventIndex];
    this.globalEvents = events;

    events.forEach((event) => {
      if (eventIndex !== event.index && this.collidesWith(event.index)) {
        this.addEvent(event.index);
      }
    });
  }

  get events() {
    return this.chain;
  }

  print() {
    console.log('Printing chain: ');
    this.chain.forEach((eventIndex) => {
      console.log(this.globalEvents[eventIndex]);
    });
    console.log('-----------------');
  }

  addEvent(eventIndex) {
    this.chain.push(eventIndex);
  }

  collidesWith(eventIndex) {
    let collisionDetected = true;

    this.chain.forEach((eventIndex2) => {
      if (!doEventsColide(this.globalEvents[eventIndex], this.globalEvents[eventIndex2])) {
        collisionDetected = false;
      }
    });

    return collisionDetected;
  }
}
