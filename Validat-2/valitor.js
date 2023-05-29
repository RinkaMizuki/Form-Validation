function Validation(registerForm, options = {}) {
  let formRules = {};
  let _this = this;
  let validateRules = {
    required: function (value) {
      if (typeof value === "string") {
        return value.trim() ? undefined : "Vui lòng nhập trường này";
      } else {
        return value ? undefined : "Vui lòng nhập trường này";
      }
    },
    email: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Trường này phải là email";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
      };
    },
    confirm: function (value) {
      return value === document.querySelector("#register-form #password").value ? undefined : "Nhập lại mật khẩu không chính xác";
    },
  };

  let formElement = document.querySelector(registerForm);
  let inputElements = formElement.querySelectorAll("[name][rules]");
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  inputElements.forEach((input) => {
    let rules = input.getAttribute("rules").split("|");
    for (let rule of rules) {
      let ruleFunc = validateRules[rule];
      if (rule.includes(":")) {
        let ruleInfo = rule.split(":");
        ruleFunc = validateRules[ruleInfo[0]](ruleInfo[1]);
      }
      if (Array.isArray(formRules[input.name])) {
        if (formRules[input.name].includes(ruleFunc)) {
          break;
        }
        formRules[input.name].push(ruleFunc);
      } else {
        formRules[input.name] = [ruleFunc];
      }
    }
    //Lắng nghe sk
    input.onblur = handleValidate;
    input.oninput = handleClearError;
  });
  //Xử lí validate
  function handleValidate(event) {
    let rules = formRules[event.target.name];
    let errorMessage;
    for (let rule of rules) {
      switch (event.target.type) {
        case "checkbox":
        case "radio":
          errorMessage = rule(formElement.querySelector('input[name="' + event.target.name + '"]:checked'));
          break;

        default:
          errorMessage = rule(event.target.value);
      }
      if (errorMessage) break;
    }
    if (errorMessage) {
      let parent = getParent(event.target, ".form-group");
      parent.classList.add("invalid");
      parent.querySelector(".form-message").innerText = errorMessage;
    }
    return !errorMessage;
  }
  function handleClearError(event) {
    let parent = getParent(event.target, ".form-group");
    if (parent.classList.contains("invalid")) {
      parent.classList.remove("invalid");
      parent.querySelector(".form-message").innerText = "";
    }
  }
  //Xử lí submit form
  formElement.onsubmit = function (event) {
    event.preventDefault();
    let isValid = true;
    for (let input of inputElements) {
      if (
        !handleValidate({
          target: input,
        })
      ) {
        isValid = false;
      }
    }
    if (isValid) {
      if (typeof options.onSubmit === "function") {
        let inputValues = Array.from(inputElements).reduce((values, input) => {
          switch (input.type) {
            case "checkbox":
              if (input.matches(":checked")) {
                if (Array.isArray(values[input.name])) {
                  values[input.name].push(input.value);
                } else {
                  values[input.name] = [input.value];
                }
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
}

// let People = (name, age) => {
//   this.name = name;
//   this.age = age;
// };

// let newPeople = new People("duc", 29);
// console.log(newPeople);
let fieldName = "name";
let fieldPrice = "price";

const course = {
  [fieldName]: "Javascript",
  [fieldPrice]: 1111,
};
course["asdasd"] = 123213;
console.log(course);

function arrToObj(arr) {
  return arr.reduce((obj, item) => {
    const [key, value] = item;
    return { ...obj, [key]: value };
  }, {});
}
const obj1 = arrToObj([
  ["name", "Son Dang"],
  ["age", 21],
  ["address", "Ha Noi"],
]);
console.log(obj1);

let destruc = {
  name: "Java",
  price: 4000,
  image: "image-address",
  children: {
    name: "C#",
    price: 2000,
  },
};

let {
  price,
  children: { name: name1, price: price1 },
} = destruc;

// console.log(name, image);
console.log(price1);

let array = {
  name: "Duc",
  age: 19,
  address: "Hcm",
};

// let array = [1, 3, 4, 5, 6];

function person({ name, ...rest }) {
  console.log(name);
  console.log(rest);
}
person(array);

let [key, value] = ["name", "duc"];
console.log({ [key]: value });

var page1 = {
  api: "http://trang-home",
  course: "java",
  orther: "orther",
};
var page2 = {
  api: "http://trang-bai-tap",
  course: "javascript",
};

var newObj = {
  ...page1,
  ...page2,
};
console.log(newObj);
