export default class Slider {

    constructor(slider, wrap) {
        this.slider = document.querySelector(slider);
        this.wrap = document.querySelector(wrap);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slider.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.5;
        return (this.dist.finalPosition - this.dist.movement);
    }

    onStart(e) {
        let movetype;
        if (e.type === 'mousedown') {
            e.preventDefault();
            this.dist.startX = e.clientX;
            movetype = 'mousemove';
        } else {
            this.dist.startX = e.changedTouches[0].clientX;
            movetype = 'touchmove';
        }
        this.wrap.addEventListener(movetype, this.onMove);

    }

    onMove(e) {
        const pointerPosition = (e.type === 'mousemove') ? e.clientX : e.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(e) {
        const movetype = (e.type === "mouseup") ? 'mousemove' : 'touchmove';
        this.wrap.removeEventListener('mousemove', this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        this.wrap.addEventListener('mousedown', this.onStart);
        this.wrap.addEventListener('mouseup', this.onEnd);
        this.wrap.addEventListener('touchstart', this.onStart);
        this.wrap.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    slidePosition(slide) {
        const margin = (this.wrap.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slider.children].map((e) => {
            const position = this.slidePosition(e);
            return { position, e }
        });
    }

    slidesIndexNav(index) {
        const last = this.slideArray.length-1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(this.slideArray[index].position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slidesConfig();
        return this;
    }
}