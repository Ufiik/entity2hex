document.addEventListener('DOMContentLoaded', function () {

  var entityInput = document.getElementById('entity-input'),
      entityInputContainer = document.getElementById('entity-input-character'),
      currentContainer = document.getElementById('current'),
      hiddenCharacter = document.getElementById('hidden-character'),

      regSearchNum = /&#\d/,
      regSearchWord = /&\w/,
      regSearchWrongNum = /^&#([0-9]|[1-2][\d]|3[0-2])$/,
      regGetAllNum = /\d+/g,

      outputCss = document.getElementById('css-value'),
      outputJs = document.getElementById('js-value');


  entityInput.addEventListener('input', function () {
      hiddenCharacter.innerHTML = this.value;

      if (!(regSearchWrongNum.test(this.value)) && regSearchNum.test(this.value)) {
        makeOutput.call(this, this.value.match(regGetAllNum)[0]);
      }

      if (regSearchWord.test(this.value) && hiddenCharacter.textContent.length === 1) {
        makeOutput.call(this, hiddenCharacter.textContent.charCodeAt(0));
      }
  });

  entityInputContainer.addEventListener('input', function () {
    makeOutput.call(this, this.value.charCodeAt(0));
    
    if (this.value.length === 0) {
      this.value = "";
    }
  });

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

  console.log("P".charCodeAt(0));

  new ClipboardJS("#ex");

});
