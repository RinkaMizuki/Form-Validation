//Đối tượng `Validator`
function Vadidation(options) {
  var selectorRules = {};
  const formElement = document.querySelector(options.form);
  function validate(inputElement, rule) {
    let spanMessage = inputElement.parentElement.querySelector(options.errorMessage);
    let errorMessage;
    //Lấy ra các rule của selector
    let rules = selectorRules[rule.selector];
    //Lặp qua các rule và kiểm tra
    //Nếu lỗi ở rule nào thì dừng ở rule đó
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }
    if (errorMessage) {
      spanMessage.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      spanMessage.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }
  if (formElement) {
    console.log(formElement.querySelectorAll("[name]:not(disabled)"));
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFormValid = true;
      options.rules.forEach((rule) => {
        let inputElement = document.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        if (typeof options.Submit === "function") {
          let enableInputs = formElement.querySelectorAll("[name]:not([disabled])");
          console.log(Array.from(enableInputs));
          let formValues = Array.from(enableInputs).reduce((values, input) => {
            return (values[input.name] = input.value) && values;
          }, {});
          options.Submit(formValues);
        }
      }
    };
    //Lặp qua mỗi rule và xử lí( lắng nghe sự kiện)
    options.rules.forEach((rule) => {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElement = document.querySelector(rule.selector);
      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        inputElement.oninput = function () {
          let spanMessage = inputElement.parentElement.querySelector(options.errorMessage);
          spanMessage.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

//Định nghĩa các rules
Vadidation.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập đầy đủ họ tên";
    },
  };
};
Vadidation.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || "Vui lòng nhập email";
    },
  };
};

Vadidation.isPassword = function (selector, min, message) {
  return {
    selector,
    test: function (value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};
Vadidation.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || "Vui lòng nhập lại mật khẩu";
    },
  };
};
