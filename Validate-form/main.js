function Validation(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  let formElement = document.querySelector(options.form);
  let selectorRules = {};
  function validate(inputElement, rule) {
    //getParent(inputElement, options.formGroup);
    let formMessage = getParent(inputElement, options.formGroup).querySelector(options.errorMessage);
    let rules = selectorRules[rule.selector];
    let errorMessage;
    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          console.log(formElement.querySelector(rule.selector + ":checked"));
          errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) {
        break;
      }
    }
    if (errorMessage) {
      formMessage.innerText = errorMessage;
      getParent(inputElement, options.formGroup).classList.add("invalid");
    }
    return !errorMessage;
  }
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;
      options.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        if (typeof options.Submit === "function") {
          let selectorInputs = formElement.querySelectorAll("[name]:not([disabled])");
          let inputValues = Array.from(selectorInputs).reduce((values, input) => {
            switch (input.type) {
              case "checkbox":
                if (input.matches(":checked")) {
                  if (!Array.isArray(values[input.name])) {
                    values[input.name] = [];
                  }
                  values[input.name].push(input.value);
                }
                break;
              case "radio":
                if (input.matches(":checked")) {
                  values[input.name] = input.value;
                }
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value.trim();
            }
            return values;
          }, {});
          options.onSubmit(inputValues);
        } else {
          formElement.submit();
        }
      }
    };
    options.rules.forEach((rule) => {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach((inputElement) => {
        if (inputElement) {
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };
        }
        //Khi user bắt đầu nhập value
        inputElement.oninput = function () {
          let formGroup = getParent(inputElement, options.formGroup);
          if (formGroup) {
            let formMessage = formGroup.querySelector(options.errorMessage);
            if (formMessage) {
              if (formGroup.classList.contains("invalid")) {
                formGroup.classList.remove("invalid");
                formMessage.innerText = "";
              }
            }
          }
        };
      });
    });
  }
}
//Định ra các rules
//Nếu không có lỗi thì trả ra undefined
//Có lỗi trả ra message lỗi
Validation.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      if (typeof value === "string") {
        return value.trim() ? undefined : message;
      } else {
        return value ? undefined : message;
      }
    },
  };
};
Validation.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message;
    },
  };
};
Validation.isPassword = function (selector, min) {
  return {
    selector,
    test: function (value) {
      return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};
Validation.isConfirm = function (selector, confirm, message) {
  return {
    selector,
    test: function (value) {
      return value === confirm() ? undefined : message;
    },
  };
};
