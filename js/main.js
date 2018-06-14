document.addEventListener('DOMContentLoaded', function () {

  var entityInput = document.getElementById('entity-input'),
      entityInputContainer = document.getElementById('entity-input-character'),
      currentContainer = document.getElementById('current'),
      hiddenCharacter = document.getElementById('hidden-character'),
      outputContainer = document.getElementsByClassName('output-container')[0],

      regSearchNum = /&#\d/,
      regSearchWord = /&\w/,
      regSearchWrongNum = /^&#([0-9]|[1-2][\d]|3[0-2])$/,
      regGetAllNum = /\d+/g,
      regGetAllMnemonic = /&.+;/g,
      regGetAllNumericValues = /&#.+;/g,

      outputCss = document.getElementById('css-value'),
      outputJs = document.getElementById('js-value');


// Для обработки числового обозначения и мнемоники
  entityInput.addEventListener('input', function () {

      // Проверка в случае числового значения
      if (!(regSearchWrongNum.test(this.value)) && regSearchNum.test(this.value)) {
        hiddenCharacter.innerHTML = this.value.match(regGetAllNumericValues)[0].replace(/\s+/g, '');

        makeOutput.call(this, this.value.match(regGetAllNum));
      }

      // Проверка в случае мнемоники
      if (regSearchWord.test(this.value)) {
        hiddenCharacter.innerHTML = this.value.match(regGetAllMnemonic)[0].replace(/\s+/g, '');

        var charCodes = [];

        for (var i = 0; i < hiddenCharacter.textContent.length; i++) {
          charCodes.push(hiddenCharacter.textContent.charCodeAt(i));
        }

      makeOutput.call(this, charCodes);
      }
  });

// Для обработки символа
  entityInputContainer.addEventListener('input', function () {
    var charCodes = [];

    for (var i = 0; i < this.value.length; i++) {
      charCodes.push(this.value.charCodeAt(i));
    }

    makeOutput.call(this, charCodes);

    if (this.value.length === 0) {
      outputCss.value = outputJs.value = "";
    }
  });

// Для отмены выделения при коппировании в буффер
  var copyCssBtn = new ClipboardJS("#copy-css");
  var copyJsBtn = new ClipboardJS("#copy-js");


  addDeselect([copyCssBtn, copyJsBtn]);


// Alerts
      var copyCss = document.getElementById('copy-css'),
          copyJs = document.getElementById('copy-js');

      copyCssBtn.on('success', function () {
        copyCss.parentElement.getElementsByClassName('alert-success')[0].classList.toggle('active');

        setTimeout(function () {
          copyCss.parentElement.getElementsByClassName('alert-success')[0].classList.toggle('active');
        },2000);
      });

      copyJsBtn.on('success', function () {
        copyJs.parentElement.getElementsByClassName('alert-success')[0].classList.toggle('active');

        setTimeout(function () {
          copyJs.parentElement.getElementsByClassName('alert-success')[0].classList.toggle('active');
        },2000);
      });



// Вспомогательные функции

  function toHex(value) {
    return Number(value).toString(16).toUpperCase();
  }

  function addLeftCharacters(hex, character, len) {
    var zeroCount = len - hex.length - character.length,
        str = character;

    for (var i = 0; i < zeroCount; i++) {
      str += "0";
    }

    return str + hex;
  }

  function makeOutput(arr) {
    var hiddenTextLen = hiddenCharacter.textContent.length;

    if (hiddenTextLen === 1) {
      currentContainer.textContent = hiddenCharacter.textContent[0];
    } else {
      currentContainer.textContent = hiddenCharacter.textContent[hiddenTextLen - 1];
    }

    var cssValue, jsValue;
    cssValue = jsValue = "";

    arr.forEach(function (item) {
      var hexValue = toHex(item);

      cssValue += addLeftCharacters(hexValue, "\\", 5);
      jsValue += addLeftCharacters(hexValue, "\\u", 6);
    });

    autosize(outputCss);
    autosize(outputJs);

    outputCss.value = cssValue;
    outputJs.value = jsValue;
  }

  function deselectAll() {
    var element = document.activeElement;

    if (element && /INPUT|TEXTAREA/i.test(element.tagName)) {
      if ('selectionStart' in element) {
        element.selectionEnd = element.selectionStart;
      }
    element.blur();
    }

    if (window.getSelection) { // All browsers, except IE <=8
      window.getSelection().removeAllRanges();
    } else if (document.selection) { // IE <=8
      document.selection.empty();
    }
  }

  function addDeselect(arr) {
    arr.forEach(function (item) {
      item.on('success', function () {
        deselectAll();
      });
    });
  }

  function autosize(element){
    var el = element;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
  }

});
