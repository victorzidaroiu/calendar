let CALENDAR = function() {
	let events = [];
	let eventChains = [];
	const maxEventWidth = 600;
	const startHour = 9;
	const totalHours = 12;

	let calendarEventsElement = document.querySelector('.calendarEvents');
	let calendarHoursElement = document.querySelector('.calendarHours');

	class EventChain {

		constructor(eventIndex) {
			this.chain = [eventIndex];

			events.forEach((event) => {
				if (eventIndex != event.index  && this.collidesWith(event.index))
					this.addEvent(event.index);
			});
		}

		get events() {
			return this.chain;
		}

		print(){
			console.log("Printing chain: ");
			this.chain.forEach((eventIndex) => {
				console.log(events[eventIndex]);
			});
			console.log('-----------------');
		}

		addEvent(eventIndex) {
			this.chain.push(eventIndex);
		}

		collidesWith(eventIndex) {
			let collisionDetected = true;

			this.chain.forEach((eventIndex2) => {
				if (!eventsCollide(events[eventIndex], events[eventIndex2]))
					collisionDetected = false;
			});

			return collisionDetected;
		}
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

	function renderHours() {
		for (let i = 0; i <= totalHours * 2; i++) {
			let element = document.createElement('div');
			let time = minutesToTime(startHour * 60 + i * 30);
			let amPm = time.hour >= startHour && time.hour < 12 ? 'AM' : 'PM';
			element.innerHTML = `${time.hour}: ${time.minutes} ${amPm}` ;
			if (time.minutes === '00')
				element.className = "fullHour";
			else
				element.className = "halfHour";
			calendarHoursElement.appendChild(element);
		}
	}

	function minutesToTime(minutes) {
		return {
			hour: Math.floor(minutes / 60) > 13 ? Math.floor(minutes / 60) - 12 : Math.floor(minutes / 60),
			minutes: minutes % 60 || '00'
		}
	}

	function renderEvents() {

		eventChains.sort((chain1, chain2) => {
			if (chain1.events.length > chain2.events.length)
				return 0;
			else if (chain1.events.length < chain2.events.length)
				return 1;
			return 0;
		});

		eventChains.forEach((eventChain) => {
			eventChain.print();

			let doDraw = [], drawn = [];

			let width = maxEventWidth / eventChain.events.length;
			eventChain.events.forEach((eventIndex) => {
				if (!events[eventIndex].isDrawn)
					doDraw.push(eventIndex);
				else {
					width = events[eventIndex].width;
					drawn.push(eventIndex);
				}
			});

			let positionIndex = 0;

			doDraw.forEach((eventIndex) => {
				let left = width * positionIndex;
				let canDraw = canDrawEvent(left, left + width, drawn);
				while (!canDraw){
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

	function canDrawEvent(start, end, drawn) {
		let canDraw = true;
		drawn.forEach((eventIndex) => {
			if (end > events[eventIndex].left && start < events[eventIndex].left + events[eventIndex].width)
				canDraw = false;
		});

		return canDraw;
	}

	function addEvent(event) {
		console.log(`Adding event:`);
		console.log(event);
		console.log(`------------`);

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

		if (!foundCollision)
			eventChains.push(new EventChain(event.index));
	}

	function eventsCollide(event1, event2) {
		return event1.end >= event2.start && event1.start <= event2.end;
	}

	function drawEvent(event) {
		let eventElement = document.createElement('div');
		let eventElementText = document.createElement('div');

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

	function generateRandomEvents(n = 5) {
		let eventsToAdd = [];

		for (let i = 0; i < n; i++) {
			let start = randomInt(0, 720 - 30);
			let end = randomInt(start + 30, 720);
			eventsToAdd.push({start: start, end: end});
		}

		layOutDay(eventsToAdd);
	};

	function randomInt(low, high) {
		return Math.floor(Math.random() * (high - low) + low);
	}

	window.layOutDay = layOutDay;
	window.generateRandomEvents = generateRandomEvents;
};

window.onload = function () {
	CALENDAR();

	layOutDay([
		{start: 30, end: 150},
		{start: 540, end: 600},
		{start: 560, end: 620},
		{start: 610, end: 670}
	]);

	//generateRandomEvents(5);
};
