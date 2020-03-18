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
        this.dist.movement = (this.dist.startX - clientX)*1.5;
        return (this.dist.finalPosition - this.dist.movement);
    }

    onStart(e) {
        e.preventDefault();
        this.wrap.addEventListener('mousemove', this.onMove);
        this.dist.startX = e.clientX;
    }

    onMove(e) {
        this.wrap.addEventListener('mouseup', this.onEnd);
        const finalPosition = this.updatePosition(e.clientX);
        this.moveSlide(finalPosition);
    }

    onEnd(e) {
        this.wrap.removeEventListener('mousemove', this.onMove); 
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        this.wrap.addEventListener('mousedown', this.onStart);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}