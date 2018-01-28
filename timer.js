'use strict';

import Digits from './digits.js';

const SECONDS = 1;
const MINUTES = 0;

class Timer {
  constructor(container,
              minutesInput,
              secondsInput,
              startStopButton,
              video,
              digitsMinutes,
              digitsSeconds) {
    this.startTime_ = 0;
    this.countDownInterval_ = 0;
    this.showTime_ = this.showTime_.bind(this);
    this.container_ = container;
    this.minutesInput_ = minutesInput;
    this.secondsInput_ = secondsInput;
    this.startStopButton_ = startStopButton;
    this.video_ = video;
    this.digitsMinutes_ = new Digits(digitsMinutes);
    this.digitsSeconds_ = new Digits(digitsSeconds);
    this.inputs_ = [
      this.minutesInput_,
      this.secondsInput_
    ]

    this.startStopButton_.addEventListener('click', event => {
      if (this.container_.classList.contains('count-down')) {
        this.stopAlarm_();
      } else {
        this.startTimer_();
      }
    });

    this.container_.addEventListener('keydown', event => {
      let isTextInput = event.target.matches('input:not([type=button])');
      switch (event.code) {
        case 'ArrowUp':
          if (isTextInput) {
            this.updateValue_(event.target, 1);
            event.preventDefault();
          }
          break;

        case 'ArrowDown':
          if (isTextInput) {
            this.updateValue_(event.target, -1);
            event.preventDefault();
          }
          break;

        case 'Space':
          if (this.container_.classList.contains('count-down')) {
            this.stopAlarm_();
          } else {
            this.startTimer_();
          }
          break;

        case 'Enter':
          this.startTimer_();
          break;
      }
    });

    this.container_.addEventListener('input', event => {
      const target = event.target;
      target.value = target.value.slice(0, target.selectionEnd);
      target.value = target.value.slice(target.value.length - 2);
      target.value = Math.max(
          0, Math.min(60, Number.parseInt(target.value))) | 0;
      this.updateDigits_();
    });

    window.addEventListener('wheel', event => {
      if (event.target.matches('input:not([type=button])')) {
        this.updateValue_(event.target, event.deltaY > 0 ? 1 : -1);
      }
    });

    this.updateDigits_();
  }

  startTimer_() {
    if (this.container_.classList.contains('count-down')) {
      return;
    }
    this.container_.classList.add('count-down');
    this.startStopButton_.value = 'stop';
    this.setStartTime_();
    this.countDownInterval_ = setInterval(this.showTime_, 100);
    this.showTime_();
    document.activeElement.blur();
  }

  setStartTime_() {
    let values = this.inputs_.map(input => {
      let value =  Math.abs(parseInt(input.value)) | 0;
      input.value = this.format_(value);
      input.disabled = true;
      return value;
    });
    let time = 1000 * (60 * values[MINUTES] + values[SECONDS]);
    this.startTime_ = Date.now() + time;
  }

  stopAlarm_() {
    if (!this.container_.classList.contains('count-down')) {
      return;
    }
    this.startStopButton_.value = 'start';
    clearInterval(this.countDownInterval_);
    this.video_.pause();
    this.container_.classList.remove('count-down');
    this.inputs_.forEach(input => input.disabled = false);
  }

  showTime_() {
    let remainingTime = this.startTime_ - Date.now();
    if (remainingTime <= 0) {
      remainingTime = 0;
      clearInterval(this.countDownInterval_);
      this.video_.play();
    }
    let secondsTotal = Math.round(remainingTime / 1000);
    let seconds = secondsTotal % 60;
    let minutes = (secondsTotal - seconds) / 60;
    this.minutesInput_.value = this.format_(minutes);
    this.secondsInput_.value = this.format_(seconds);
    this.updateDigits_();
  }

  updateDigits_() {
    this.digitsMinutes_.display(Number.parseInt(this.minutesInput_.value));
    this.digitsSeconds_.display(Number.parseInt(this.secondsInput_.value));
  }

  updateValue_(input, delta) {
    input.value = this.format_((parseInt(input.value) | 0) + delta);
    this.updateDigits_();
  }

  format_(number) {
    number = Math.min(Math.max(number, 0), 60);
    return (number < 10 ? '0' : '') + String(number);
  }
}




export default Timer;
