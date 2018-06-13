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

      outputCss = document.getElementById('css-value'),
      outputJs = document.getElementById('js-value');

// Для обработки числового обозначения и мнемоники
  entityInput.addEventListener('input', function () {
      hiddenCharacter.innerHTML = this.value;

      if (!(regSearchWrongNum.test(this.value)) && regSearchNum.test(this.value)) {
        makeOutput.call(this, this.value.match(regGetAllNum)[0]);
      }

      if (regSearchWord.test(this.value) && hiddenCharacter.textContent.length === 1) {
        makeOutput.call(this, hiddenCharacter.textContent.charCodeAt(0));
      }
  });

// Для обработки символа
  entityInputContainer.addEventListener('input', function () {
    makeOutput.call(this, this.value.charCodeAt(0));

    if (this.value.length === 0) {
      outputCss.value = outputJs.value = "";
    }
  });

// Для отмены выделения при коппировании в буффер
  var copyCssBtn = new ClipboardJS("#copy-css");
  var copyJsBtn = new ClipboardJS("#copy-js");


  addDeselect([copyCssBtn, copyJsBtn]);

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

  function makeOutput(value) {
    var hexValue = toHex(value);

    currentContainer.textContent = hiddenCharacter.textContent;

    outputCss.value = addLeftCharacters(hexValue, "\\", 5);
    outputJs.value = addLeftCharacters(hexValue, "\\u", 6);
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
});
