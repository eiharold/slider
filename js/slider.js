export default class Slider {

    constructor(slider, wrap) {
        this.slider = document.querySelector(slider);
        this.wrap = document.querySelector(wrap);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    }

    transition(active) {
        this.slider.style.transition = active ? 'transform .3s' : '';
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
        this.transition(false);
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
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
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
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) { this.changeSlide(this.index.prev); }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) { this.changeSlide(this.index.next); }
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig();
        return this;
    }
}