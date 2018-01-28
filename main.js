'use strict';
import Timer from './timer.js';

new Timer(...['body', '#minutes', '#seconds', 'input[type=button]', 'video',
              '#digits-minutes', '#digits-seconds']
              .map(selector => document.querySelector(selector)));
