const _getUsersApiUrl = "https://randomapi.com/api/92bcb32a4c1bcef53031853229d88fc7?results=10";
const _loader = "loader", _usersDropdown = "usersDropdown", _avatar = "avatar", _form = "form",
    _content = "content", _error = "error";
vars = [];

var users = [];
var userInfo = null;
var img = new Image();

(function () {
    GetOrSetDOMVar(_usersDropdown).addEventListener("change", DisplayUserInfo);
    setTimeout(function () {
        GetUsers();
    }, 1000);
})();

function GetUsers() {
    fetch(_getUsersApiUrl)
        .then(resp => {
            if (resp.ok) {
                return resp.json()
            } else {
                throw new Error('Something went wrong!')
            }
        })
        .then(resp => {
            users = resp.results;
            return users;
        })
        .then(users => {
            users.forEach((user, i) => {
                GetOrSetDOMVar(_usersDropdown).add(new Option(user.name, i));
            })
        })
        .then(() => {
            Hide(_loader);
            Show(_content);
        })
        .catch(error => {
            Hide(_loader);
            Show(_error);
        });
}

function DisplayUserInfo() {
    Show(_loader);
    let selectedUser = this.value;
    PopulateUserInfoDOMObj(selectedUser);
    LoadImage(users[selectedUser].avatar)
        .then(img => GetOrSetDOMVar(_avatar).appendChild(img))
        .then(() => {
            Show(_form);
        })
        .then(sleeper(500))
        .then(() => Hide(_loader))
}

function PopulateUserInfoDOMObj(selectedUser) {
    InitUserInfoDOMObj();
    userInfo.nameLbl.innerText = users[selectedUser].name;
    userInfo.jobTitleLbl.innerText = users[selectedUser].jobTitle;
    userInfo.aboutLbl.innerText = users[selectedUser].about;
    userInfo.ageLbl.innerText = users[selectedUser].age;
    userInfo.emailLbl.innerText = users[selectedUser].email;
}

function InitUserInfoDOMObj() {
    if (!userInfo) {
        userInfo = {};
        userInfo.nameLbl = document.getElementById("name");
        userInfo.jobTitleLbl = document.getElementById("jobTitle");
        userInfo.aboutLbl = document.getElementById("about");
        userInfo.ageLbl = document.getElementById("age");
        userInfo.emailLbl = document.getElementById("email");
        userInfo.avatar = document.getElementById("avatar");
    }
}
function LoadImage(src) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function Show(element) {
    GetOrSetDOMVar(element).style.display = "inline-block";
}

function Hide(element) {
    GetOrSetDOMVar(element).style.display = "none";
}

function sleeper(ms) {
    return function (x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

function GetOrSetDOMVar(variable) {
    if (!vars.includes(variable)) {
        vars[variable] = document.getElementById(variable);
    }

    return vars[variable];
}